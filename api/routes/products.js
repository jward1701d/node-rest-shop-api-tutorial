const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

const date = new Date().getTime();

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, date+'-'+ file.originalname);
  }
});

const upload = multer({
  storage: storage
});


router.get('/', ProductsController.GetAllProducts);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.CreateProduct);

router.get('/:productId', ProductsController.GetProduct);

router.patch('/:productId',checkAuth, ProductsController.UpdateProduct);

router.delete('/:productId',checkAuth,ProductsController.DeleteProduct);

module.exports = router;