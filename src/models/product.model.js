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


// define the product type = Clothing
const clothingSchema = new Schema({
    brand: {type: String, require: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: "Shop"},
},{
    collection: "clothes",
    timestamps: true
})

// define the product type = Electronic
const electronicSchema = new Schema({
    manufacturer: {type: String, require: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: "Shop"},
},{
    collection: "electronics",
    timestamps: true
})

// define the product type = Furniture 
const furnitureSchema = new Schema({
  brand: {type: String, require: true},
  size: String,
  material: String,
  product_shop: {type: Schema.Types.ObjectId, ref: "Shop"},
},{
    collection: "furnitures",
    timestamps: true
})


module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronic: model("Electronics", electronicSchema),
    furniture: model("Furniture", furnitureSchema),
}