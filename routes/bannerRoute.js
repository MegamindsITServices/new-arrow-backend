import express from "express";
import formidable from "express-formidable";

import {
  CreateBannerController,
  deleteBannerController,
  getBannerController,
  getFirstBannerImageController,
  getSecondBannerImageController,
  getSingleBannerController,
  getThirdBannerImageController,
  updateBannerController,
} from "../controllers/bannerController.js";

const router = express.Router();

router.post("/create-banner", formidable(), CreateBannerController);
router.get("/get-banner", getBannerController);
//single product
router.get("/get-banner/:slug", getSingleBannerController);
router.put("/update-banner/:slug", formidable(), updateBannerController);
router.delete("/delete-banner/:pid", deleteBannerController);
router.get("/get-first-banner-image/:slug", getFirstBannerImageController);
router.get("/get-second-banner-image/:slug", getSecondBannerImageController);
router.get("/get-third-banner-image/:slug", getThirdBannerImageController);
export default router;
