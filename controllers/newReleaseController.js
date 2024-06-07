import fs from "fs";

import NewReleaseModel from "../models/newReleaseModel.js";

export const createNewreleaseController = async (req, res) => {
  try {
    let { booktitle } = req.fields;
    const { bookphoto } = req.files;
    switch (true) {
      case !booktitle:
        return res.status(500).send({ error: "Book Title is required" });
      case bookphoto && bookphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required & it should be less than 2MB" });
    }
    const bookPhoto = new NewReleaseModel({
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
      message: "Product Added to New Releases",
      bookPhoto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating new release",
    });
  }
};

export const getNewReleaseController = async (req, res) => {
  try {
    const newRelease = await NewReleaseModel.find({});

    res.status(200).send({
      success: true,

      message: "All New Releases",
      newRelease,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get new releases",
    });
  }
};

export const deleteNewReleaseController = async (req, res) => {
  try {
    await NewReleaseModel.findByIdAndDelete({ _id: req.params.pid }).select(
      "-bookphoto"
    );

    res.status(200).send({
      success: true,
      message: "New Release Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in delete new release product",
    });
  }
};
export const getNewReleaseImageController = async (req, res) => {
  try {
    const homeBook = await NewReleaseModel.findOne({
      title: req.params.title,
    }).select("bookphoto");
    if (homeBook && homeBook.bookphoto && homeBook.bookphoto.data) {
      res.set("Content-Type", homeBook.bookphoto.contentType);
      return res.status(200).send(homeBook.bookphoto.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "New Release not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get new release photo",
    });
  }
};
//get product photo
export const bookPhotoController = async (req, res) => {
  try {
    const bookimage = await NewReleaseModel.findById(req.params.id).select(
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
