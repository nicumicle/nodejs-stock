const stockModel = require('../models/stock');
const config = require('../../../config/app');

const { validationResult } = require('express-validator/check');
const HttpStatus = require('http-status-codes');

module.exports = {
    getAllItems: function (req, res) {
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(validationErrors.array());
        } else {
            let page = req.body.page
                ? parseInt(req.body.page)
                : 0;

            let searchFilter = {
                "user_id": req.body.userId
            };
            if(req.body.id){
                searchFilter._id= req.body.id;
            }
            if(req.body.name){
                searchFilter.name = new RegExp(req.body.name,'gi');
            }
            if(req.body.price){
                searchFilter.price = req.body.price;
            }
            if(req.body.code){
                searchFilter.code = req.body.code;
            }
            if(req.body.quantity){
                searchFilter.quantity = req.body.quantity;
            }
            if(req.body.category){
                searchFilter.category = new RegExp(req.body.category,'gi');
            }

            stockModel.find(searchFilter, function (err, result) {
                res.status(HttpStatus.OK).json({
                    status: HttpStatus.OK,
                    message: "Stock Items found.",
                    page: page,
                    data: result
                });
            }).skip(page * config.app.records_per_page).limit(config.app.records_per_page)
        }
    },

    createItem: function(req, res){
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(validationErrors.array());
        } else {
            let model = new stockModel({
                name: req.body.name,
                user_id: req.body.userId,
                quantity: req.body.quantity,
                price: req.body.price,
                code: req.body.code,
                category: req.body.category
            });
            model.save(function(err, stockItem){
               if(err){
                   return res.status(HttpStatus.BAD_REQUEST).json({
                       status: HttpStatus.BAD_REQUEST,
                       message: "Unable to save model."
                   });
               }
               return res.status(HttpStatus.OK).json({
                   status: HttpStatus.OK,
                   message: "Stock item successfully saved.",
                   data: {
                       item: stockItem
                   }
               });
            });
        }
    },

    updateItem: function(req, res) {
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(validationErrors.array());
        } else {
            stockModel.findOne({
                user_id: req.body.userId,
                _id: req.params.id
            },function(err, model) {
                if(err){
                    return res.status(HttpStatus.BAD_REQUEST)
                        .json({
                            status:HttpStatus.BAD_REQUEST,
                            message: "There was an error while trying to update Stock item.",
                        });
                } else if(model.length === 0 ){
                    return res.status(HttpStatus.NOT_FOUND)
                        .json({
                            status:HttpStatus.NOT_FOUND,
                            message: "Item not found.",
                        });
                }

                if(req.body.name){
                    model.name = req.body.name;
                }
                if(req.body.price){
                    model.price = req.body.price;
                }
                if(req.body.quantity){
                    model.quantity = req.body.quantity;
                }
                if(req.body.code){
                    model.code = req.body.code;
                }
                if(req.body.category){
                    model.category = req.body.category;
                }

                model.save(function(err){
                    if(err){
                        return res.status(HttpStatus.BAD_REQUEST)
                            .json({
                                status:HttpStatus.BAD_REQUEST,
                                message: "Unable to save stock Model.",
                            });
                    }
                });

                return res.status(HttpStatus.OK).json({
                    status: HttpStatus.OK,
                    message: 'Stock Item successfully updated.',
                    data: model
                });
            })
        }
    },

    deleteItem: function(req, res) {
        stockModel.findOne({
            user_id: req.body.userId,
            _id: req.params.id
        },function(err, model) {
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST)
                    .json({
                        status: HttpStatus.BAD_REQUEST,
                        message: "There was an error while trying to delete Stock item.",
                    });
            }
            if (model.length === 0) {
                return res.status(HttpStatus.NOT_FOUND)
                    .json({
                        status: HttpStatus.NOT_FOUND,
                        message: "Item not found.",
                    });
            }
            model.delete(function(err){
                if(err){
                    return res.status(HttpStatus.BAD_REQUEST)
                        .json({
                            status:HttpStatus.BAD_REQUEST,
                            message: "Unable to delete stock Model.",
                        });
                }
            });

            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'Stock Item successfully deleted.',
                data: model
            });
        });
    }

};