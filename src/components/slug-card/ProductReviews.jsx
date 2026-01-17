"use client";

import { useState } from "react";
import Image from "next/image";
import Rating from "@components/common/Rating";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import dynamic from "next/dynamic";

const ProductReviews = ({ reviews }) => {
  const [zoomImage, setZoomImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
            {reviews?.map((review) => {
              const userName = review?.user?.name || "Anonymous";
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

                    <p className="text-sm text-gray-700 mt-2">{review.comment}</p>

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
