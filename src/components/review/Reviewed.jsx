import React, { useState } from "react";
import ReviewModal from "@components/modal/ReviewModal";
import Rating from "@components/common/Rating";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import Pagination from "@components/pagination/Pagination";
import { useRouter } from "next/navigation";

const STATUS_BADGES = {
  approved: {
    label: "Aprobada ✓",
    className: "bg-green-100 text-green-700",
  },
  pending: {
    label: "En revisión ⏳",
    className: "bg-amber-100 text-amber-700",
  },
  rejected: {
    label: "Rechazada ✗",
    className: "bg-red-100 text-red-700",
  },
};

const Reviewed = ({ reviews, error }) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProduct(null);
  };
  const handleChangePage = (page) => {
    // console.log("handleChangePage::", page);
    router.push(`?page=${page}`);
  };

  // console.log("reviews", reviews);

  return (
    <div>
      {error ? (
        <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
          {error}
        </h2>
      ) : reviews?.reviewed?.length === 0 ? (
        <p className="text-rose-500 text-center">
          Aún no has reseñado ningún producto.
        </p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {reviews?.reviewed?.map((item, index) => (
              <div
                key={index + 1}
                className="p-3 gap-1 bg-white shadow-xs rounded-lg flex flex-col items-center"
              >
                {/* Image */}
                <ImageWithFallback
                  width="80"
                  height="80"
                  alt="product"
                  src={item?.image}
                />

                {/* Title */}
                <h3 className="font-medium text-sm text-center text-gray-800 mb-0 line-clamp-1">
                  {item?.title}
                </h3>

                {/* Rating */}
                <div className="mb-0">
                  <Rating
                    size="xs"
                    showReviews={false}
                    rating={item?.review?.rating || 0}
                  />
                </div>

                {/* Status Badge */}
                {item?.review?.status && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      STATUS_BADGES[item.review.status]?.className ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_BADGES[item.review.status]?.label ||
                      item.review.status}
                  </span>
                )}

                {/* Review Button */}
                <button
                  onClick={() => openModal(item)}
                  className="mt-auto px-4 py-1 text-sm font-medium 0 text-kachabazar-500 rounded hover:text-kachabazar-600 w-full"
                >
                  Editar Reseña
                </button>
              </div>
            ))}
          </div>
          {reviews?.totalReviewed > 10 && (
            <Pagination
              resultsPerPage={10}
              onChange={handleChangePage}
              label="Product Page Navigation"
              totalResults={reviews?.totalReviewed}
            />
          )}
        </div>
      )}

      {selectedProduct && (
        <ReviewModal
          edit
          isOpen={isOpen}
          onClose={closeModal}
          product={selectedProduct}
          title={selectedProduct?.title}
        />
      )}
    </div>
  );
};

export default Reviewed;
