import fs from "fs";

import HomeBookModel from "../models/HomeBookModel.js";

export const createHomeBookController = async (req, res) => {
  try {
    let { booktitle } = req.fields || {};
    const { bookphoto } = req.files;
    booktitle = booktitle || "BookImage";
    switch (true) {
      case !booktitle:
        return res.status(500).send({ error: "Book Title is required" });
      case bookphoto && bookphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required & it should be less than 2MB" });
    }
    const bookPhoto = new HomeBookModel({
      booktitle,
    });
    // Process each photo
    if (bookphoto) {
      bookPhoto.bookphoto.data = fs.readFileSync(bookphoto.path);
      bookPhoto.bookphoto.contentType = bookphoto.type;
    }

    // Save the banner object to the database
    await bookPhoto.save();

    res.status(201).send({
      success: true,
      message: "Banner Created Successfully",
      bookPhoto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating banner",
    });
  }
};

export const getHomeBookController = async (req, res) => {
  try {
    const homeBook = await HomeBookModel.find({});

    res.status(200).send({
      success: true,

      message: "All home books",
      homeBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get home book photos",
    });
  }
};

export const getSingleHomeBookController = async (req, res) => {
  try {
  } catch (error) {}
};

export const updateHomeBookController = async (req, res) => {
  try {
  } catch (error) {}
};

export const deleteHomeBookController = async (req, res) => {
  try {
    await HomeBookModel.findByIdAndDelete({ _id: req.params.pid }).select(
      "-bookphoto"
    );

    res.status(200).send({
      success: true,
      message: " Home Book Deleted Successfully",
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
export const getHomeBookImageController = async (req, res) => {
  try {
    const homeBook = await HomeBookModel.findOne({
      title: req.params.title,
    }).select("bookphoto");
    if (homeBook && homeBook.bookphoto && homeBook.bookphoto.data) {
      res.set("Content-Type", homeBook.bookphoto.contentType);
      return res.status(200).send(homeBook.bookphoto.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Home book not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get home book photo",
    });
  }
};
//get product photo
export const bookPhotoController = async (req, res) => {
  try {
    const bookimage = await HomeBookModel.findById(req.params.id).select(
      "bookphoto"
    );
    if (bookimage.bookphoto.data) {
      res.set("Content-Type", bookimage.bookphoto.contentType);
      return res.status(200).send(bookimage.bookphoto.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product photo",
    });
  }
};
