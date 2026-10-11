export const optimizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Maximum dimensions to keep file size around 2MB
        const MAX_WIDTH = 2560;
        const MAX_HEIGHT = 2560;
        let width = img.width;
        let height = img.height;

        // Skip optimization if it's already a reasonable size and not a jpeg/png/webp
        if (!file.type.match(/image\/(jpeg|png|webp)/)) {
          resolve(event.target?.result as string);
          return;
        }

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG with 0.85 quality for a good size/quality balance
        const mimeType = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
        const optimizedBase64 = canvas.toDataURL(mimeType, 0.85);
        resolve(optimizedBase64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
