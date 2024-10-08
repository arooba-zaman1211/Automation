const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productRoutes = require("../routes/Products_Routes");
const connectDB = require("../config/dbConnection.js");
const axios = require("axios");
const { NymPost } = require("../services/NymPost.jsx");
const { NymPosttwo } = require("../services/NymPost_2.jsx");
const { generateUniqueFileName } = require("../helper/Helper.js");
const path = require("path");
const fs = require("fs");
app.use(express.json()); // To parse JSON body data

app.use("/api/product", productRoutes);

// Server listen
const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

// ID 1 Design
/*const whiteCard = new NymPost(3951, 4919)
  .setNym("Hello! I am Nat")
  .setDefinition("short for Natural disaster")
  .setNymColor("white")
  .setDefinitionColor("white")
  .setNymFontSize("550px")
  .setDefinitionFontSize("260px")
  .setMarginTop("386px")
  .setHeight("1946px");*/

// ID 3 Design
/*const whiteCard = new NymPosttwo(3951, 4919)
  .setNym("Caught Flipping Again")
  .setNymColor("white")
  .setDefinitionColor("white")
  .setNymFontSize("570px")
  .setHeight("3989px")
  .setPadding("540px");*/

//  ID 2 Design
const whiteCard = new NymPosttwo(3951, 4919)
  .setNym("If at first you don't succeed give up, it's easier.")
  .setNymColor("white")
  .setNymFontSize("460px")
  .setMarginTop("403px")
  .setHeight("2244px")
  .setWidth("2915px")
  .setPadding("518px");

const saveWhiteCard = async () => {
  try {
    const whiteImage = await whiteCard.build({ format: "png" }); // Await the result of build
    const whiteFileName = generateUniqueFileName();
    const whiteFilePath = path.join(
      __dirname,
      "../public/images",
      whiteFileName
    );

    // Save the white image to the file system
    fs.writeFileSync(whiteFilePath, whiteImage); // Now whiteImage will be a Buffer
    console.log("Image saved successfully:", whiteFilePath);
  } catch (error) {
    console.error("Error saving image:", error);
  }
};

// Call the async function to save the image
saveWhiteCard();
