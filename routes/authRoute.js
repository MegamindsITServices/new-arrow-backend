import express from "express";

import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  userDetailsController,
  userDeleteController,
  ownersController,
  ownerDeleteController,
  adminRegisterController,
  updateAdminProfileController,
  ownerRegisterController,
  getAllOwnersController,
  testOwnerController,
} from "../controllers/authController.js";
import {
  isAdmin,
  isOwner,
  requireSignIn,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

//REGISTER || METHOD POST
router.post("/register", registerController);
//REGISTER || ADMIN
router.post("/admin-register", adminRegisterController);

//REGISTER || OWNER
router.post("/owner-register", ownerRegisterController);
// //LOGIN || OWNERS
// router.post("/get-owner", ownerLoginController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//Get User Details
router.get("/get-user", userDetailsController);
//LOGIN || OWNERS
router.get("/get-owner", getAllOwnersController);
//Get Owners
router.get("/get-owners", ownersController);

//Delete a User
router.delete("/delete-user/:id", userDeleteController);

//Delete a Owner
router.delete("/delete-owner/:id", ownerDeleteController);

//Forgot password || POST
router.post("/forgot-password", forgotPasswordController);

//Test Routes
router.get("/test", requireSignIn, isAdmin, testController);

//owner test
router.get("/owner-test", requireSignIn, isOwner, testOwnerController);
//Protected User Route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/owner-auth", requireSignIn, isOwner, (req, res) => {
  res.status(200).send({ ok: true });
});

//user update profile
router.put("/profile", requireSignIn, updateProfileController);

//admin update profile
router.put("/admin-profile-update/:id", updateAdminProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);
export default router;
