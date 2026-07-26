import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { notifyError } from "@utils/toast";
import { uploadCustomerImage } from "@services/UploadServices";

/** El archivo se manda al backend como data-URI. */
const toDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });

const Uploader = ({ setImageUrl, imageUrl, multiple }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // console.log("imageUrl", imageUrl);
  // console.log("uploadUrl", uploadUrl);
  // console.log("upload_Preset", upload_Preset);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: multiple || false,
    maxSize: 1000000, //the size of image,
    onDrop: (acceptedFiles) => {
      // console.log("acceptedFiles", acceptedFiles);

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    if (!files?.length) return;

    if (multiple && imageUrl?.length + files?.length > 4) {
      return notifyError(`Se pueden subir hasta 4 imagenes como máximo!`);
    }

    let cancelled = false;

    (async () => {
      setUploading(true);
      for (const file of files) {
        try {
          const dataUri = await toDataUri(file);
          const { url, error } = await uploadCustomerImage(dataUri);
          if (cancelled) return;
          if (error || !url) {
            notifyError(error || "No se pudo subir la imagen.");
            continue;
          }
          if (multiple) {
            setImageUrl((imgUrl) => [...imgUrl, url]);
          } else {
            setImageUrl(url);
          }
        } catch (err) {
          if (!cancelled) notifyError(err.message);
        }
      }
      if (!cancelled) setUploading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <div className="w-full text-center">
      <div
        className="px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-kachabazar-500" />
        </span>
        <p className="text-sm mt-2">
          {uploading ? "Subiendo imagen…" : "Arrastra tu imagen aquí"}
        </p>
        <em className="text-xs text-gray-400">
          (Solo se aceptarán imágenes *.jpeg, *.png y *.webp)
        </em>
      </div>
      <aside className="flex flex-row flex-wrap mt-4">
        {multiple && imageUrl ? (
          imageUrl?.map((img, index) => (
            <img
              key={index + 1}
              className="inline-flex border rounded-md border-gray-100 w-24 max-h-24 p-2"
              src={img}
              alt="product"
            />
          ))
        ) : imageUrl ? (
          <img
            className="inline-flex border rounded-md border-gray-100 w-24 max-h-24 p-2"
            src={imageUrl}
            alt="product"
          />
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;
