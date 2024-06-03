import express from "express";
import formidable from "express-formidable";
import {
  getAllPostController,
  updatePostController,
  uploadPostController,
  deletePostController,
  getPhotoController,
  getSecondPhotoController,
  getThirdPhotoController,
  getSinglePostController,
} from "../controllers/blogController.js";
const router = express.Router();

//get all blogs
router.get("/get-all-posts", getAllPostController);

//get single posts
router.get("/get-single-post/:slug", getSinglePostController);

//create post
router.post("/upload-post", formidable(), uploadPostController);

//update blog
router.put("/update-post/:id", formidable(), updatePostController);

//delete post
router.delete("/delete-post/:id", deletePostController);

//get single photo
router.get("/get-photo/:slug", getPhotoController);

//get second photo
router.get("/get-secondphoto/:slug", getSecondPhotoController);

// get third photo
router.get("/get-thirdphoto/:slug", getThirdPhotoController);

export default router;
