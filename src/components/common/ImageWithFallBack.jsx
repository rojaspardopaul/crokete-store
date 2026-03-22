"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const fallbackImage =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const ImageWithFallback = ({
  src,
  img, // kept for backward compatibility but ignored — always uses next/image
  fallback = fallbackImage,
  alt = "image",
  ...props
}) => {
  // Ensure we never pass an empty/falsy src to next/image
  const validSrc = typeof src === "string" && src.trim() !== "" ? src : fallback;
  const [imgSrc, setImgSrc] = useState(validSrc);

  useEffect(() => {
    const next = typeof src === "string" && src.trim() !== "" ? src : fallback;
    setImgSrc(next);
  }, [src, fallback]);

  return (
    <Image
      src={imgSrc || fallback}
      onError={() => setImgSrc(fallback)}
      alt={alt}
      {...props}
      className={`object-contain transition duration-150 ease-linear transform group-hover:scale-105 p-2 ${
        props.className || ""
      }`}
      style={{
        objectFit: "contain",
        ...props.style,
      }}
    />
  );
};

export default ImageWithFallback;
