const express = require('express');
const { check, oneOf } = require('express-validator/check');
const router = express.Router();
const stockController = require('../app/api/controllers/stock');


/**
 * @api {get} /stock/ Get user stock items
 * @apiGroup Stock
 *
 * @apiParam (Request body) {Number} page Page Number
 *
 * Search Filters:
 * @apiParam (Request body) {String} id Search by stock item id
 * @apiParam (Request body) {String} name Search by stock item name contains text
 * @apiParam (Request body) {Number} quantity Search by stock item quantity
 * @apiParam (Request body) {Number} price Search by stock item price
 * @apiParam (Request body) {Code} price Search by stock item code
 * @apiParam (Request body) {String} category Search by stock item category contains text
 */
router.get('/',
    check('page').optional().isNumeric(),
    check('quantity').optional().isNumeric(),
    check('price').optional().isNumeric(),
    check('code').optional().isNumeric(),
    check('category').optional(),
    stockController.getAllItems
);

/**
 * @api {post} /stock/ Create new stock item
 * @apiGroup Stock
 *
 * @apiParam (Request body) {String} name Stock item name
 * @apiParam (Request body) {Number} quantity Stock item quantity
 * @apiParam (Request body) {Number} price Stock item price
 * @apiParam (Request body) {Code} price Stock item code
 * @apiParam (Request body) {String} category Stock item category
 */
router.post('/',
    check('name').exists(),
    check('quantity').exists().isNumeric(),
    check('price').exists().isNumeric(),
    check('code').exists().isNumeric(),
    check('category').exists(),
    stockController.createItem
);


/**
 * @api {put} /stock/:id Update existing stock item
 * @apiGroup Stock
 *
 * @apiParam (Request body) {String} name Stock item name
 * @apiParam (Request body) {Number} quantity Stock item quantity
 * @apiParam (Request body) {Number} price Stock item price
 * @apiParam (Request body) {Code} price Stock item code
 * @apiParam (Request body) {String} category Stock item category
 */
router.put('/:id',oneOf([
        check('name').exists(),
        check('quantity').exists().isNumeric(),
        check('price').exists().isNumeric(),
        check('code').exists().isNumeric(),
        check('category').exists()
    ]),
    stockController.updateItem
);

/**
 * @api {delete} /stock/:id Delete stock item
 * @apiGroup Stock
 */
router.delete('/:id',stockController.deleteItem);


module.exports = router;
