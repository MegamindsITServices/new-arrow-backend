import slugify from "slugify";
import bannerModel from "../models/bannerModel.js";
import fs from "fs";

export const CreateBannerController = async (req, res) => {
  try {
    let { title } = req.fields || {};
    const { photo, secondphoto, thirdphoto } = req.files;
    title = title || "Banner";
    const slug = slugify(title, { lower: true });
    switch (true) {
      case !title:
        return res.status(500).send({ error: "Title is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required & it should be less than 2MB" });
      case secondphoto && secondphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Front Photo is required & it should be" });

      case thirdphoto && thirdphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Back Photo is required & it should be" });
    }
    const banner = new bannerModel({
      title,
      slug,
    });
    // Process each photo
    if (photo) {
      banner.photo.data = fs.readFileSync(photo.path);
      banner.photo.contentType = photo.type;
    }
    if (secondphoto) {
      banner.secondphoto.data = fs.readFileSync(secondphoto.path);
      banner.secondphoto.contentType = secondphoto.type;
    }
    if (thirdphoto) {
      banner.thirdphoto.data = fs.readFileSync(thirdphoto.path);
      banner.thirdphoto.contentType = thirdphoto.type;
    }

    // Save the banner object to the database
    await banner.save();

    res.status(201).send({
      success: true,
      message: "Banner Created Successfully",
      banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating banner",
    });
  }
};

export const getBannerController = async (req, res) => {
  try {
    const banner = await bannerModel
      .find({})
      .select("-photo")
      .select("-secondphoto")
      .select("-thirdphoto");
    res.status(200).send({
      success: true,

      message: "All banners",
      banner,
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

export const updateBannerController = async (req, res) => {
  try {
    let { title } = req.fields;
    const { photo } = req.files;
    const { secondphoto } = req.files;
    const { thirdphoto } = req.files;
    title = title || "Banner";

    switch (true) {
      case !title:
        return res.status(500).send({ error: "Title is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          error: "First Photo is required & it should be less than 2MB",
        });

      case secondphoto && secondphoto.size > 1000000:
        return res
          .status(500)
          .send({ error: "Second Photo is required & it should be" });

          case thirdphoto && thirdphoto.size > 1000000: // Correct the error message
          return res.status(500).send({
            error: "Third Photo is required & it should be less than 2MB",
          });
    }
    const banner = await bannerModel.findOneAndUpdate(
      { slug: req.params.slug }, // Filter object
      { ...req.fields, slug: slugify(title, { lower: true }) },
      { new: true }
    );
    if (photo) {
      banner.photo.data = fs.readFileSync(photo.path);
      banner.photo.contentType = photo.type;
    }
    if (secondphoto) {
      banner.secondphoto.data = fs.readFileSync(secondphoto.path);
      banner.secondphoto.contentType = secondphoto.type;
    }
    if (thirdphoto) {
      banner.thirdphoto.data = fs.readFileSync(thirdphoto.path);
      banner.thirdphoto.contentType = thirdphoto.type;
    }

    await banner.save();
    res.status(201).send({
      success: true,
      message: "Banner Updated Successfully",
      banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update banner",
    });
  }
};

export const deleteBannerController = async (req, res) => {
  try {
    await bannerModel
      .findByIdAndDelete({ _id: req.params.pid })
      .select("-firstbannerphoto")
      .select("-secondbannerphoto")
      .select("-thirdbannerphoto");
    res.status(200).send({
      success: true,
      message: " banner Deleted Successfully",
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
export const getFirstBannerImageController = async (req, res) => {
  try {
    const banner = await bannerModel
      .findOne({ slug: req.params.slug })
      .select("photo");
    if (banner && banner.photo && banner.photo.data) {
      res.set("Content-Type", banner.photo.contentType);
      return res.status(200).send(banner.photo.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get banner photo",
    });
  }
};

export const getSecondBannerImageController = async (req, res) => {
  try {
    const banner = await bannerModel
      .findOne({ slug: req.params.slug })
      .select("secondphoto");
    if (banner && banner.secondphoto && banner.secondphoto.data) {
      res.set("Content-Type", banner.secondphoto.contentType);
      return res.status(200).send(banner.secondphoto.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get banner photo",
    });
  }
};

export const getThirdBannerImageController = async (req, res) => {
  try {
    const banner = await bannerModel
      .findOne({ slug: req.params.slug })
      .select("thirdphoto");
    if (banner && banner.thirdphoto && banner.thirdphoto.data) {
      res.set("Content-Type", banner.thirdphoto.contentType);
      return res.status(200).send(banner.thirdphoto.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get banner photo",
    });
  }
};
export const getSingleBannerController = async (req, res) => {
  try {
    const banner = await bannerModel.findOne({ slug: req.params.slug });
    if (!banner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single banner fetched",
      banner,
    });
  } catch (error) {
    console.error("Error fetching single banner:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error to get single banner",
    });
  }
};
