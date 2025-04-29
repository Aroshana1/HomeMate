import React from "react";
import { mealCategories } from "../data/mealData";

const MealList = ({ meals, viewMode, onEdit, onDelete }) => {
  const groupByCategory = (meals) => {
    return meals.reduce((acc, meal) => {
      if (!acc[meal.mealCategory]) {
        acc[meal.mealCategory] = [];
      }
      acc[meal.mealCategory].push(meal);
      return acc;
    }, {});
  };

  const groupedMeals = groupByCategory(meals);

  return (
    <div>
      {viewMode === "day" ? (
        Object.entries(groupedMeals).map(([category, categoryMeals]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
              {category}
            </h3>
            <div className="grid gap-4">
              {categoryMeals.map((meal) => (
                <MealCard
                  key={meal.mealId}
                  meal={meal}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(mealCategories).map((category) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">{category}</h3>
              <div className="space-y-3">
                {meals
                  .filter((meal) => meal.mealCategory === category)
                  .map((meal) => (
                    <div
                      key={meal.mealId}
                      className="bg-white p-3 rounded shadow-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{meal.mealName}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(meal.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>LKR{meal.cost?.toFixed(2)}</span>
                        <span>{meal.calories} kcal</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MealCard = ({ meal, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg">{meal.mealName}</h4>
          {meal.recipe ? (
            <p className="text-sm text-gray-600 mt-1">
              From recipe: {meal.recipe.recipeName}
            </p>
          ) : null}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(meal)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(meal.mealId)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {meal.mealImage && (
        <div className="mt-3">
          <img
            src={meal.mealImage}
            alt={meal.mealName}
            className="w-full h-32 object-cover rounded"
          />
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-semibold">Cost:</span> LKR
          {meal.cost?.toFixed(2)}
        </div>
        <div>
          <span className="font-semibold">Calories:</span> {meal.calories}
        </div>
        <div>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(meal.date).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Status:</span>{" "}
          {meal.isCompleted ? "Completed" : "Planned"}
        </div>
      </div>

      {meal.notes && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <span className="font-semibold">Notes:</span> {meal.notes}
        </div>
      )}
    </div>
  );
};

export default MealList;
