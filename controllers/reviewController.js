import ReviewModel from "../models/ReviewModel.js";

//create review
export const writeReviewController = async (req, res) => {
  try {
    const { review, clientName } = req.body;
    if (!review) {
      return res.send({ message: "Review is Required" });
    }
    if (!clientName) {
      return res.send({ message: "client name is Required" });
    }
    const Review = await new ReviewModel({
      review,
      clientName,
    }).save();
    res.status(201).send({
      success: true,
      message: "Review Added Successfully",
      Review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating review",
      error,
    });
  }
};
//update review
export const updateReviewController = async (req, res) => {
  try {
    const { review } = req.body;
    const { clientName } = req.body;
    const { id } = req.params;
    const updateReview = await ReviewModel.findByIdAndUpdate(
      id,
      {
        review,
        clientName,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Review Updated Successfully",
      updateReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating review",
    });
  }
};
//delete review
export const deleteReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    await ReviewModel.findByIdAndDelete(id);
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

// get review
export const getAllReviewController = async (req, res) => {
  try {
    const review = await ReviewModel.find();
    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
