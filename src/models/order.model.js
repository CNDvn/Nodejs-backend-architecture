"use strict";

const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /**
     * order_checkout = {
     *  totalPrice,
     *  totalApplyDiscount,
     *  feeShip,
     * }
     */
    order_shipping: { type: Object, default: {} },
    /**
     * street
     * city
     * state
     * country
     */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true },
    order_tracking: { type: String, default: "#00111052022" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "canceled", "delivered"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: { createdAt: "createdOn", updatedAt: "modifiedOn" },
  }
);

module.exports = { order: model(DOCUMENT_NAME, orderSchema) };
