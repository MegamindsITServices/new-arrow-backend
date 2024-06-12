import express from "express";
import formidable from "express-formidable";
import {
  createDealerController,
  getAllDealerController,
  deleteDealerController,
  updateDealerController,
  getSelectedStateDealerController,
  getPhotoStateController,
  getSingleDealerController,
  getDealerPhotoController,
} from "../controllers/dealerController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/create-dealer", formidable(), createDealerController);

router.get(
  "/get-all-dealer",

  getAllDealerController
);
router.get("/get-dealer/:id", getSingleDealerController);
router.get("/dealer-photo/:id", getDealerPhotoController);

router.delete(
  "/delete-dealer/:id",
  requireSignIn,
  isAdmin,
  deleteDealerController
);

router.put(
  "/update-dealer/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateDealerController
);

router.get("/selected-state/:state", getSelectedStateDealerController);
router.get("/get-photo/:state", getPhotoStateController);

export default router;
