
import mongoose from "mongoose";
import { QUANTITY_UNITS, PRODUCT_GROUPS } from "../utils/constants.js";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productGroup: {
      type: String,
      enum: Object.values(PRODUCT_GROUPS),
      default: PRODUCT_GROUPS.GROCERIES,
    },
    quantityUnit: {
      type: String,
      enum: Object.values(QUANTITY_UNITS),
      required: true,
    },
    minStockAmount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          if (
            this.quantityUnit === QUANTITY_UNITS.KG ||
            this.quantityUnit === QUANTITY_UNITS.LITER
          ) {
            return value >= 1; // Minimum stock of 1 for KG or Liters
          } else if (this.quantityUnit === QUANTITY_UNITS.PIECES) {
            return value >= 10; // Minimum stock of 10 for pieces
          }
          return value >= 1; // Default case, 1 as the minimum
        },
        message: (props) =>
          `${props.value} is not a valid minimum stock amount for ${props.value}.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Export the Product Model
const Product = mongoose.model("Product", ProductSchema);

export default Product;
