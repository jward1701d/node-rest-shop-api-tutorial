const mongoose = require('mongoose');
const Product = require('../models/product');

exports.GetAllProducts = (req,res,next) => {
  Product.find()
    .select('name price, _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      };
      res.status(200).json(response);
    })
    .catch( err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.CreateProduct = (req,res,next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.GetProduct = (req,res,next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .then(doc => {
      if(doc){
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            descritption: 'Get all products',
            url: 'http://localhost:3000/products'
          }
        });
      }else{
        res.status(404).json({message: 'No item found.'});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
}

exports.UpdateProduct = (req,res,next) => {
  const id = req.params.productId
  const updateOps= {};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result =>{
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.DeleteProduct = (req,res,next) => {
  const id = req.params.productId
  Product.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Poduct deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}