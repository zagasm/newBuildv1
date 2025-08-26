// cropImage.js
export const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // avoid CORS taint if possible
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Ensure we crop based on the image's real resolution
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Return as Blob URL (not base64) for better memory use
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(URL.createObjectURL(blob));
        },
        "image/jpeg",
        0.95 // high quality
      );
    };
    image.onerror = (err) => reject(err);
    image.src = imageSrc;
  });
};
