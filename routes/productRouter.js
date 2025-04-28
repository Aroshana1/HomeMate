import { Router } from "express";

const router = Router();

import {
  getProduct,
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { get } from "mongoose";
/*import {
  validateJobInputs,
  validateIdParam,
} from "../middlewares/validationMiddleware.js";
import { checkForTestUser } from "../middlewares/authMiddleware.js"; */

//router.get("/", getAllJobs);

router.route("/").get(getAllProducts).post(createProduct);

//router.route("/stats").get(showStats);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

export default router;
