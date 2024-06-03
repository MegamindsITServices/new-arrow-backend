import slugify from "slugify";
import BlogModel from "../models/BlogModel.js";
import fs from "fs";

// Create a new arrow activity post
export const uploadPostController = async (req, res) => {
  try {
    const { title, addresswithdate, content } = req.fields;
    const { photo } = req.files;
    const { secondphoto } = req.files;
    const { thirdphoto } = req.files;
    const slug = slugify(title, { lower: true });
    switch (true) {
      case !title:
        return res.status(500).send({ error: "Title is required" });

      case !addresswithdate:
        return res.status(500).send({ error: "Address With Date is required" });
      case !content:
        return res.status(500).send({ error: "Content is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required & it should be less than 2MB" });
      case secondphoto && secondphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Front Photo is required & it should be" });

      case thirdphoto && thirdphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Back Photo is required & it should be" });
    }

    const posts = new BlogModel({
      title,
      addresswithdate,
      content,
      slug,
    });

    if (photo) {
      posts.photo.data = fs.readFileSync(photo.path);
      posts.photo.contentType = photo.type;
    }
    if (secondphoto) {
      posts.secondphoto.data = fs.readFileSync(secondphoto.path);
      posts.secondphoto.contentType = secondphoto.type;
    }
    if (thirdphoto) {
      posts.thirdphoto.data = fs.readFileSync(thirdphoto.path);
      posts.thirdphoto.contentType = thirdphoto.type;
    }
    await posts.save();
    res.status(201).send({
      success: true,
      message: "Posts Created Successfully",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
      message: "Error in creating posts",
    });
  }
};
// update the post
export const updatePostController = async (req, res) => {
  try {
    const { title, addresswithdate, content } = req.fields;
    const { photo } = req.files;
    const { secondphoto } = req.files;
    const { thirdphoto } = req.files;
    const slug = slugify(title, { lower: true });
    //validation
    switch (true) {
      case !title:
        return res.status(500).send({ error: "Name is Required" });
      case !addresswithdate:
        return res.status(500).send({ error: "Description is Required" });
      case !content:
        return res.status(500).send({ error: "Description is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
      case secondphoto && secondphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Front Photo is required & it should be" });

      case thirdphoto && thirdphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Back Photo is required & it should be" });
    }

    const updatePost = await BlogModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        title,
        addresswithdate,
        content,
        slug,
      },
      { new: true }
    );
    if (photo) {
      updatePost.photo.data = fs.readFileSync(photo.path);
      updatePost.photo.contentType = photo.type;
    }
    if (secondphoto) {
      updatePost.secondphoto.data = fs.readFileSync(secondphoto.path);
      updatePost.secondphoto.contentType = secondphoto.type;
    }
    if (thirdphoto) {
      updatePost.thirdphoto.data = fs.readFileSync(thirdphoto.path);
      updatePost.thirdphoto.contentType = thirdphoto.type;
    }
    await updatePost.save();
    res.status(200).send({
      success: true,
      message: "Dealer Updated Successfully",
      updatePost,
    });
    console.log(updatePost);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in update product",
    });
  }
};

// get single product
export const getSinglePostController = async (req, res) => {
  try {
    const post = await BlogModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .select("-secondphoto")
      .select("-thirdphoto");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get single product",
    });
  }
};
// delete a post
export const deletePostController = async (req, res) => {
  try {
    await BlogModel.findOneAndDelete({ _id: req.params.id }).select("-photo");
    res.status(200).send({
      success: true,
      message: " Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in delete product",
    });
  }
};

// get all posts
export const getAllPostController = async (req, res) => {
  try {
    const posts = await BlogModel.find({})
      .select("-photo")
      .select("-secondphoto")
      .select("-thirdphoto")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All products",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product",
    });
  }
};

// get photo controller
export const getPhotoController = async (req, res) => {
  try {
    const posts = await BlogModel.findOne({ slug: req.params.slug }).select(
      "photo"
    );
    if (posts.photo.data) {
      res.set("Content-Type", posts.photo.contentType);
      return res.status(200).send(posts.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product post photo",
    });
  }
};

// get second photo controller
export const getSecondPhotoController = async (req, res) => {
  try {
    const posts = await BlogModel.findOne({ slug: req.params.slug }).select(
      "secondphoto"
    );
    if (posts.secondphoto.data) {
      res.set("Content-Type", posts.secondphoto.contentType);
      return res.status(200).send(posts.secondphoto.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product post photo",
    });
  }
};
// get third photo controller
export const getThirdPhotoController = async (req, res) => {
  try {
    const posts = await BlogModel.findOne({ slug: req.params.slug }).select(
      "thirdphoto"
    );
    if (posts.thirdphoto.data) {
      res.set("Content-Type", posts.thirdphoto.data.contentType);
      return res.status(200).send(posts.thirdphoto.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product post photo",
    });
  }
};
