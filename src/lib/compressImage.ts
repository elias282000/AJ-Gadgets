/**
 * Resizes and re-compresses an image in the browser before upload.
 *
 * Product photos taken straight from a phone camera are often 3-8MB at
 * 4000px+ wide — far more than a product thumbnail or detail image ever
 * needs, and every one of those bytes gets downloaded again by every
 * visitor to the shop. Shrinking here, once, at upload time, is the
 * single biggest lever for a fast-feeling storefront.
 */
export async function compressImage(
  file: File,
  { maxDimension = 1600, quality = 0.82 } = {}
): Promise<File> {
  // Skip GIFs — canvas re-encoding would flatten any animation.
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height / width) * maxDimension);
          width = maxDimension;
        } else {
          width = Math.round((width / height) * maxDimension);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            resolve(file);
            return;
          }
          const newName = file.name.replace(/\.[^./]+$/, "") + ".jpg";
          resolve(new File([blob], newName, { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fall back to the original file rather than failing the upload
    };

    img.src = objectUrl;
  });
}
