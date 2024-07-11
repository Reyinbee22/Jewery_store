const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary.js');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createProduct = async (req, res) => {
//   const {name, description, price, category } = req.body;
//   try {
//     const product = new Product({name, description, price, category });
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(400).json({ message: "failed to add products, try again"});
//   }
// };

const createProduct = async (req, res) => {
  const {name, description, price, category } = req.body;
    try {
        if (!name || !description || !price ) {
          return res
            .status(400)
            .json({ message: "Please enter all required fields" });
        }

        // Quick check to see if Product already exists
        const existingProduct = await Product.findOne({name})

        if(existingProduct){
          return res.json({message: "Item already exists, please edit instead"})
        }

        let image = null;
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          image = result.secure_url;  // Use the secure URL from Cloudinary
        }

        const productData = { ...req.body, image: image}
        const product = await Product.create(productData);
        res.status(200).json(product);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }

}

const deleteProduct = async (req, res) => {
  try {
      const {productId} = req.params;
      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
          return res.status(404).json({ message: "product not found, please use a valid id" });
      }
      
      res.status(200).json({message: "Product successfully deleted"})

  } catch (error) {
      res.status(500).json({ message: "Error Deleting Product" });
  }
}

module.exports = { getAllProducts, createProduct, deleteProduct };
