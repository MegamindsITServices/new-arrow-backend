import express from "express";
import formidable from "express-formidable";
import {
  bookPhotoController,
  createHomeBookController,
  deleteHomeBookController,
  getHomeBookController,
  getHomeBookImageController,
  getSingleHomeBookController,
  updateHomeBookController,
} from "../controllers/homeBookController.js";

const router = express.Router();

router.post("/create-home-book", formidable(), createHomeBookController);
router.get("/get-home-book", getHomeBookController);
//single product
router.get("/get-home-book/:id", getSingleHomeBookController);
router.put("/update-home-book/:pid", formidable(), updateHomeBookController);
router.delete("/delete-home-book/:pid", deleteHomeBookController);
router.get("/get-home-book-image/:id", bookPhotoController);
export default router;
