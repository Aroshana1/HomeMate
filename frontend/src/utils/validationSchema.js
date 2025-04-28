// utils/validationSchema.js
import { z } from "zod";

export const inventoryItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productImage: z.string().url("Invalid URL").or(z.literal("")),
  productCategory: z.string().min(1, "Category is required"),
  productQuantity: z.number().min(0, "Quantity must be positive"),
  productQuantityUnit: z.string().min(1, "Unit is required"),
  productMinStockAmount: z.number().min(0, "Minimum stock must be positive"),
  productExpireDate: z.string().min(1, "Expiry date is required"),
  supplier: z.string().min(1, "Supplier is required"),
  location: z.string().min(1, "Location is required"),
});

export const shoppingListItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  neededQuantity: z.number().min(0),
  productQuantityUnit: z.string().min(1),
  productCategory: z.string().min(1),
});

export const taskSchema = z.object({
  taskName: z.string().min(3, "Task name must be at least 3 characters"),
  taskType: z.string().nonempty("Please select a task type"),
  taskDate: z.string().refine((val) => {
    try {
      new Date(val);
      return true;
    } catch {
      return false;
    }
  }, "Invalid date"),
});
