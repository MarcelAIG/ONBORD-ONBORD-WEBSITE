export type UploadStatus = 'waiting' | 'uploading' | 'uploaded' | 'failed';

export interface FileData {
  id: string;
  name: string;
  type: string;
  base64: string;
  status: UploadStatus;
}
