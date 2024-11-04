const fs = require("fs");

require("dotenv").config();

const getBase64FromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString("base64"));
      }
    });
  });
};

const generateUniqueFileName = (type = "png") => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  return `nym_post_${timestamp}.${type}`;
};

const getImageUrlForColor = (productData) => {
  const colorList = ["Military Green", "Maroon", "Black", "Sport Grey"];

  const randomColor = colorList[Math.floor(Math.random() * colorList.length)];

  return getImage(productData, randomColor);
};

const getImage = (productData, colorTitle) => {
  const colorOption = productData.options.find(
    (option) => option.name === "Colors"
  );

  if (!colorOption) return null;

  const color = colorOption.values.find((c) => c.title === colorTitle);

  if (!color) return null;

  const colorId = color.id;
  const variant = productData.variants.find((v) => v.options.includes(colorId));

  if (!variant) return null;

  // Get all images that belong to the variant
  const variantImages = productData.images.filter((image) => {
    // Check if the image belongs to the variant
    const belongsToVariant = image.variant_ids.includes(variant.id);
    // Extract the camera_label from the image URL if it exists
    const urlParams = new URLSearchParams(image.src.split("?")[1]);
    const cameraLabel = urlParams.get("camera_label");

    // Exclude images if camera_label contains any unwanted terms
    const hasValidCameraLabel =
      !/back|back-2|front-collar-closeup|back-collar-closeup|person-(5|6|7|8)-back|person-(5|6|7|8)-left-sleeve|size-chart|folded|duo|person -(3|4|5) left sleeve|person -(3|4|5) right sleeve|duo-(2|3)/i.test(
        cameraLabel || ""
      );

    return belongsToVariant && hasValidCameraLabel;
  });

  // If there are no valid images, return null
  if (variantImages.length === 0) return null;

  // Randomly pick one image from the variant images
  const randomImage =
    variantImages[Math.floor(Math.random() * variantImages.length)];

  // Return the URL of the randomly selected image
  return randomImage.src;
};

// Export the helper functions
module.exports = {
  getBase64FromFile,
  generateUniqueFileName,
  getImageUrlForColor,
};
