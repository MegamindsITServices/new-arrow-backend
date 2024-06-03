import express from "express";
import {
  writeReviewController,
  getAllReviewController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/reviewController.js";
const router = express.Router();

//get all reviews
router.get("/get-all-review", getAllReviewController);

//create review
router.post("/write-review", writeReviewController);

//update review
router.put("/update-review/:id", updateReviewController);

//delete review
router.delete("/delete-review/:id", deleteReviewController);

export default router;
