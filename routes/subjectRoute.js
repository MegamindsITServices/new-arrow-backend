import express from "express";

import {
  createSubjectController,
  deleteSubjectController,
  getSingleSubjectsController,
  getSubjectsController,
  updateSubjectController,
} from "../controllers/subjectController.js";

const router = express.Router();

//create subject
router.post("/create-subject", createSubjectController);

//update subject
router.put("/update-subject/:id", updateSubjectController);

//get all subjects
router.get("/subjects", getSubjectsController);

// get single subjects
router.get("/single-subject/:slug", getSingleSubjectsController);

//delete subject
router.delete("/delete-subject/:id", deleteSubjectController);

export default router;
