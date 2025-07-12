import { useState, useCallback } from "react";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { CloudinaryUploadResponse, UploadOptions } from "@/types";

interface UseCloudinaryUploadReturn {
  uploadImage: (file: File, options?: UploadOptions) => Promise<CloudinaryUploadResponse>;
  uploadMultipleImages: (files: File[], options?: UploadOptions) => Promise<CloudinaryUploadResponse[]>;
  isLoading: boolean;
  error: string | null;
  progress: number;
  clearError: () => void;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResponse> => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress (Cloudinary doesn't provide upload progress via fetch)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const result = await uploadToCloudinary(file, options);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsLoading(false);
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const uploadMultipleImages = useCallback(async (
    files: File[], 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResponse[]> => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const results = await uploadMultipleToCloudinary(files, options);
      setProgress(100);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  return {
    uploadImage,
    uploadMultipleImages,
    isLoading,
    error,
    progress,
    clearError,
  };
}; 