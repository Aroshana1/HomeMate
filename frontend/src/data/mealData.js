import { recipeData } from "./recipeData";
import { recipeCategories } from "./recipeData";

const mealCategories = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
  DESSERT: "Dessert",
  OTHER: "Other",
};

const mealData = [
  {
    mealId: "MEAL001",
    mealName: "Yogurt Breakfast",
    mealImage: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    date: "2025-03-27",
    mealCategory: mealCategories.BREAKFAST,
    recipe: null,
    createdBy: "user001",
    notes: "Low-throughput speed",
    calories: 120,
    cost: 1.5,
    isCompleted: true,
  },
  {
    mealId: "MEAL002",
    mealName: "Dark Chocolate Snack",
    mealImage: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d",
    date: "2025-03-27",
    mealCategory: mealCategories.SNACK,
    recipe: null,
    createdBy: "user001",
    notes: "4 inches great",
    calories: 120,
    cost: 1.8,
    isCompleted: true,
  },
  {
    mealId: "MEAL003",
    mealName: "Pizza Lunch",
    mealImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    date: "2025-03-27",
    mealCategory: mealCategories.LUNCH,
    recipe: null,
    createdBy: "user001",
    notes: "Special purpose serving",
    calories: 350,
    cost: 8.5,
    isCompleted: true,
  },
  {
    mealId: "MEAL004",
    mealName: "Spaghetti Bolognese",
    mealImage: "https://images.unsplash.com/photo-1546549032-9571cd6b27df",
    date: "2025-03-27",
    mealCategory: mealCategories.DINNER,
    recipe: null,
    createdBy: "user001",
    notes: "Special purpose serving",
    calories: 450,
    cost: 12.0,
    isCompleted: true,
  },
  {
    mealId: "MEAL005",
    mealName: "Apple Banana Smoothie",
    mealImage: recipeData[0].recipeImage,
    date: "2025-03-28",
    mealCategory: mealCategories.BREAKFAST,
    recipe: recipeData[0],
    createdBy: "user001",
    notes: "Refreshing morning drink",
    calories: 250,
    cost: 3.5,
    isCompleted: false,
  },
  {
    mealId: "MEAL006",
    mealName: "Beef and Vegetable Stir Fry",
    mealImage: recipeData[1].recipeImage,
    date: "2025-03-28",
    mealCategory: mealCategories.DINNER,
    recipe: recipeData[1],
    createdBy: "user001",
    notes: "Quick weeknight dinner",
    calories: 400,
    cost: 15.0,
    isCompleted: false,
  },
  // Add more meals for the rest of the week
  {
    mealId: "MEAL007",
    mealName: "Avocado Toast",
    mealImage: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
    date: "2025-03-29",
    mealCategory: mealCategories.BREAKFAST,
    recipe: null,
    createdBy: "user001",
    notes: "With cherry tomatoes",
    calories: 300,
    cost: 4.5,
    isCompleted: false,
  },
  {
    mealId: "MEAL008",
    mealName: "Caesar Salad",
    mealImage: "https://images.unsplash.com/photo-1546793665-c74683f339c1",
    date: "2025-03-29",
    mealCategory: mealCategories.LUNCH,
    recipe: null,
    createdBy: "user001",
    notes: "With grilled chicken",
    calories: 350,
    cost: 10.0,
    isCompleted: false,
  },
  {
    mealId: "MEAL009",
    mealName: "Pasta Carbonara",
    mealImage: "https://images.unsplash.com/photo-1608755728615-01b8919820c4",
    date: "2025-03-29",
    mealCategory: mealCategories.DINNER,
    recipe: null,
    createdBy: "user001",
    notes: "Classic recipe",
    calories: 550,
    cost: 12.5,
    isCompleted: false,
  },
  // Continue adding meals up to MEAL030 with dates up to 2025-07-27
  // ...
  {
    mealId: "MEAL030",
    mealName: "Grilled Salmon",
    mealImage: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    date: "2025-07-27",
    mealCategory: mealCategories.DINNER,
    recipe: null,
    createdBy: "user001",
    notes: "With lemon butter sauce",
    calories: 450,
    cost: 18.0,
    isCompleted: false,
  },
];

// Helper functions
function getMealsByDate(date) {
  return mealData.filter((meal) => meal.date === date);
}

function getMealsByDateRange(startDate, endDate) {
  return mealData.filter((meal) => {
    const mealDate = new Date(meal.date);
    return mealDate >= new Date(startDate) && mealDate <= new Date(endDate);
  });
}

function getMealsByCategory(category) {
  return mealData.filter((meal) => meal.mealCategory === category);
}

function calculateWeeklyCost(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  const weeklyMeals = getMealsByDateRange(
    startDate,
    endDate.toISOString().split("T")[0]
  );
  return weeklyMeals.reduce((total, meal) => total + (meal.cost || 0), 0);
}

export {
  mealData,
  mealCategories,
  getMealsByDate,
  getMealsByDateRange,
  getMealsByCategory,
  calculateWeeklyCost,
};
