import express from "express";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import multer from "multer";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  productBackPhotoController,
  productFrontPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
  addCartItem,
  getCartItem,
  removeCartItem,
  uploadFile,
  searchSuggestionsFilterController,
} from "../controllers/productController.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post("/upload", upload.single("file"), uploadFile);

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//get products
router.get("/get-product", getProductController);
export default router;

//single product
router.get("/get-product/:uid", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//get front photo
router.get("/product-frontphoto/:pid", productFrontPhotoController);

//get back photo
router.get("/product-backphoto/:pid", productBackPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
//filter product
router.post("/product-filters", productFiltersController);

//count products
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

// suggestions search
router.get("/search-suggestion/:keyword", searchSuggestionsFilterController);

// similar products
router.get("/related-product/:pid/:cid", relatedProductController);
//payment gateway
router.get("/braintree/token", braintreeTokenController);
//payments
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

//get item in user cart
router.post("/cart/get-item", getCartItem);

//add item in user cart
router.post("/cart/add-item", addCartItem);

//remove item in user cart
router.post("/cart/remove-item", removeCartItem);
