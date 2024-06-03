import express from "express";
import formidable from "express-formidable";
import {
  createDealerController,
  getAllDealerController,
  deleteDealerController,
  updateDealerController,
  getSelectedStateDealerController,
  getPhotoStateController,
} from "../controllers/dealerController.js";
const router = express.Router();

router.post("/create-dealer", formidable(), createDealerController);

router.get("/get-all-dealer", getAllDealerController);

router.delete("/delete-dealer/:id", deleteDealerController);

router.put("/update-dealer/:id", updateDealerController);

router.get("/selected-state/:state", getSelectedStateDealerController);
router.get("/get-photo/:state", getPhotoStateController);

export default router;
