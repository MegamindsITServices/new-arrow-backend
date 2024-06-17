import DealerModel from "../models/DealerModel.js";
import fs from "fs";
import mongoose from "mongoose";
// create a dealer
export const createDealerController = async (req, res) => {
  try {
    const { dealername, address, area, designation, phone, state, email } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !dealername: {
        return res.send({ message: "Dealer Name is Required" });
      }
      case !address: {
        return res.send({ message: "Address is Required" });
      }
      case !phone: {
        return res.send({ message: "Phone is Required" });
      }
      case !state: {
        return res.send({ message: "State is Required" });
      }
      case !email: {
        return res.send({ message: "Email is Required" });
      }
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required & it should be less than 2MB" });
    }

    const Dealer = new DealerModel({
      dealername,
      address,
      area,
      designation,
      email,
      state,
      phone,
    });
    await Dealer.save();
    if (photo) {
      Dealer.photo.data = fs.readFileSync(photo.path);
      Dealer.photo.contentType = photo.type;
    }

    await Dealer.save();
    res.status(201).send({
      success: true,
      message: "Dealer Added Successfully",
      Dealer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating dealer",
      error,
    });
  }
};

// Get Singlr dealer

// get all dealers
export const getSingleDealerController = async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await DealerModel.findById(id);
    if (!dealer) {
      return res.status(404).send({
        success: false,
        message: "Dealer not found",
      });
    }
    res.status(200).json(dealer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all dealers
export const getAllDealerController = async (req, res) => {
  try {
    const dealer = await DealerModel.find();
    res.status(200).json(dealer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete dealer
export const deleteDealerController = async (req, res) => {
  try {
    const { id } = req.params;
    await DealerModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in delete category",
    });
  }
};

//update controller
export const updateDealerController = async (req, res) => {
  try {
    const { dealername, address, area, designation, phone, email } = req.fields;
    const { photo } = req.files;
    console.log("ARea: ", photo);
    const { id } = req.params;
    let updateDealer = await DealerModel.findByIdAndUpdate(
      id,
      {
        dealername,
        designation,
        address,
        area,
        phone,
        email,
      },
      { new: true }
    );
    if (photo) {
      updateDealer.photo.data = fs.readFileSync(photo.path);
      updateDealer.photo.contentType = photo.type;
    }

    updateDealer = await updateDealer.save();

    res.status(200).send({
      success: true,
      message: "Dealer Updated Successfully",
      updateDealer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in update product",
    });
  }
};

export const getSelectedStateDealerController = async (req, res) => {
  try {
    const { state } = req.params;

    console.log("State Parameter:", state);
    const stateObjectId = mongoose.Types.ObjectId(state);
    const dealers = await DealerModel.find({ state: stateObjectId }).populate(
      "state"
    );
    console.log("Fetched Dealers:", dealers);
    res.status(200).json(dealers);
  } catch (error) {
    console.error("Error fetching dealer network data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDealerPhotoController = async (req, res) => {
  try {
    const { id } = req.params;
    const dealerPhoto = await DealerModel.findById(id).select("photo");
    if (dealerPhoto.photo.data) {
      res.set("Content-Type", dealerPhoto.photo.contentType);
      return res.status(200).send(dealerPhoto.photo.data);
    }
    res.status(200).send({
      success: true,
      message: "Single Dealer Photo fetched",
      dealerPhoto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get dealer photo",
    });
  }
};

export const getPhotoStateController = async (req, res) => {
  try {
    const dealerPhoto = await DealerModel.findOne({
      state: req.params.state,
    }).select("photo");
    if (dealerPhoto.photo.data) {
      res.set("Content-Type", dealerPhoto.photo.contentType);
      return res.status(200).send(dealerPhoto.photo.data);
    }
    res.status(200).send({
      success: true,
      message: "Single Dealer Photo fetched",
      dealerPhoto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product photo",
    });
  }
};
