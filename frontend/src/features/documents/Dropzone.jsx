import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText } from "lucide-react";

export function Dropzone({ onFileAccepted, disabled = false }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] select-none ${
        isDragActive
          ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
          : "border-slate-200 bg-white hover:border-[#0F3A2E] hover:bg-slate-50/50"
      } ${disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
    >
      <input {...getInputProps()} />

      <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 shadow-sm border border-sky-100">
        <UploadCloud className="w-7 h-7 text-sky-500" />
      </div>

      <p className="text-sm font-bold text-slate-800">
        {isDragActive
          ? "Drop your receipt file here..."
          : "Drop your file here, or click to upload"}
      </p>

      <p className="text-xs text-slate-400 mt-1.5">
        Supports: JPG, PNG, PDF (Max 10MB)
      </p>
    </div>
  );
}

export default Dropzone;
