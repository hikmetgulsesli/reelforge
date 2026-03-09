"use client";

import { useState, useRef } from "react";
import { Upload, X, Mic, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceCloningUploadProps {
  userPlan: "free" | "starter" | "pro" | "business";
  onUpload: (file: File) => void;
  maxFileSizeMB?: number;
}

export function VoiceCloningUpload({
  userPlan,
  onUpload,
  maxFileSizeMB = 10,
}: VoiceCloningUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isProPlan = userPlan === "pro" || userPlan === "business";
  const maxBytes = maxFileSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("audio/")) {
      return "Lütfen bir ses dosyası yükleyin (MP3, WAV, M4A)";
    }
    if (file.size > maxBytes) {
      return `Dosya boyutu ${maxFileSizeMB}MB'dan küçük olmalıdır`;
    }
    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSelectedFile(file);
    onUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isProPlan) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isProPlan) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (!isProPlan) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3 mb-3">
          <Mic className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-display font-bold text-amber-900 dark:text-amber-300">
            Ses Klonlama
          </h3>
        </div>
        <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
          Kendi sesinizi klonlamak için Pro veya Business plana yükseltme yapın.
        </p>
        <button
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-sm transition-colors"
          onClick={() => window.location.href = "/pricing"}
        >
          Planları Görüntüle
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Mic className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold">Ses Klonlama</h3>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Kendi sesinizi klonlamak için 10 saniye ile 5 dakika arasında temiz bir ses örneği yükleyin.
      </p>

      {selectedFile ? (
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <FileAudio className="w-8 h-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label="Dosyayı kaldır"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-slate-300 dark:border-slate-700 hover:border-primary/50"
          )}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              inputRef.current?.click();
            }
          }}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Ses dosyası yüklemek için tıklayın veya sürükleyin
          </p>
          <p className="text-xs text-slate-500 mt-1">
            MP3, WAV, M4A (max {maxFileSizeMB}MB)
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Ses dosyası yükle"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
