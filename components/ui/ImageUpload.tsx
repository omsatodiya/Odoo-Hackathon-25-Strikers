"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CloudinaryUploadResponse, UploadOptions } from "@/types";

interface ImageUploadProps {
  onUploadComplete: (result: CloudinaryUploadResponse) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  acceptedFormats?: string[];
  maxFileSize?: number; // in MB
  className?: string;
  uploadOptions?: UploadOptions;
  showPreview?: boolean;
}

export default function ImageUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 1,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxFileSize = 10, // 10MB
  className,
  uploadOptions = {},
  showPreview = true,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    uploadImage,
    uploadMultipleImages,
    isLoading,
    error,
    progress,
    clearError,
  } = useCloudinaryUpload();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      files.forEach((file) => {
        // Check file type
        if (!acceptedFormats.includes(file.type)) {
          errors.push(`${file.name} is not a supported file type`);
          return;
        }

        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
          errors.push(
            `${file.name} is too large. Maximum size is ${maxFileSize}MB`
          );
          return;
        }

        validFiles.push(file);
      });

      if (errors.length > 0) {
        onUploadError?.(errors.join(", "));
        return [];
      }

      return validFiles;
    },
    [acceptedFormats, maxFileSize, onUploadError]
  );

  const createPreviewUrls = useCallback((files: File[]) => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validFiles = validateFiles(fileArray);

      if (validFiles.length === 0) return;

      const filesToProcess =
        maxFiles === 1 ? validFiles.slice(0, 1) : validFiles.slice(0, maxFiles);
      setSelectedFiles(filesToProcess);

      if (showPreview) {
        createPreviewUrls(filesToProcess);
      }
    },
    [validateFiles, maxFiles, showPreview, createPreviewUrls]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    try {
      clearError();

      if (selectedFiles.length === 1) {
        const result = await uploadImage(selectedFiles[0], uploadOptions);
        onUploadComplete(result);
      } else {
        const results = await uploadMultipleImages(
          selectedFiles,
          uploadOptions
        );
        // For multiple files, call onUploadComplete for each result
        results.forEach((result) => onUploadComplete(result));
      }

      // Clear selected files after successful upload
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      // Error is already handled by the hook
    }
  }, [
    selectedFiles,
    uploadImage,
    uploadMultipleImages,
    uploadOptions,
    onUploadComplete,
    clearError,
  ]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the removed URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={acceptedFormats.join(",")}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          selectedFiles.length > 0 && "border-primary bg-primary/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                Drop files here or{" "}
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-primary hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {maxFiles === 1
                  ? "Upload an image"
                  : `Upload up to ${maxFiles} images`}
                (Max {maxFileSize}MB each)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && selectedFiles.length > 0 && (
        <div className="space-y-3">
          <Label>Preview</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                  <Image
                    src={previewUrls[index]}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && !isLoading && (
        <Button onClick={handleUpload} className="w-full" disabled={isLoading}>
          <Upload className="h-4 w-4 mr-2" />
          Upload {selectedFiles.length}{" "}
          {selectedFiles.length === 1 ? "Image" : "Images"}
        </Button>
      )}
    </div>
  );
}
