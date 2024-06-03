import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import OwnerModel from "../models/OwnerModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const decode = JWT.verify(authHeader, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log("The error is here", error);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

//owner middleware
export const isOwner = async (req, res, next) => {
  try {
    const owner = await OwnerModel.findById(req.owner._id);
    if (owner.role !== 2) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in owner middleware",
    });
  }
};
