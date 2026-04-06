"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Rating from "@components/common/Rating";
import ReviewSummary from "@components/review/ReviewSummary";
import ReviewDistribution from "@components/review/ReviewDistribution";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X, ThumbsUp } from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import dynamic from "next/dynamic";
import { toggleHelpful } from "@services/ReviewServices";

const ProductReviews = ({ reviews }) => {
  const [zoomImage, setZoomImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [helpfulMap, setHelpfulMap] = useState({});

  const openZoom = (images, index) => {
    setZoomImage(images);
    setCurrentIndex(index);
  };

  const closeZoom = () => {
    setZoomImage(null);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    if (zoomImage) {
      setCurrentIndex((prev) => (prev + 1) % zoomImage.length);
    }
  };

  const prevImage = () => {
    if (zoomImage) {
      setCurrentIndex(
        (prev) => (prev - 1 + zoomImage.length) % zoomImage.length
      );
    }
  };

  const handleHelpful = async (reviewId) => {
    if (helpfulMap[reviewId]) return;
    const res = await toggleHelpful(reviewId);
    if (!res.error) {
      setHelpfulMap((prev) => ({ ...prev, [reviewId]: true }));
    }
  };

  return (
    <>
      <Transition
        show={true}
        as="div"
        enter="transition-opacity duration-300"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-screen"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100 max-h-screen"
        leaveTo="opacity-0 max-h-0"
      >
        <TransitionChild
          as="div"
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative">
            {/* Summary & Distribution */}
            {reviews?.length > 0 ? (
              <>
                <ReviewSummary
                  reviews={reviews}
                  onWriteReview={() => window.location.href = "/user/my-reviews"}
                />
                <ReviewDistribution reviews={reviews} />
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm mb-3">
                  Aún no hay reseñas para este producto. ¡Sé el primero!
                </p>
                <Link
                  href="/user/my-reviews"
                  className="inline-block px-4 py-2 text-sm font-medium bg-kachabazar-500 text-white rounded-lg hover:bg-kachabazar-600 transition-colors"
                >
                  Escribir reseña
                </Link>
              </div>
            )}

            {reviews?.map((review) => {
              const userName =
                review?.displayName || review?.user?.name || "Anónimo";
              const userInitial = userName.charAt(0);
              const userAvatar = "/avatar-placeholder.png";

              return (
                <div
                  key={review._id}
                  className="flex space-x-4 text-sm text-gray-500"
                >
                  {/* Avatar */}
                  <div className="flex-none py-6">
                    <Image
                      src={userAvatar}
                      alt={userInitial}
                      width={42}
                      height={42}
                      className="rounded-full"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="py-6 w-full">
                    <h3 className="font-medium mb-1 text-gray-900">
                      {userName}
                    </h3>
                    <Rating size="xs" rating={review.rating} showReviews={false} />
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>

                    {review.title && (
                      <p className="font-semibold text-gray-800 mt-2">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 mt-1">{review.comment}</p>

                    {/* Review Images */}
                    {review.images?.filter(Boolean).length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-3">
                        {review.images.filter(Boolean).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 cursor-pointer"
                          >
                            <Image
                              src={img}
                              alt="review image"
                              fill
                              sizes="64px"
                              style={{ objectFit: "cover" }}
                              className="rounded-md border"
                              onClick={() =>
                                openZoom(review.images.filter(Boolean), idx)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Helpful button */}
                    <button
                      onClick={() => handleHelpful(review._id)}
                      disabled={helpfulMap[review._id]}
                      className={`flex items-center gap-1 mt-3 text-xs transition-colors ${
                        helpfulMap[review._id]
                          ? "text-kachabazar-600 font-medium"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <ThumbsUp size={14} />
                      <span>
                        Útil
                        {(review.helpfulVotes > 0 || helpfulMap[review._id]) &&
                          ` (${(review.helpfulVotes || 0) + (helpfulMap[review._id] ? 1 : 0)})`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Zoom Modal */}
          <Dialog
            open={!!zoomImage}
            onClose={closeZoom}
            className="fixed inset-0 z-50"
          >
            <div className="flex items-center justify-center min-h-screen bg-black/80">
              <DialogPanel className="relative max-w-3xl w-full p-4 bg-white rounded-lg">
                <button
                  onClick={closeZoom}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-md text-white cursor-pointer z-10"
                >
                  <X size={18} />
                </button>
                {zoomImage && (
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={prevImage}
                      className="absolute left-0 p-2 text-gray-400 bg-gray-50 shadow-sm hover:bg-gray-100 hover:shadow-lg rounded-full z-10"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <Image
                      src={zoomImage[currentIndex]}
                      alt="Zoomed review"
                      width={650}
                      height={650}
                      sizes="(max-width: 768px) 100vw, 
                             (max-width: 1200px) 80vw, 
                             650px"
                      className="rounded-lg"
                    />
                    <button
                      onClick={nextImage}
                      className="absolute right-0 p-2 text-gray-400 bg-gray-50 shadow-sm hover:bg-gray-100 hover:shadow-lg rounded-full z-10"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </DialogPanel>
            </div>
          </Dialog>
        </TransitionChild>
      </Transition>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductReviews), { ssr: false });
