// Import grocery inventory data to use for ingredients
import { groceryInventory } from "./groceryInventoryData";

// Reuse the same categories from product data
const recipeCategories = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  DESSERT: "Dessert",
  APPETIZER: "Appetizer",
  SALAD: "Salad",
  SOUP: "Soup",
  BAKED_GOODS: "Baked Goods",
  BEVERAGE: "Beverage",
  OTHER: "Other",
};

// Recipe data array
const recipeData = [
  {
    recipeID: "REC001",
    recipeImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    recipeName: "Apple Banana Smoothie",
    recipeDescription:
      "A refreshing and healthy smoothie perfect for breakfast",
    recipeCategory: recipeCategories.BREAKFAST,
    recipeInstructions: [
      "Peel and chop the bananas",
      "Core and chop the apples",
      "Add all ingredients to blender",
      "Blend until smooth",
      "Serve immediately",
    ],
    createdBy: "user001",
    ingredients: [
      {
        inventoryItemId: "INV001", // Apple
        productName: "Apple",
        quantity: 2, // 2 apples
        quantityUnit: "PC", // Pieces
        isLowStock: groceryInventory.find(
          (item) => item.inventoryItemId === "INV001"
        ).isLowStock,
        isExpiringSoon: isExpiringSoon(
          groceryInventory.find((item) => item.inventoryItemId === "INV001")
            .productExpireDate
        ),
      },
      {
        inventoryItemId: "INV002", // Banana
        productName: "Banana",
        quantity: 1, // 1 banana
        quantityUnit: "PC", // Pieces
        isLowStock: groceryInventory.find(
          (item) => item.inventoryItemId === "INV002"
        ).isLowStock,
        isExpiringSoon: isExpiringSoon(
          groceryInventory.find((item) => item.inventoryItemId === "INV002")
            .productExpireDate
        ),
      },
      {
        inventoryItemId: "INV015", // Juice
        productName: "Juice",
        quantity: 250, // 250ml
        quantityUnit: "ML", // Milliliters
        isLowStock: groceryInventory.find(
          (item) => item.inventoryItemId === "INV015"
        ).isLowStock,
        isExpiringSoon: isExpiringSoon(
          groceryInventory.find((item) => item.inventoryItemId === "INV015")
            .productExpireDate
        ),
      },
    ],
    numberOfServings: 2,
    prepTime: "10 mins",
    cookTime: "0 mins",
    difficulty: "Easy",
    createdAt: "2023-11-01T10:30:00Z",
    lastUpdated: "2023-11-01T10:30:00Z",
    tags: ["healthy", "quick", "vegetarian"],
  },
  {
    recipeID: "REC002",
    recipeImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    recipeName: "Beef and Vegetable Stir Fry",
    recipeDescription:
      "A quick and delicious dinner with tender beef and fresh vegetables",
    recipeCategory: recipeCategories.DINNER,
    recipeInstructions: [
      "Slice beef into thin strips",
      "Chop all vegetables",
      "Heat oil in wok or large pan",
      "Stir-fry beef until browned, then remove",
      "Stir-fry vegetables until tender-crisp",
      "Return beef to pan, add sauce",
      "Cook for 2 more minutes",
      "Serve hot over rice",
    ],
    createdBy: "user001",
    ingredients: [
      {
        inventoryItemId: "INV010", // Ground Beef
        productName: "Ground Beef",
        quantity: 500, // 500g
        quantityUnit: "G", // Grams
        isLowStock: groceryInventory.find(
          (item) => item.inventoryItemId === "INV010"
        ).isLowStock,
        isExpiringSoon: isExpiringSoon(
          groceryInventory.find((item) => item.inventoryItemId === "INV010")
            .productExpireDate
        ),
      },
      {
        inventoryItemId: "INV001", // Apple
        productName: "Apple",
        quantity: 1, // 1 apple
        quantityUnit: "PC", // Pieces
        isLowStock: groceryInventory.find(
          (item) => item.inventoryItemId === "INV001"
        ).isLowStock,
        isExpiringSoon: isExpiringSoon(
          groceryInventory.find((item) => item.inventoryItemId === "INV001")
            .productExpireDate
        ),
      },
      {
        inventoryItemId: "INV025", // Mustard
        productName: "Mustard",
        quantity: 2, // 2 tablespoons
        quantityUnit: "Tbsp", // Tablespoons
        isLowStock: groceryInventory.find(
          (item) => item.inventoryItemId === "INV025"
        ).isLowStock,
        isExpiringSoon: isExpiringSoon(
          groceryInventory.find((item) => item.inventoryItemId === "INV025")
            .productExpireDate
        ),
      },
    ],
    numberOfServings: 4,
    prepTime: "15 mins",
    cookTime: "10 mins",
    difficulty: "Medium",
    createdAt: "2023-11-05T14:20:00Z",
    lastUpdated: "2023-11-05T14:20:00Z",
    tags: ["quick", "dinner", "high-protein"],
  },
];

// Helper function to check if a product is expiring soon (within 7 days)
function isExpiringSoon(expireDate) {
  const today = new Date();
  const expire = new Date(expireDate);
  const timeDiff = expire.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff <= 7;
}

// Helper function to check if a product is low stock
function isLowStock(product) {
  return product.productQuantity < product.productMinStockAmount;
}

// Function to get recipes that use expiring soon ingredients
function getRecipesWithExpiringIngredients() {
  return recipeData.filter((recipe) =>
    recipe.ingredients.some((ingredient) => ingredient.isExpiringSoon)
  );
}

// Function to get recipes that use low stock ingredients
function getRecipesWithLowStockIngredients() {
  return recipeData.filter((recipe) =>
    recipe.ingredients.some((ingredient) => ingredient.isLowStock)
  );
}

// Export the data and utility functions
export {
  recipeData,
  recipeCategories,
  isExpiringSoon,
  isLowStock,
  getRecipesWithExpiringIngredients,
  getRecipesWithLowStockIngredients,
};
