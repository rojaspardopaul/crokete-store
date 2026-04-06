import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "@utils/toast";
import { addReview, updateReview } from "@services/ReviewServices";
import MainModal from "./MainModal";
import { Button } from "@components/ui/button";
import Uploader from "@components/image-uploader/Uploader";

const PawIcon = ({ className = "", filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? "0" : "1.5"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 17.5c-2.5 0-4.5-1.5-4.5-3.5s2-4 4.5-4 4.5 2 4.5 4-2 3.5-4.5 3.5z" />
    <ellipse cx="7.5" cy="7" rx="2" ry="2.5" />
    <ellipse cx="16.5" cy="7" rx="2" ry="2.5" />
    <ellipse cx="5" cy="11.5" rx="1.8" ry="2.3" />
    <ellipse cx="19" cy="11.5" rx="1.8" ry="2.3" />
  </svg>
);

const COMMENT_MIN = 10;
const COMMENT_MAX = 1000;

const ReviewModal = ({ title, edit, isOpen, onClose, product, userName }) => {
  const [hover, setHover] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const [rating, setRating] = useState(product?.review?.rating || 0);
  const [commentLen, setCommentLen] = useState(0);

  const {
    reset,
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const commentValue = watch("comment", "");

  useEffect(() => {
    setCommentLen(commentValue?.length || 0);
  }, [commentValue]);

  const submitReview = async (data) => {
    if (rating <= 0) return notifyError("Es necesario dar una calificación!");
    try {
      setIsLoading(true);
      const updatedData = {
        ...data,
        rating,
        product: product._id,
        images: imageUrl,
      };
      if (edit) {
        updatedData.reviewId = product.review._id; // must be review _id
      }

      const res = edit
        ? await updateReview(updatedData)
        : await addReview(updatedData);
      // console.log("Review submitted:", res, "updatedData", updatedData);
      if (res.error) {
        setIsLoading(false);
        return notifyError(res.error);
      }
      notifySuccess(
        edit
          ? "Reseña actualizada con éxito!"
          : "¡Gracias! Tu reseña será revisada antes de publicarse."
      );

      // Reset form and close modal
      reset();
      onClose();

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      // console.error("Submit failed", err);
    }
  };

  useEffect(() => {
    setRating(product?.review?.rating || 0);
    setValue("comment", product?.review?.comment || "");
    setValue("title", product?.review?.title || "");
    setValue("displayName", product?.review?.displayName || userName || "");
    setImageUrl(product?.review?.images?.filter(Boolean) || []);
  }, [product, userName]);

  return (
    <MainModal
      modalOpen={isOpen}
      bottomCloseBtn={true}
      handleCloseModal={onClose}
    >
      <div className="flex items-center justify-center">
        <div className="relative bg-white rounded-lg w-full max-w-4xl z-50">
          <h1 className="text-base font-semibold mb-4">{`Reseña para ${title}`}</h1>

          {/* Paw rating */}
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => {
              const pawValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  className="transition-transform hover:scale-110"
                  onClick={() => setRating(pawValue)}
                  onMouseEnter={() => setHover(pawValue)}
                  onMouseLeave={() => setHover(null)}
                >
                  <PawIcon
                    className={`w-7 h-7 ${
                      pawValue <= (hover || rating)
                        ? "text-amber-500"
                        : "text-gray-300"
                    }`}
                    filled={pawValue <= (hover || rating)}
                  />
                </button>
              );
            })}
            {(hover || rating) > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                {["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"][hover || rating]}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-4">Selecciona de 1 a 5 huellitas</p>

          <form onSubmit={handleSubmit(submitReview)} className="space-y-3">
            {/* Title */}
            <div>
              <input
                {...register("title", { maxLength: 100 })}
                placeholder="Título de tu reseña (opcional)"
                maxLength={100}
                className="w-full border-1 focus:ring-0 placeholder:text-sm text-sm focus:outline-none ring-0 border-gray-300 rounded p-2"
              />
            </div>

            {/* Display name */}
            <div>
              <input
                {...register("displayName", { maxLength: 50 })}
                placeholder="Tu nombre público (opcional)"
                maxLength={50}
                className="w-full border-1 focus:ring-0 placeholder:text-sm text-sm focus:outline-none ring-0 border-gray-300 rounded p-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                Se mostrará en lugar de tu nombre real
              </p>
            </div>

            {/* Comment */}
            <div>
              <textarea
                {...register("comment", {
                  minLength: {
                    value: COMMENT_MIN,
                    message: `Mínimo ${COMMENT_MIN} caracteres`,
                  },
                  maxLength: {
                    value: COMMENT_MAX,
                    message: `Máximo ${COMMENT_MAX} caracteres`,
                  },
                })}
                placeholder="Escribe tus comentarios..."
                maxLength={COMMENT_MAX}
                className="w-full border-1 focus:ring-0 placeholder:text-sm text-sm focus:outline-none ring-0 border-gray-300 rounded p-2 min-h-[80px]"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.comment ? (
                  <p className="text-xs text-red-500">{errors.comment.message}</p>
                ) : (
                  <span />
                )}
                <span
                  className={`text-xs ${
                    commentLen > COMMENT_MAX ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {commentLen}/{COMMENT_MAX}
                </span>
              </div>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center">
                <Uploader
                  multiple
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                />
              </div>
            </div>

            {/* Moderation notice */}
            {!edit && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded p-2">
                🐾 Tu reseña será revisada antes de publicarse. Esto suele tomar poco tiempo.
              </p>
            )}

            <Button
              type="submit"
              variant="create"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full mt-4"
            >
              {isLoading ? "Procesando..." : edit ? "Actualizar Reseña" : "Enviar Reseña"}
            </Button>
          </form>
        </div>
      </div>
    </MainModal>
  );
};

export default ReviewModal;
