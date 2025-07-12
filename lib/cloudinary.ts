import { 
  CloudinaryUploadResponse, 
  CloudinaryError, 
  CloudinaryConfig, 
  UploadOptions 
} from "@/types";

// Cloudinary config
const cloudinaryConfig: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'blogs_HB',
  folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || '', 
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
};

const validateFile = (file: File): void => {

  if (file.size > cloudinaryConfig.maxFileSize) {
    throw new Error(`File size must be less than ${cloudinaryConfig.maxFileSize / (1024 * 1024)}MB`);
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !cloudinaryConfig.allowedFormats.includes(fileExtension)) {
    throw new Error(`File format not supported. Allowed formats: ${cloudinaryConfig.allowedFormats.join(', ')}`);
  }
};

const generatePublicId = (fileName: string, folder?: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9]/g, '_');
  
  if (!folder || folder.trim() === '') {
    return `${cleanFileName}_${timestamp}_${randomString}`;
  }
  
  return `${folder}/${cleanFileName}_${timestamp}_${randomString}`;
};

export const uploadToCloudinary = async (
  file: File, 
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> => {

  if (!cloudinaryConfig.cloudName) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  if (!cloudinaryConfig.uploadPreset) {
    throw new Error('Cloudinary upload preset is not configured');
  }

  validateFile(file);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  const uploadFolder = options.folder || cloudinaryConfig.folder;
  if (uploadFolder && uploadFolder.trim() !== '') {
    formData.append('folder', uploadFolder);
  }

  if (options.publicId) {
    formData.append('public_id', options.publicId);
  } else {
    formData.append('public_id', generatePublicId(file.name, options.folder));
  }

  if (options.transformation) {
    formData.append('transformation', options.transformation);
  }

  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as CloudinaryError;
      console.error('Cloudinary Error Response:', error);
      throw new Error(error.error?.message || 'Upload failed');
    }

    return data as CloudinaryUploadResponse;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Upload failed');
  }
};

// Upload multiple files
export const uploadMultipleToCloudinary = async (
  files: File[], 
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, options));
  
  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (): Promise<void> => {
  throw new Error('Delete functionality requires server-side implementation');
};

export const getOptimizedImageUrl = (
  publicId: string, 
  transformations: string = 'f_auto,q_auto,w_auto'
): string => {
  if (!cloudinaryConfig.cloudName) {
    throw new Error('Cloudinary cloud name is not configured');
  }
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformations}/${publicId}`;
};

export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com');
};

export const getPublicIdFromUrl = (url: string): string | null => {
  if (!isCloudinaryUrl(url)) {
    return null;
  }

  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;

    const publicIdParts = urlParts.slice(uploadIndex + 2);
    return publicIdParts.join('/').split('.')[0]; 
  } catch {
    return null;
  }
};
