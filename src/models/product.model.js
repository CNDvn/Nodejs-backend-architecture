"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Products";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_price: { type: String, require: true },
    product_quantity: { type: String, require: true },
    product_type: {
      type: String,
      require: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: {type: Schema.Types.ObjectId, ref: "Shop"},
    product_attributes: { type: Schema.Types.Mixed, require: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);


// define the product type = clothing
const clothingSchema = new Schema({
    brand: {type: String, require: true},
    size: String,
    material: String
},{
    collection: "clothes",
    timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: {type: String, require: true},
    model: String,
    color: String
},{
    collection: "electronics",
    timestamps: true
})


module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronic: model("Electronics", electronicSchema),
}