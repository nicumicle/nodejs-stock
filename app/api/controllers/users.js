const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config/app');


const { validationResult } = require('express-validator/check');
const HttpStatus = require('http-status-codes');

module.exports = {
    create: function (req, res) {
        let validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(validationErrors.array());

        } else {

            userModel.findOne({email: req.body.email}, function (err, userInfo) {
                if (userInfo !== null) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        status: HttpStatus.BAD_REQUEST,
                        message: "Email already in use."
                    });
                }
                userModel.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }, function (err, result) {
                    if (err)
                        next(err);
                    else
                        res.status(HttpStatus.OK).json({
                            status: HttpStatus.OK,
                            message: "User added successfully!!!",
                            data: result
                        });
                });

            });
        }
    },

    authenticate: function (req, res) {
        let validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(validationErrors.array());
        } else {
            userModel.findOne({email: req.body.email}, function (err, userInfo) {
                if (err) {
                   return res.status(HttpStatus.BAD_REQUEST).json({
                       status: HttpStatus.BAD_REQUEST,
                       message: 'Error while searching for the user.'
                   });
                } else {
                    if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {

                        const token = jwt.sign(
                            {id: userInfo._id},
                            req.app.get('secretKey'),
                            {expiresIn: config.jwt.expiresIn}
                        );

                        res.status(HttpStatus.OK).json({
                            status: HttpStatus.OK,
                            message: "user successfully authenticated.",
                            data: {
                                user: userInfo,
                                token: token
                            }
                        });

                    } else {
                        res.status(HttpStatus.OK).json({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Invalid email or password."
                        });
                    }
                }
            });
        }
    },

    update: function(req, res) {
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(validationErrors.array());
        } else {
            userModel.findOne({"_id": req.body.userId},function(err, user){

                if(typeof req.body.password !== 'undefined'){
                    user.password = req.body.password;
                }
                if(typeof req.body.name !== 'undefined'){
                    user.name = req.body.name;
                }

                user.save(function(err){
                    if(err){
                        res.status(HttpStatus.BAD_REQUEST).json({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Unable to update user"
                        });
                    } else {
                        res.status(HttpStatus.OK).json({status: HttpStatus.OK, message: "user updated!!!"});
                    }
                });
            });

        }
    },

    me: function(req, res){
        userModel.findOne({"_id": req.body.userId},function(err, user){
            res.status(HttpStatus.OK).json({status: HttpStatus.OK, data: {"user": user} });
        });
    }

};
