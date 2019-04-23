const express = require('express');
const { check, oneOf } = require('express-validator/check');
const router = express.Router();
const userController = require('../app/api/controllers/users');
const jwtMiddleware = require('../app/api/middleware/jwt');


/**
 * @api {post} /users/login Generate jwt token for user
 * @apiGroup Users
 *
 * @apiParam (Request body) {String} name Client name
 * @apiParam (Request body) {String} email Client email
 * @apiParam (Request body) {String} password Client password
 */
router.post('/register',
    check('name').exists(),
    check('email').exists().isEmail(),
    check('password').exists(),
    userController.create
);

/**
* @api {post} /users/login Generate jwt token for user
* @apiGroup Users
 *
* @apiParam (Request body) {String} email Client email
* @apiParam (Request body) {String} password Client password
*/
router.post('/login',
    check('email').exists().isEmail(),
    check('password').exists(),
    userController.authenticate
);

/**
 * @api {put} /users/ Update user details
 * @apiGroup Users
 *
 * @apiParam (Request body) {String} name Client name
 * @apiParam (Request body) {String} password Client password
 */

router.put('/',
    oneOf([
        check('password').exists(),
        check('name').exists()
    ]),
    jwtMiddleware,
    userController.update
);

router.get('/me',
    jwtMiddleware,
    userController.me
);

module.exports = router;