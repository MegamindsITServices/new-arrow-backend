import dealerStateModel from "../models/DealerStateModel.js";
import slugify from "slugify";

export const createDealerStateController = async (req, res) => {
  try {
    const { state } = req.body;

    if (!state) {
      return res.status(401).send({ message: "State is required" });
    }

    const dealerState = await new dealerStateModel({
      state,
      slug: slugify(state),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Dealer State has been created",
      dealerState,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating dealer state",
    });
  }
};

export const updateDealerStateController = async (req, res) => {
  try {
    const { state } = req.body;
    const { id } = req.params;

    const dealerState = await dealerStateModel.findByIdAndUpdate(
      id,
      {
        state,
        slug: slugify(state),
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Dealer State Updated Successfully",
      dealerState,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message, // Send error message instead of entire error object
      message: "Error while updating dealer state",
    });
  }
};

export const getDealerStateController = async (req, res) => {
  try {
    const dealerState = await dealerStateModel.find({});
    res.status(200).send({
      success: true,
      message: "All Dealer states",
      dealerState,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting dealer state",
    });
  }
};

export const deleteDealerStateController = async (req, res) => {
  try {
    const { id } = req.params;
    await dealerStateModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Dealer State Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting dealer state",
    });
  }
};

export const getSingleDealerStateController = async (req, res) => {
  try {
    const dealerState = await dealerStateModel.findOne({
      slug: req.params.slug,
    });
    res.status(200).send({
      success: true,
      message: "Get Dealer State Fetched Successfully",
      dealerState,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching dealer state",
    });
  }
};
