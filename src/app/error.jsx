"use client"; // Error components must be Client Components

import { useEffect } from "react";

const Error = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("error", error.message);
  }, [error]);

  return (
    <div className="h-screen text-center">
      <h2 className="text-red-500">¡Algo salió mal! {error.message}</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Intentar de nuevo
      </button>
    </div>
  );
};

export default Error;
