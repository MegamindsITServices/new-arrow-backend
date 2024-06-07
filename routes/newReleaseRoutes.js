import express from "express";
import formidable from "express-formidable";
import {
  bookPhotoController,
  createNewreleaseController,
  deleteNewReleaseController,
  getNewReleaseController,
  getNewReleaseImageController,
} from "../controllers/newReleaseController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-new-release",
  formidable(),

  createNewreleaseController
);
router.get("/get-new-release", getNewReleaseController);
//single product
router.delete("/delete-new-release/:pid", deleteNewReleaseController);
router.get("/get-new-release-image/:id", bookPhotoController);
export default router;
