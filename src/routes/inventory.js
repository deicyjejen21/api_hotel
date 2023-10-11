import { Router } from "express";
import { AuthCrll } from "../controllers/auth.js";
import { wrapError } from "../middlewares/errorsHandler.js";
import { passportLocal } from "../utils/auth/index.js";
import { validatorHandler } from "../middlewares/shemasHandler.js";
// import { postProduct } from "../schemas/.js";
import { InventoryCrll } from "../controllers/inventory.js";

export const router = Router();

// router.post(
//   "/",
//   validatorHandler(postProduct, "body"),
//   wrapError(ProductCrll.create)
// );

router.get("/", wrapError(InventoryCrll.get));