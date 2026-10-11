import React, { useCallback, useRef } from 'react';
import { UploadCloud, X, ImageIcon, FileText } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  label: string;
  explanation?: string;
  accept?: string;
  multiple?: boolean;
  files: FileData[];
  onChange: (files: FileData[]) => void;
  required?: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export function FileUpload({
  label,
  explanation,
  accept,
  multiple,
  files,
  onChange,
  required
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const newFileDataPromises = Array.from(newFiles).map(async (file) => {
      const base64 = await fileToBase64(file);
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
      if (multiple) {
        onChange([...files, ...newFileData]);
      } else {
        onChange([newFileData[0]]);
      }
    } catch (error) {
      console.error("Error reading files:", error);
      alert("Failed to read file.");
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

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-zinc-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-zinc-700 hover:border-red-500/50 bg-zinc-950/50 rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center transition-colors group active:bg-zinc-900/60"
      >
        <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-500 group-hover:text-red-500 transition-colors mb-3 sm:mb-4" />
        <p className="text-xs sm:text-sm text-zinc-300 font-medium text-center">
          Drag & drop files here, or tap to browse
        </p>
        <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 sm:mt-2 text-center">
          {multiple ? 'Select multiple files' : accept ? `Supported: ${accept}` : 'Select a file'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {explanation && <p className="text-xs text-zinc-500 leading-normal">{explanation}</p>}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 sm:p-3">
              <div className="flex items-center space-x-3 overflow-hidden min-w-0">
                {file.type.startsWith('image/') ? (
                  <img src={file.base64} alt={file.name} className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-zinc-400" />
                  </div>
                )}
                <span className="text-xs sm:text-sm text-zinc-300 truncate max-w-[170px] xs:max-w-[240px] sm:max-w-[340px]">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                aria-label="Remove file"
                className="p-2 text-zinc-400 hover:text-red-400 active:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0 min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
