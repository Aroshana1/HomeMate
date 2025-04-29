// MealPlanner.jsx
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { toast } from "react-toastify";
import { z } from "zod";
import { mealData, mealCategories } from "../data/mealData";
import { recipeData, recipeCategories } from "../data/recipeData";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-toastify/dist/ReactToastify.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Zod schema for meal validation
const mealSchema = z.object({
  mealName: z.string().min(1, "Meal name is required"),
  date: z.date(),
  mealCategory: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
  cost: z.number().min(0, "Cost must be positive").optional(),
  calories: z.number().min(0, "Calories must be positive").optional(),
});

const MealPlannerPage = () => {
  const [meals, setMeals] = useState(mealData);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    mealName: "",
    date: new Date(),
    mealCategory: "",
    recipe: null,
    notes: "",
    cost: 0,
    calories: 0,
  });
  const [view, setView] = useState("week"); // 'day', 'week', 'month', 'agenda'

  // Format meals for calendar
  const events = meals.map((meal) => ({
    id: meal.mealId,
    title: meal.mealName,
    start: new Date(meal.date),
    end: new Date(meal.date),
    allDay: true,
    mealCategory: meal.mealCategory,
    isCompleted: meal.isCompleted,
    color: getCategoryColor(meal.mealCategory),
  }));

  function getCategoryColor(category) {
    const colors = {
      [mealCategories.BREAKFAST]: "#FFD700", // Gold
      [mealCategories.LUNCH]: "#4682B4", // SteelBlue
      [mealCategories.DINNER]: "#8B0000", // DarkRed
      [mealCategories.SNACK]: "#32CD32", // LimeGreen
      [mealCategories.DESSERT]: "#9370DB", // MediumPurple
      [mealCategories.OTHER]: "#A9A9A9", // DarkGray
    };
    return colors[category] || "#A9A9A9";
  }

  // Event styles for calendar
  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: "4px",
      opacity: event.isCompleted ? 0.8 : 1,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style,
    };
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  // Handle recipe selection
  const handleRecipeSelect = (recipeId) => {
    const recipe = recipeData.find((r) => r.recipeID === recipeId) || null;
    setFormData({
      ...formData,
      recipe,
      mealName: recipe ? recipe.recipeName : formData.mealName,
      calories: recipe
        ? recipe.ingredients.reduce(
            (acc, ing) => acc + (ing.calories || 0),
            0
          ) / recipe.numberOfServings
        : formData.calories,
    });
  };

  // Open modal for adding new meal
  const handleAddMeal = (slotInfo) => {
    setSelectedMeal(null);
    setFormData({
      mealName: "",
      date: slotInfo ? slotInfo.start : new Date(),
      mealCategory: "",
      recipe: null,
      notes: "",
      cost: 0,
      calories: 0,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing meal
  const handleEditMeal = (mealId) => {
    const meal = meals.find((m) => m.mealId === mealId);
    if (meal) {
      setSelectedMeal(meal);
      setFormData({
        mealName: meal.mealName,
        date: new Date(meal.date),
        mealCategory: meal.mealCategory,
        recipe: meal.recipe,
        notes: meal.notes || "",
        cost: meal.cost || 0,
        calories: meal.calories || 0,
      });
      setIsModalOpen(true);
    }
  };

  // Submit form (add or update meal)
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Validate form data
      mealSchema.parse({
        mealName: formData.mealName,
        date: formData.date,
        mealCategory: formData.mealCategory,
        notes: formData.notes,
        cost: formData.cost,
        calories: formData.calories,
      });

      if (selectedMeal) {
        // Update existing meal
        const updatedMeals = meals.map((meal) =>
          meal.mealId === selectedMeal.mealId
            ? {
                ...meal,
                mealName: formData.mealName,
                date: formData.date.toISOString().split("T")[0],
                mealCategory: formData.mealCategory,
                recipe: formData.recipe,
                notes: formData.notes,
                cost: formData.cost,
                calories: formData.calories,
              }
            : meal
        );
        setMeals(updatedMeals);
        toast.success("Meal updated successfully!");
      } else {
        // Add new meal
        const newMeal = {
          mealId: `MEAL${(meals.length + 1).toString().padStart(3, "0")}`,
          mealName: formData.mealName,
          mealImage: formData.recipe
            ? formData.recipe.recipeImage
            : "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          date: formData.date.toISOString().split("T")[0],
          mealCategory: formData.mealCategory,
          recipe: formData.recipe,
          createdBy: "user001",
          notes: formData.notes,
          isCompleted: false,
          cost: formData.cost,
          calories: formData.calories,
        };
        setMeals([...meals, newMeal]);
        toast.success("Meal added successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  // Delete meal
  const handleDeleteMeal = (mealId) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      setMeals(meals.filter((meal) => meal.mealId !== mealId));
      toast.success("Meal deleted successfully!");
    }
  };

  // Toggle meal completion status
  const toggleMealCompletion = (mealId) => {
    setMeals(
      meals.map((meal) =>
        meal.mealId === mealId
          ? { ...meal, isCompleted: !meal.isCompleted }
          : meal
      )
    );
  };

  // Get meals for selected day
  const getDayMeals = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return meals.filter((meal) => meal.date === dateStr);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Meal Planner</h1>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setView("day")}
            className={`px-4 py-2 rounded ${
              view === "day" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 rounded ${
              view === "week" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-4 py-2 rounded ${
              view === "month" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView("agenda")}
            className={`px-4 py-2 rounded ${
              view === "agenda" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Agenda
          </button>
        </div>
        <button
          onClick={() => handleAddMeal(null)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Meal
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={["day", "week", "month", "agenda"]}
          defaultView={view}
          onView={setView}
          onSelectSlot={handleAddMeal}
          onSelectEvent={(event) => handleEditMeal(event.id)}
          selectable
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {/* Meal Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {selectedMeal ? "Edit Meal" : "Add New Meal"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Meal Name</label>
                <input
                  type="text"
                  name="mealName"
                  value={formData.mealName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={format(formData.date, "yyyy-MM-dd")}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="mealCategory"
                  value={formData.mealCategory}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a category</option>
                  {Object.values(mealCategories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Recipe (optional)
                </label>
                <select
                  value={formData.recipe?.recipeID || ""}
                  onChange={(e) => handleRecipeSelect(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">No recipe</option>
                  {recipeData.map((recipe) => (
                    <option key={recipe.recipeID} value={recipe.recipeID}>
                      {recipe.recipeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cost ($)</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedMeal ? "Update" : "Add"} Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Meals Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Today's Meals</h2>
        {getDayMeals(new Date()).length > 0 ? (
          <div className="space-y-4">
            {getDayMeals(new Date()).map((meal) => (
              <div
                key={meal.mealId}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <img
                      src={meal.mealImage}
                      alt={meal.mealName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{meal.mealName}</h3>
                      <p className="text-sm text-gray-600">
                        {meal.mealCategory} • {meal.calories} kcal • $
                        {meal.cost?.toFixed(2) || "0.00"}
                      </p>
                      {meal.notes && (
                        <p className="text-sm mt-1">{meal.notes}</p>
                      )}
                      {meal.recipe && (
                        <button
                          onClick={() =>
                            window.open(
                              `/recipes/${meal.recipe.recipeID}`,
                              "_blank"
                            )
                          }
                          className="text-blue-600 text-sm mt-1 hover:underline"
                        >
                          View Recipe
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleMealCompletion(meal.mealId)}
                      className={`p-2 rounded ${
                        meal.isCompleted
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100"
                      }`}
                    >
                      {meal.isCompleted ? "✓ Completed" : "Mark Complete"}
                    </button>
                    <button
                      onClick={() => handleEditMeal(meal.mealId)}
                      className="p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal.mealId)}
                      className="p-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No meals planned for today.</p>
        )}
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Weekly Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Total Meals</h3>
            <p className="text-2xl font-bold">{meals.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Completed Meals</h3>
            <p className="text-2xl font-bold">
              {meals.filter((m) => m.isCompleted).length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Weekly Cost</h3>
            <p className="text-2xl font-bold">
              $
              {meals
                .reduce((sum, meal) => sum + (meal.cost || 0), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerPage;
