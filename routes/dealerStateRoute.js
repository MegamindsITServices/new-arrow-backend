import express from "express";
import {
  createDealerStateController,
  deleteDealerStateController,
  getDealerStateController,
  getSingleDealerStateController,
  updateDealerStateController,
} from "../controllers/dealerStateController.js";

const router = express.Router();

//create dealer state
router.post("/create-dealer-state", createDealerStateController);

//update dealer state
router.put("/update-dealer-state/:id", updateDealerStateController);

//get all dealer state
router.get("/get-state", getDealerStateController);

//delete dealer state
router.delete("/delete-dealer-state/:id", deleteDealerStateController);

//get single dealer state
router.get("/get-single-dealer-state/:slug", getSingleDealerStateController);
export default router;
