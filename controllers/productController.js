// controllers/productController.js

import Product from "../models/ProductModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(StatusCodes.OK).json({ products });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching products", error });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Assuming req.user.userId exists for authenticated user
    req.body.createdBy = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Error creating product", error });
  }
};

// Get a specific product by ID
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Product not found" });
    }

    res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching product", error });
  }
};

// Update an existing product by ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Product not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Product updated", product: updatedProduct });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating product", error });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid product ID" });
    }

    const removedProduct = await Product.findByIdAndDelete(id);
    if (!removedProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Product not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Product deleted", product: removedProduct });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error deleting product", error });
  }
};
