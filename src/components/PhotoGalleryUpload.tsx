import React, { useCallback, useRef } from 'react';
import { UploadCloud, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { FileData } from '../types';
import { optimizeImage } from '../utils/imageUtils';

interface PhotoGalleryUploadProps {
  label: string;
  explanation?: string;
  files: FileData[];
  onChange: (files: FileData[]) => void;
  required?: boolean;
}

export function PhotoGalleryUpload({
  label,
  explanation,
  files,
  onChange,
  required
}: PhotoGalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_PHOTOS = 60;

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    // Filter to limit total photos to MAX_PHOTOS
    const availableSlots = MAX_PHOTOS - files.length;
    if (availableSlots <= 0) return;
    
    const filesToProcess = Array.from(newFiles).slice(0, availableSlots);

    const newFileDataPromises = filesToProcess.map(async (file) => {
      // Optimize image before creating base64
      const base64 = await optimizeImage(file);
      
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        base64,
        status: 'waiting' as const,
      };
    });

    try {
      const newFileData = await Promise.all(newFileDataPromises);
      onChange([...files, ...newFileData]);
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Failed to process some images.");
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (id: string) => {
    onChange(files.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="text-sm font-medium text-zinc-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {explanation && <p className="text-xs text-zinc-500 mt-1">{explanation}</p>}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400 font-medium">Selected photos: {files.length} / {MAX_PHOTOS}</span>
      </div>

      {files.length < MAX_PHOTOS && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-zinc-700 hover:border-red-500/50 bg-zinc-950/50 rounded-xl p-8 flex flex-col items-center justify-center transition-colors group"
        >
          <UploadCloud className="w-10 h-10 text-zinc-500 group-hover:text-red-500 transition-colors mb-4" />
          <p className="text-sm text-zinc-300 font-medium text-center">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            Supported: image/jpeg, image/png, image/webp
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
          {files.map((file) => (
            <div key={file.id} className="relative group border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900 aspect-square">
              <img src={file.base64} alt={file.name} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <span className="text-xs text-white truncate drop-shadow-md">{file.name}</span>
                
                {(file.status === 'waiting' || file.status === 'failed') && (
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                    className="self-end p-1 bg-red-500/80 hover:bg-red-500 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              {/* Status Indicators Overlay */}
              {file.status === 'uploading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500 mb-2" />
                  <span className="text-xs font-medium text-white">Uploading...</span>
                </div>
              )}
              {file.status === 'uploaded' && (
                <div className="absolute top-2 right-2 bg-zinc-950/50 backdrop-blur-sm rounded-full p-0.5">
                  <CheckCircle className="w-5 h-5 text-green-500 bg-zinc-950 rounded-full" />
                </div>
              )}
              {file.status === 'failed' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/70 backdrop-blur-sm">
                  <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                  <span className="text-xs font-medium text-white">Failed</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
