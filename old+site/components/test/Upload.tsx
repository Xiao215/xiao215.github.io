import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import type { NextPage } from "next";

type FormData = {
  file: FileList;
};

const Upload: NextPage = () => {
  const [message, setMessage] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormData>();

  const onSubmit = async ({ file }: FormData) => {
    setMessage("");
    setUploadedImageUrl(null);

    if (!file[0]) {
      setMessage("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file[0]);

    try {
      const response = await axios.post("/backend/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setMessage("Image uploaded successfully.");
        // Replace with the actual image URL from the response
        setUploadedImageUrl(response.data.imageUrl);
      } else {
        setMessage("An error occurred during the upload.");
      }
    } catch (error) {
      setMessage("An error occurred during the upload.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold">Upload an Image</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          {...register("file")}
          className="p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className={`${
            formState.isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {formState.isSubmitting ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      {uploadedImageUrl && (
        <div className="mt-6">
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="max-w-xs rounded-md shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default Upload;
