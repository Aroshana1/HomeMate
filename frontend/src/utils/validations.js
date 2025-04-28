import { z } from "zod";

export const recipeSchema = z.object({
  recipeName: z.string().min(1, "Recipe name is required").max(100),
  recipeImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  recipeDescription: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(500),
  recipeCategory: z.string().min(1, "Category is required"),
  recipeInstructions: z
    .array(z.string().min(5, "Instruction should be at least 5 characters"))
    .min(1, "At least one instruction is required"),
  ingredients: z
    .array(
      z.object({
        inventoryItemId: z.string().min(1, "Ingredient is required"),
        productName: z.string().min(1, "Product name is required"),
        quantity: z.number().min(0.1, "Quantity must be at least 0.1"),
        quantityUnit: z.string().min(1, "Unit is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
  numberOfServings: z.number().int().min(1, "Must be at least 1 serving"),
  prepTime: z.string().min(1, "Prep time is required"),
  cookTime: z.string().min(1, "Cook time is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  tags: z.array(z.string()).optional(),
});
