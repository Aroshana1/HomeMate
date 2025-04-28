import { Router } from "express";

const router = Router();

import { generateRecipe } from "../controllers/recipeController.js";
//import { get } from "mongoose";

//router.get("/", getAllJobs);

router.post("/generate", generateRecipe);

export default router;
