import SubjectModel from "../models/SubjectModel.js";
import slugify from "slugify";

export const createSubjectController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is Required" });
    }
    const exitingSubject = await SubjectModel.findOne({ name });
    if (exitingSubject) {
      return res.status(200).send({ message: "Subject already exists" });
    }

    const subject = await new SubjectModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(200).send({
      success: true,
      message: "New Subject has been created",
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};

export const updateSubjectController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const subject = await SubjectModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

export const getSubjectsController = async (req, res) => {
  try {
    const subject = await SubjectModel.find({});
    res.status(200).send({
      success: true,
      message: "All Subjects",
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting subject",
    });
  }
};

export const getSingleSubjectsController = async (req, res) => {
  try {
    const subject = await SubjectModel.find({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "single Subject Fetched",
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single subject",
    });
  }
};

export const deleteSubjectController = async (req, res) => {
  try {
    const { id } = req.params;
    await SubjectModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting subject",
    });
  }
};
