import { useState, useRef, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader, Image, Video } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;

const FileUpload = ({ 
  onUploadComplete, 
  accept = "image/*",
  maxSize = 5, // MB
  label = "Upload File",
  currentUrl = null,
  required = false,
  compact = false,
  showPreview = true // Show image/video preview when uploaded
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef(null);
  const inputId = useRef(`file-upload-${Math.random().toString(36).substr(2, 9)}`).current;

  // Update uploadedUrl when currentUrl prop changes
  useEffect(() => {
    setUploadedUrl(currentUrl);
    setPreviewError(false);
  }, [currentUrl]);

  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const validateFile = (file) => {
    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type if accept is specified
    if (accept && !accept.includes('*')) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      const isValid = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return type === fileType || type === fileExtension;
      });

      if (!isValid) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.size, file.type);
    setError('');
    setPreviewError(false);
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      console.error('Validation error:', validationError);
      return;
    }

    // Upload file
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadUrl = `${API_BASE}/api/v1/upload`;
      console.log('Starting upload to:', uploadUrl);

      const response = await axios.post(uploadUrl, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
          console.log('Upload progress:', percentCompleted + '%');
        },
      });

      console.log('Upload successful:', response.data);
      const fileUrl = response.data.url;
      setUploadedUrl(fileUrl);
      
      // Call the callback with the URL
      if (onUploadComplete) {
        onUploadComplete(fileUrl);
      }
      
      setProgress(100);
    } catch (err) {
      console.error('Upload failed:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 'Failed to upload file. Please try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedUrl(null);
    setError('');
    setProgress(0);
    setPreviewError(false);
    if (onUploadComplete) {
      onUploadComplete('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handlePreviewError = () => {
    console.warn('Failed to load preview for:', uploadedUrl);
    setPreviewError(true);
  };

  // Render preview based on file type
  const renderPreview = () => {
    if (!showPreview || !uploadedUrl || previewError) return null;

    if (isImageFile(uploadedUrl)) {
      return (
        <div className="mt-2 relative">
          <img 
            src={uploadedUrl} 
            alt="Uploaded preview" 
            className="max-h-32 rounded-lg object-cover border border-gray-200"
            onError={handlePreviewError}
          />
        </div>
      );
    }

    if (isVideoFile(uploadedUrl)) {
      return (
        <div className="mt-2 relative">
          <video 
            src={uploadedUrl} 
            className="max-h-32 rounded-lg border border-gray-200"
            controls
            onError={handlePreviewError}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-2">
      {!compact && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {!uploadedUrl ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            onClick={triggerFileInput}
            className={`
              flex flex-col items-center justify-center w-full ${compact ? 'h-20' : 'h-32'}
              border-2 border-dashed rounded-xl cursor-pointer
              transition-colors
              ${uploading ? 'border-blue-300 bg-blue-50 cursor-not-allowed' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}
              ${error ? 'border-red-300 bg-red-50' : ''}
            `}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader className={`${compact ? 'w-5 h-5' : 'w-8 h-8'} text-blue-600 animate-spin mb-2`} />
                <p className={`${compact ? 'text-xs' : 'text-sm'} text-blue-600`}>Uploading... {progress}%</p>
                {!compact && (
                  <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className={`${compact ? 'w-5 h-5 mb-1' : 'w-8 h-8 mb-2'} ${error ? 'text-red-500' : 'text-gray-400'}`} />
                <p className={`${compact ? 'text-xs' : 'text-sm'} ${error ? 'text-red-600' : 'text-gray-600'}`}>
                  {compact ? label : 'Click to upload or drag and drop'}
                </p>
                {!compact && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max {maxSize}MB · {accept}
                  </p>
                )}
              </div>
            )}
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <div className={`flex items-center gap-3 ${compact ? 'p-2' : 'p-4'} bg-green-50 border border-green-200 rounded-xl`}>
            <CheckCircle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-green-600 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className={`${compact ? 'text-xs' : 'text-sm'} text-green-800 font-medium`}>
                {compact ? 'Uploaded' : 'File uploaded successfully'}
              </p>
              <a 
                href={uploadedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline truncate block"
              >
                View file
              </a>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors"
              title="Remove file"
            >
              <X className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-red-600`} />
            </button>
          </div>
          
          {/* Preview */}
          {renderPreview()}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
