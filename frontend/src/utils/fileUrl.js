/**
 * File URL Utility Functions
 * 
 * This module provides consistent file URL handling across all environments
 * (development, staging, production).
 * 
 * Usage:
 * import { getFileUrl, isValidFileUrl } from '../utils/fileUrl';
 * 
 * const imageUrl = getFileUrl(storedFilename);
 */

const API_BASE = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Convert a stored filename or URL to a full accessible URL
 * Works in any environment by constructing URLs dynamically
 * 
 * @param {string} fileReference - Can be a filename, relative path, or full URL
 * @returns {string|null} - Full URL to access the file, or null if invalid
 */
export const getFileUrl = (fileReference) => {
  if (!fileReference) return null;
  
  // If it's already a full URL, return as is
  if (fileReference.startsWith('http://') || fileReference.startsWith('https://')) {
    // Check if URL needs to be converted from old format to new format
    // Old format: /api/uploads/filename.png
    // New format: /api/files/filename.png
    if (fileReference.includes('/api/uploads/')) {
      return fileReference.replace('/api/uploads/', '/api/files/');
    }
    return fileReference;
  }
  
  // If it's just a filename (no slashes), construct the URL
  if (!fileReference.includes('/')) {
    return `${API_BASE}/api/files/${fileReference}`;
  }
  
  // If it's a relative path starting with /api/files/, prepend API base
  if (fileReference.startsWith('/api/files/')) {
    return `${API_BASE}${fileReference}`;
  }
  
  // If it's an old format relative path /api/uploads/, convert to new format
  if (fileReference.startsWith('/api/uploads/')) {
    const newPath = fileReference.replace('/api/uploads/', '/api/files/');
    return `${API_BASE}${newPath}`;
  }
  
  // If it's just /uploads/, convert to /api/files/
  if (fileReference.startsWith('/uploads/')) {
    const filename = fileReference.replace('/uploads/', '');
    return `${API_BASE}/api/files/${filename}`;
  }
  
  // For any other relative path, try to extract filename and construct URL
  const filename = fileReference.split('/').pop();
  return `${API_BASE}/api/files/${filename}`;
};

/**
 * Extract just the filename from a file URL or path
 * 
 * @param {string} fileReference - URL or path containing filename
 * @returns {string|null} - Just the filename, or null if invalid
 */
export const getFilename = (fileReference) => {
  if (!fileReference) return null;
  
  // Extract filename from URL or path
  const parts = fileReference.split('/');
  return parts[parts.length - 1] || null;
};

/**
 * Check if a file URL/reference is valid and points to our file storage
 * 
 * @param {string} fileReference - URL or path to check
 * @returns {boolean} - True if it's a valid file reference
 */
export const isValidFileUrl = (fileReference) => {
  if (!fileReference || typeof fileReference !== 'string') return false;
  
  // Check if it's a valid URL or filename
  const filename = getFilename(fileReference);
  if (!filename) return false;
  
  // Check for valid file extension
  const validExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',  // Images
    '.mp4', '.mov', '.avi', '.webm', '.mkv',  // Videos
    '.pdf', '.doc', '.docx', '.txt',  // Documents
    '.zip', '.tar', '.gz'  // Archives
  ];
  
  const extension = filename.toLowerCase().split('.').pop();
  return validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

/**
 * Check if a URL points to an image file
 * 
 * @param {string} url - URL to check
 * @returns {boolean} - True if it's an image
 */
export const isImageUrl = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
};

/**
 * Check if a URL points to a video file
 * 
 * @param {string} url - URL to check
 * @returns {boolean} - True if it's a video
 */
export const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

/**
 * Get array of file URLs from an array of file references
 * 
 * @param {string[]} fileReferences - Array of filenames or URLs
 * @returns {string[]} - Array of full URLs
 */
export const getFileUrls = (fileReferences) => {
  if (!Array.isArray(fileReferences)) return [];
  return fileReferences.map(ref => getFileUrl(ref)).filter(Boolean);
};

export default {
  getFileUrl,
  getFilename,
  isValidFileUrl,
  isImageUrl,
  isVideoUrl,
  getFileUrls
};
