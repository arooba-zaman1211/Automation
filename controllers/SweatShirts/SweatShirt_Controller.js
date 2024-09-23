const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Font } = require("canvacord");
const { NymPost } = require("../../services/NymPost.jsx"); // Import your NymPost class
require("dotenv").config();
const {
  getBase64FromFile,
  generateUniqueFileName,
  postToInsta,
  getImageUrlForColor,
  uploadImageToPrintify,
} = require("../../helper/Helpers.js");

const token = process.env.PRINTIFY_ACCESS_TOKEN;
const shopId = process.env.PRINTIFY_SHOP_ID;

Font.fromFileSync("public/assets/fonts/Cardo/Cardo-Bold.ttf", "Cardo-Bold");
Font.fromFileSync("public/assets/fonts/Inter/Inter-Italic.ttf", "Inter-Italic");
Font.fromFileSync(
  "public/assets/fonts/Inter/Inter-Regular.ttf",
  "Inter-Regular"
);

// Controller function to generate and upload image
const createAndUploadImage = async (req, res) => {
  try {
    // 1. Generate the image using Canvacord and save it locally
    const whiteCard = new NymPost(3951, 4919)
      .setNym(req.body.nym)
      .setType(req.body.type)
      .setDefinition(req.body.definition)
      .setNymColor("white")
      .setTypeColor("white")
      .setDefinitionColor("white")
      .setNymFontSize("500px")
      .setTypeFontSize("200px")
      .setDefinitionFontSize("250px");

    const whiteImage = await whiteCard.build({ format: "png" });
    const whiteFileName = generateUniqueFileName();
    const whiteFilePath = path.join(
      __dirname,
      "../../public/images",
      whiteFileName
    );

    // Save the white image to the file system
    fs.writeFileSync(whiteFilePath, whiteImage);

    // Convert the saved white image to Base64 format
    const whiteBase64Image = await getBase64FromFile(whiteFilePath);

    // Upload white card image to Printify
    const whiteImageId = await uploadImageToPrintify(
      whiteFileName,
      whiteBase64Image,
      token
    );
    console.log(`White card uploaded with ID: ${whiteImageId}`);

    // 2. Create the second card (Black Text)
    const blackCard = new NymPost(3951, 4919)
      .setNym(req.body.nym)
      .setType(req.body.type)
      .setDefinition(req.body.definition)
      .setNymColor("black")
      .setTypeColor("black")
      .setDefinitionColor("black")
      .setNymFontSize("500px")
      .setTypeFontSize("150px")
      .setDefinitionFontSize("200px");

    const blackImage = await blackCard.build({ format: "png" });
    const blackFileName = generateUniqueFileName();
    const blackFilePath = path.join(
      __dirname,
      "../../public/images",
      blackFileName
    );

    // Save the black image to the file system
    fs.writeFileSync(blackFilePath, blackImage);

    // Convert the saved black image to Base64 format
    const blackBase64Image = await getBase64FromFile(blackFilePath);

    // Upload black card image to Printify
    const blackImageId = await uploadImageToPrintify(
      blackFileName,
      blackBase64Image,
      token
    );
    console.log(`Black card uploaded with ID: ${blackImageId}`);

    // 4. Create a product in Printify
    const productResponse = await axios.post(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        title: "Custom T-Shirt",
        description: "A high-quality custom t-shirt with your design.",
        blueprint_id: 6,
        print_provider_id: 72,
        variants: [
          {
            id: 12059, // Sapphire (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12061, // Sapphire (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12070, // Sports Grey (Black)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12071, // Sports Grey (Black)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12124, // Black (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12125, // Black (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12154, // Graphite Heather (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12155, // Graphite Heather (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12190, // Military Green (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 12191, // Military Green (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 11975, // Maroon (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 11974, // Maroon (White)
            price: 2000,
            is_enabled: true,
          },
          {
            id: 11940, // Heather Sapphire
            price: 2000,
            is_enabled: true,
          },
          {
            id: 11941, // Heather Sapphire
            price: 2000,
            is_enabled: true,
          },
          {
            id: 11820, // Blackberry
            price: 2000,
            is_enabled: true,
          },
          {
            id: 11819, // Blackberry
            price: 2000,
            is_enabled: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [12070, 12071], // Assign black image to these variants
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: blackImageId, // Black image ID goes here
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
              },
            ],
          },
          {
            variant_ids: [
              11975, 11974, 12190, 12191, 12059, 12061, 11820, 11819, 12124,
              12125, 12154, 12155, 11940, 11941, 12070, 12071,
            ],
            placeholders: [
              {
                position: "front",
                images: [
                  {
                    id: whiteImageId, // White image ID goes here
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const productId = productResponse.data.id;

    // 4. Publish the product to Shopify
    const requestData = {
      title: true,
      description: true,
      images: true,
      variants: true,
      tags: true,
      keyFeatures: true,
      shipping_template: true,
    };

    const publishResponse = await axios.post(
      `https://api.printify.com/v1/shops/${shopId}/products/${productId}/publish.json`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Product published to Shopify:", publishResponse.data);
    // 5. Fetch the image URL for the white variant
    const whiteImageUrl = getImageUrlForColor(
      productResponse.data,
      "Sport Grey"
    );

    // 6. Post the product image to Instagram
    if (whiteImageUrl) {
      await postToInsta({
        caption: `Check out our new Asphalt T-Shirt! #CustomTshirt #Printify`,
        image_url: whiteImageUrl,
      });

      res.status(200).json(productResponse.data);
    } else {
      res.status(404).send("Asphalt variant image URL not found");
    }
  } catch (error) {
    console.error(
      "Error creating and uploading image or product:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error creating and uploading image or product");
  }
};

// Export the controller function
module.exports = {
  createAndUploadImage,
};
