"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_type: { type: String, default: "fixed_amount" }, // percentage
    discount_value: { type: Number, require: true }, //10.00, 10
    discount_code: { type: String, require: true }, // discountCode
    discount_start_date: { type: Date, require: true }, // ngay bat dau
    discount_end_date: { type: Date, require: true }, // ngay ket thuc
    discount_max_uses: { type: Number, require: true }, // so luong discount duoc ap dung
    discount_uses_count: { type: Number, require: true }, // so discount da su dung
    discount_users_used: { type: Array, default: [] }, // ai da su dung
    discount_max_uses_per_user: { type: Number, require: true }, // so luong cho phep toi da duoc su dung boi user
    discount_min_order_value: { type: Number, require: true },
    discount_max_value: { type: Number, require: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      default: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // so san pham duoc ap dung
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
