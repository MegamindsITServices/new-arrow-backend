import slugify from "slugify";
import productModel from "../models/productModel.js";
import SubjectModel from "../models/SubjectModel.js";
import CategoryModel from "../models/CategoryModel.js";
import dotenv from "dotenv";
import "../models/CategoryModel.js";
import userModel from "../models/userModel.js";
import braintree from "braintree";
import fs from "fs";
import { parse } from "csv-parse";
import path from "path";
import { getGlobals } from "common-es";
dotenv.config();
//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "hmtcv5s2twkjjrz5",
  publicKey: "2qq3cdb5xgtmj2g9",
  privateKey: "12567bdff081d7be0251a8371d9a538f",
});

const { __dirname, __filename } = getGlobals(import.meta.url);

const generateNewUid = async () => {
  // Find the product with the highest uid
  const lastProduct = await productModel.findOne().sort({ uid: -1 });

  // Default initial value if no products are found
  let lastUid = "ARW000000";

  if (lastProduct) {
    lastUid = lastProduct.uid;
  }

  // Extract the numeric part and increment it
  const numericPart = parseInt(lastUid.slice(3), 10) + 1;

  // Format the new uid with leading zeros
  const newUid = "ARW" + numericPart.toString().padStart(6, "0");

  return newUid;
};

export const getNewProductUid = async (req, res) => {
  try {
    const uid = await generateNewUid();
    if (!uid)
      return res
        .status(403)
        .json({ success: false, message: "Failed to generate new UID" });

    return res.status(200).json({ success: true, uid });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate new UID" });
  }
};

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      author,
      pages,
      subject,
      price,
      isbn,
      category,
      // quantity,
    } = req.fields;
    const { photo } = req.files;
    const { frontphoto } = req.files;
    const { backphoto } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });

      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !author:
        return res.status(500).send({ error: "Author is required" });
      case !pages:
        return res.status(500).send({ error: "Page is required" });
      case !subject:
        return res.status(500).send({ error: "Subject is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !isbn:
        return res.status(500).send({ error: "ISBN Number is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      // case !quantity:
      //   return res.status(500).send({ error: "Quantity is required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required & it should be less than 2MB" });

      case frontphoto && frontphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Front Photo is required & it should be" });

      case backphoto && backphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Back Photo is required & it should be" });
    }

    let uid = await generateNewUid();

    let existingProduct = await productModel.findOne({ uid });

    if (existingProduct) {
      uid = await generateNewUid(); // Ensure unique uid
    }

    const products = await productModel.create({
      ...req.fields,
      uid,
      slug: slugify(name),
    });

    const currentDate = new Date();
    const sevenDaysAgo = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    // Log the createdAt date to debug
    console.log("Product createdAt:", products.createdAt);
    products.newRelease = products.createdAt >= sevenDaysAgo;
    // Log the newRelease flag to debug
    console.log("Product newRelease:", products.newRelease);
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    if (frontphoto) {
      products.frontphoto.data = fs.readFileSync(frontphoto.path);
      products.frontphoto.contentType = photo.type;
    }
    if (backphoto) {
      products.backphoto.data = fs.readFileSync(backphoto.path);
      products.backphoto.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in create product",
    });
  }
};

//get all products

export const getProductController = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const startIndex = (pageNumber - 1) * limit;

    console.log(
      "Page number: " + pageNumber,
      "\n\nLimit: " + limit,
      "\n\n",
      startIndex
    );

    const pipeline = [
      { $match: {} },
      {
        $lookup: {
          from: "categories", // The name of the category collection
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "subjects", // The name of the subject collection
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $project: {
          photo: 0,
          frontphoto: 0,
          backphoto: 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: startIndex },
      { $limit: limit },
    ];

    const products = await productModel.aggregate(pipeline).allowDiskUse(true);
    const totalProducts = await productModel.countDocuments();

    return res.status(200).json({
      success: true,
      currentPage: pageNumber,
      countTotal: totalProducts,
      message: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product",
    });
  }
};

// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ uid: req.params.uid })
      .select("-photo")
      .select("-frontphoto")
      .select("-backphoto")
      .populate("category")
      .populate("subject");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get single product",
    });
  }
};

//get product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
    res.status(200).send({
      success: false,

      message: "No photo found",
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

// get front photo
export const productFrontPhotoController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.pid)
      .select("frontphoto");
    if (product.frontphoto.data) {
      res.set("Content-Type", product.frontphoto.contentType);
      return res.status(200).send(product.frontphoto.data);
    }
    res.status(200).send({
      success: false,

      message: "No Front photo found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product front photo",
    });
  }
};

//get back photo
export const productBackPhotoController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.pid)
      .select("backphoto");
    if (product.backphoto.data) {
      res.set("Content-Type", product.backphoto.contentType);
      return res.status(200).send(product.backphoto.data);
    }
    res.status(200).send({
      success: false,

      message: "No back photo found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get product back photo",
    });
  }
};

// delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel
      .findOneAndDelete({ _id: req.params.pid })
      .select("-photo");
    res.status(200).send({
      success: true,
      message: " Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in delete product",
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      author,
      pages,
      subject,
      price,
      isbn,
      category,
      // quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;
    const { frontphoto } = req.files;
    const { backphoto } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !author:
        return res.status(500).send({ error: "Description is Required" });
      case !pages:
        return res.status(500).send({ error: "Description is Required" });
      case !subject:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !isbn:
        return res.status(500).send({ error: "Description is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      // case !quantity:
      //   return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
      case frontphoto && frontphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Front Photo is required & it should be" });

      case backphoto && backphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Back Photo is required & it should be" });
    }
    const { pid } = req.params;

    let existingSubject = await SubjectModel.findOne({ name: subject });
    if (!existingSubject) {
      existingSubject = await SubjectModel.create({
        name: subject,
        slug: slugify(subject),
      });
    }
    let existingCategory = await CategoryModel.findOne({ name: category });

    if (!existingCategory) {
      existingCategory = await CategoryModel.create({
        name: category,
        slug: slugify(category),
      });
    }

    req.fields.subject = existingSubject._id;
    req.fields.category = existingCategory._id;

    const products = await productModel.findByIdAndUpdate(
      pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    if (frontphoto) {
      products.frontphoto.data = fs.readFileSync(frontphoto.path);
      products.frontphoto.contentType = frontphoto.type;
    }
    if (backphoto) {
      products.backphoto.data = fs.readFileSync(backphoto.path);
      products.backphoto.contentType = backphoto.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};
//Filter Products
// export const productFiltersController = async (req, res) => {
//   try {
//     const { checked, radio } = req.body;
//     console.log("recieved:", checked, radio);
//     let args = {};
//     if (checked.length > 0) {
//       args.category = checked;
//       args.subject = checked;
//     }

//     if (radio.length === 2) {
//       args.price = { $gte: radio[0], $lte: radio[1] };
//     }
//     console.log("Filtering with args:", args);
//     const products = await productModel.find(args);
//     console.log("Filtered products:", products);
//     res.status(200).send({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({
//       success: false,
//       message: "Error WHile Filtering Products",
//       error,
//     });
//   }
// };

// export const productFiltersController = async (req, res) => {
//   try {
//     const { category, subject, radio } = req.body;
//     console.log("Received:", category, subject, radio);

//     let args = {};

//     if (category) {
//       args.category = category;
//     }

//     if (subject) {
//       args.subject = subject;
//     }

//     if (radio && radio.length === 2) {
//       args.price = { $gte: radio[0], $lte: radio[1] };
//     }

//     console.log("Filtering with args:", args);
//     const products = await productModel.find(args);
//     // console.log("Filtered products:", products);
//     return res.status(200).send({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({
//       success: false,
//       message: "Error while filtering products",
//       error,
//     });
//   }
// };

productModel.createIndexes({ category: 1, subject: 1, price: 1 });

export const productFiltersController = async (req, res) => {
  try {
    const { category, subject, radio } = req.body;

    // Build the query object dynamically
    const query = {};

    if (category) {
      query.category = category;
    }

    if (subject) {
      query.subject = subject;
    }

    if (radio && radio.length === 2) {
      query.price = { $gte: radio[0], $lte: radio[1] };
    }

    console.log("Filtering with query:", query);

    // Use lean() for faster read-only queries
    const products = await productModel
      .find(query)
      .select("-photo -frontphoto -backphoto")
      .lean();

    const totalProducts = products.length;

    // Log count instead of full product details for large datasets
    console.log(`Filtered products count: ${products.length}`);

    return res.status(200).send({
      success: true,
      countTotal: totalProducts,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(201).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product count",
      error: error.message,
    });
  }
};

// product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage.limit(perPage).sort({ createdAt: -1 }));

    res.status(201).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page",
      error,
    });
  }
};

//search controller
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params; // Access keyword from req.params.keyword
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { uid: { $regex: keyword, $options: "i" } },
          // { subject: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search product api",
      error,
    });
  }
};

//related product controller
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search product api",
      error,
    });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// get cart item
export const getCartItem = async (req, res) => {
  try {
    const { userID } = req.body;
    console.log(userID);
    const user = await userModel.findById(userID).populate("cart");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//add to cart
export const addCartItem = async (req, res) => {
  try {
    const { productID, userID, role } = req.body;
    console.log({ productID, userID, role });

    const user = await userModel.findById(userID);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await productModel.findById(productID);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (!user.cart) {
      user.cart = [];
    }

    user.cart.push(product);

    const updatedUser = await user.save();
    console.log(updatedUser);

    res.status(200).json({ cart: updatedUser.cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//remove cart item
export const removeCartItem = async (req, res) => {
  try {
    const { productID, userID } = req.body;
    console.log({ productID, userID });

    const user = await userModel.findById(userID);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User's cart is empty" });
    }

    const updatedCart = user.cart.filter(
      (item) => String(item._id) !== productID
    );

    user.cart = updatedCart;

    const updatedUser = await user.save();
    console.log(updatedUser);

    res.status(200).json({ cart: updatedUser.cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const filePath = req.file.path;

    fs.readFile(filePath, function (err, fileData) {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading file.");
      }

      parse(
        fileData,
        { columns: false, trim: true },
        async function (err, rows) {
          if (err) {
            console.error(err);
            return res.status(500).send("Error parsing CSV file.");
          }

          const headers = rows[0].map((header) => header.trim());
          const results = [];

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const product = {};
            let allFieldsPresent = true;

            for (let j = 0; j < headers.length; j++) {
              const value = row[j].trim();
              if (headers[j] !== "isbn" && !value) {
                allFieldsPresent = false;
                break;
              }

              if (headers[j] === "price") {
                const priceString = value.replace(/\t/g, ""); // Replace tabs with empty string
                product[headers[j]] = parseFloat(priceString).toFixed(2) || 0; // Parse the price value to float
              } else if (headers[j] === "isbn") {
                const isbnString = value.replace(/\t/g, "");
                product[headers[j]] = isbnString; // Keep the ISBN as a string
              } else {
                product[headers[j]] = value;
              }
            }

            if (!allFieldsPresent) {
              console.log("Incomplete data for row:", row);
              continue;
            }

            try {
              const {
                name,
                description,
                author,
                pages,
                price,
                isbn,
                uid,
                Subject,
                Class,
              } = product;

              const parsedPrice = parseFloat(price).toFixed(2) || 0;
              const parsedIsbn = isbn; // ISBN is kept as a string

              const slug = slugify(name, { lower: true, strict: true });

              const defaultPhotoPath = path.join(
                process.cwd(),
                "images",
                "image-512.jpg"
              );

              let subject = await SubjectModel.findOne({ name: Subject });
              if (!subject) {
                subject = await SubjectModel.create({
                  name: Subject,
                  slug: slugify(Subject),
                });
              }
              let category = await CategoryModel.findOne({ name: Class });

              if (!category) {
                category = await CategoryModel.create({
                  name: Class,
                  slug: slugify(Class),
                });
              }

              let existingProduct = await productModel.findOne({ uid });

              if (existingProduct) {
                existingProduct.name = name;
                existingProduct.description = description;
                existingProduct.author = author;
                existingProduct.pages = parseInt(pages) || 0;
                existingProduct.price = parsedPrice;
                existingProduct.isbn = parsedIsbn ?? "";
                existingProduct.slug = slug;
                existingProduct.subject = subject._id;
                existingProduct.category = category._id;
                existingProduct.photo = {
                  data: fs.readFileSync(defaultPhotoPath),
                  contentType: "image/jpeg",
                };

                await existingProduct.save();
                results.push(existingProduct);
              } else {
                const newProduct = new productModel({
                  name,
                  description,
                  author,
                  pages: parseInt(pages) || 0,
                  price: parsedPrice,
                  isbn: parsedIsbn ?? "",
                  slug,
                  uid,
                  subject: subject._id,
                  category: category._id,
                  photo: {
                    data: fs.readFileSync(defaultPhotoPath),
                    contentType: "image/jpeg",
                  },
                });

                await newProduct.save();
                results.push(newProduct);
              }
            } catch (error) {
              console.error("Error saving product:", error);
            }
          }

          fs.unlinkSync(filePath);
          res.status(200).send("Data uploaded successfully.");
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const searchSuggestionsFilterController = async (req, res) => {
  try {
    const { keyword } = req.params; // Access the search keyword from the request parameters
    const query = decodeURIComponent(keyword); // Decode the query
    console.log(query);

    const suggestions = await productModel
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
      .select("-photo -backphoto -frontphoto");

    res.json(suggestions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
