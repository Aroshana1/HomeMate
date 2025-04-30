import axios from "axios";
import { groceryInventory } from "../data/groceryInventoryData.js";

export const generateRecipe = async (req, res) => {
  const { servings, mealCategory, preferences, useExpiringSoon } = req.body;

  try {
    // Filter inventory
    let availableItems = [...groceryInventory];

    if (useExpiringSoon) {
      availableItems = availableItems.filter((item) => {
        const daysUntilExpiry = Math.ceil(
          (new Date(item.productExpireDate) - new Date()) /
            (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 7;
      });
    }

    // Create ingredients list
    const ingredientsList = availableItems
      .map(
        (item) =>
          `${item.productName} (${item.productQuantity} ${item.productQuantityUnit})`
      )
      .join(", ");

    // Generate recipes
    const prompt = `Create a detailed ${mealCategory} recipe for ${servings} people using:
Ingredients: ${ingredientsList}
Preferences: ${preferences || "none"}
Format exactly like this:
Recipe Name: [name]
Ingredients: [list]
Instructions: [numbered steps]`;

    // Check model status
    try {
      const modelStatus = await axios.get(
        "https://api-inference.huggingface.co/models/openai-community/gpt2",
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
        }
      );
      if (modelStatus.data.state !== "Loaded") {
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    } catch (e) {
      console.log("Model status check skipped");
    }

    // Call API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/openai-community/gpt2",
      {
        inputs: prompt,
        parameters: { max_length: 500 },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    // Process response
    const recipeText =
      response.data[0]?.generated_text ||
      response.data?.generated_text ||
      prompt; // Fallback to prompt if no generation

    res.json({
      success: true,
      recipe: recipeText,
      prompt: prompt, // For debugging
    });
  } catch (error) {
    console.error("Full error:", {
      message: error.message,
      response: error.response?.data,
    });

    res.status(500).json({
      success: false,
      message: error.response?.data?.error || "Recipe generation failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
