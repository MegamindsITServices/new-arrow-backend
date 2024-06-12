import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import subjectRoute from "./routes/subjectRoute.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoute.js";
import dealerRoutes from "./routes/dealerRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import bannerRoute from "./routes/bannerRoute.js";
import HomeBookRoute from "./routes/homeBookRoute.js";
import dealerStateRoute from "./routes/dealerStateRoute.js";
import newReleaseRoutes from "./routes/newReleaseRoutes.js";
import mongoose from "mongoose";

import path from "path";
//Configure env
dotenv.config();
const __dirname = path.resolve();
//db config
// connectDB();
//rest object
const app = express();
// app.use((req, res, next) => {
//   if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
//     next();
//   } else {
//     res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
//     res.header("Expires", "-1");
//     res.header("Pragma", "no-cache");
//     res.sendFile(path.join(__dirname, "build", "index.html"));
//   }
// });

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://relaxed-cranachan-d0c6e0.netlify.app/",
  "https://relaxed-cranachan-d0c6e0.netlify.app",
  "http://arrowpublications.onrender.com",
  "https://arrowpublications.onrender.com",
  "https://arrowpublicationsindia.netlify.app/",
  "https://arrowpublicationsindia.netlify.app",
  "http://arrowpublicationsindia.netlify.app/",
  "http://arrowpublications.onrender.com",
  "https://arrowpublications.onrender.com",
  "https://arrowpublications.onrender.com/",
  "https://bharathmegaminds.com/",
  "https://bharathmegaminds.com",
  "http://bharathmegaminds.com/",
  "https://arrowpublication.netlify.app/",
  "http://arrowpublication.netlify.app/",
  "https://arrowpublication.netlify.app",
  "https://arrowpublications.netlify.app/",
  "http://arrowpublications.netlify.app/",
  "https://arrowpublications.netlify.app",
  "http://arrowpublications.netlify.app",
  "http://new-arrow-backend.onrender.com",
  "https://new-arrow-backend.onrender.com",
  "https://new-arrow-backend.onrender.com/",
  undefined,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS from origin : ${origin}`));
    }
  },
  credentials: true,
};

//middlewares
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/subject", subjectRoute);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/dealer", dealerRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/posts", blogRoutes);
app.use("/api/v1/banner", bannerRoute);
app.use("/api/v1/bookphoto", HomeBookRoute);
app.use("/api/v1/new-release", newReleaseRoutes);

app.use("/api/v1/dealerstate", dealerStateRoute);

//rest api

const visitorSchema = new mongoose.Schema({
  counter: {
    type: Number,
    default: 0,
  },
});

// Creating Visitor Table in visitCounterDB
const Visitor = mongoose.model("Visitor", visitorSchema);

const siteViewsUp = async () => {
  const visitor = await Visitor.findOne();
  if (visitor) {
    visitor.counter++;
    await visitor.save();
  } else {
    const newVisitor = new Visitor({
      counter: 1,
    });
    await newVisitor.save();
  }
};


app.get("/api/visitor-count", async (req, res) => {
  await siteViewsUp();
  return res.json({ success: true });
});

app.get("/api/visitors", async (req, res) => {
  const visitor = await Visitor.findById("6669146a0c3687ba21e5bb75");
  res.json({
    visitors: visitor.counter,
  });
});


app.get("/s", (req, res) => {
  res.send("Welcome to Arrow Publication pvt. ltd.");
});

const PORT = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, "../arrow-frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../arrow-frontend/build/index.html"));
});

connectDB().then(() => {
  //run listen
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});
