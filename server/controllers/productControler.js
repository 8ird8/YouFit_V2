const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");

// add
const AddProduct = async (req, res) => {
  try {
    const data = {
      product_Name: req.body.product_Name,
      product_Description: req.body.product_Description,
      product_Images: req.files.map((file) => file.filename),
      product_Category: req.body.product_Category,
      product_Price: req.body.product_Price,
      Affiliate_link: req.body.Affiliate_link,
      product_Gender : req.body.product_Gender
    };

    const newProduct = await Product.create(data);
    console.log("Product Added successfully:", newProduct);
    console.log(data);

    res.status(200).json({
      success: true,
      type: "success",
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(500)
      .json({ success: false, type: "error", message: "Error adding product" });
  }
};

// fetch products

const FetchingProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res
      .status(500)
      .json({ success: false, type: "error", message: "Error fetching posts" });
  }
};

// product details

const ProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      type: "error ",
      message: "Error fetching product",
    });
  }
};

// delete

const deleteImages = async (req, res) => {
  const { productId, imageName } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).send("Product not found");
  }

  product.product_Images = product.product_Images.filter(
    (img) => img !== imageName
  );
  await product.save();

  // Delete the image file from the server
  fs.unlink(path.join(__dirname, "../uploads", imageName), (err) => {
    if (err) {
      console.error("Error deleting image file:", err);
      return res.status(500).send("Error deleting image file");
    }

    res.send("Image deleted successfully");
  });
};

const DeleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const productToDelete = await Product.findById(productId);

    if (!productToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const filenames = productToDelete.product_Images;
    if (filenames && filenames.length) {
      filenames.forEach((filename) => {
        const filepath = path.join(__dirname, "../uploads", filename);
        fs.unlink(filepath, (err) => {
          if (err) console.error("Error deleting image file:", err);
        });
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        type: "error",
        message: "Post not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      type: "succes",
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const ProductToupdate = await Product.findById(productId);

    let updateData = {
      product_Name: req.body.product_Name
        ? req.body.product_Name
        : ProductToupdate.product_Name,
      product_Description: req.body.product_Description
        ? req.body.product_Description
        : ProductToupdate.product_Description,
      product_Category: req.body.product_Category
        ? req.body.product_Category
        : ProductToupdate.product_Category,
      product_Price: req.body.product_Price
        ? req.body.product_Price
        : ProductToupdate.product_Price,
    };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);

      if (
        ProductToupdate.product_Images &&
        ProductToupdate.product_Images.length > 0
      ) {
        // Combine existing images with new images
        updateData.product_Images = [
          ...ProductToupdate.product_Images,
          ...newImages,
        ];
      } else {
        updateData.product_Images = newImages;
      }
    } else {
      updateData.product_Images = ProductToupdate.product_Images;
    }

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
      }
    );

    if (updateProduct) {
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        post: updateProduct,
      });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating Product:", error);
    res.status(500).send("Server Error");
  }
};

const AddCart = async (req, res) => {
  const { productId } = req.params;

  const token = req.cookies.token; // Make sure 'token' is the correct cookie name
  if (!token) {
    return res
      .status(201)
      .json({ success: false, message: "Please Login first!" });
  }

  const decodedToken = jwt.verify(
    token,
    "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd"
  );
  const userId = decodedToken.userId;

  try {
    const productToAdd = await Product.findById(productId);

    if (!productToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const isAddTo = productToAdd.incart && productToAdd.incart.includes(userId);

    if (isAddTo) {
      const index = productToAdd.incart.indexOf(userId);
      productToAdd.incart.splice(index, 1);
      await productToAdd.save();
      res.status(200).json({
        success: true,
        message: " removed from cart",
      });
    } else {
      productToAdd.incart.push(userId);
      await productToAdd.save();
      res.status(200).json({
        success: true,
        type: "success",
        message: "Product Added to cart",
        products: productToAdd,
      });
    }
  } catch (error) {
    console.error("Error during adding  the product in cart:", error);
    res.status(500).json({
      success: false,
      type: "error",
      message: "Error processing your request",
    });
  }
};

const Cart = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ incart: userId })
      .populate("incart")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

module.exports = {
  AddProduct,
  FetchingProducts,
  ProductDetails,
  DeleteProduct,
  deleteImages,
  updateProduct,
  AddCart,
  Cart,
};
