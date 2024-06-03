import express from "express";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersController,
  getSingleOrderController,
  createOrder,
  cancelOrderController,
  getCancelOrdersController,
} from "../controllers/orderController.js";
const router = express.Router();

//get all order
router.get("/get-all-order", getAllOrders);

//get order of user
router.get("/get-user-order/:userID", getSingleOrderController);

//create order for user
router.post("/create-order", createOrder);

//update order of users
router.put("/update-order/:id", updateOrder);

// cancel order
router.put("/cancel/:id", cancelOrderController);

// get cancel data
router.get("/get-cancel-orders", getCancelOrdersController);

export default router;
