const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @route   POST /api/products
 * @desc    Crear nuevo producto
 * @access  Public
 */
router.post('/', productController.createProduct);

/**
 * @route   GET /api/products
 * @desc    Listar productos con filtros avanzados y paginación
 * @access  Public
 * @query   search, category, minPrice, maxPrice, inStock, isAvailable, supplier, page, limit, sortBy, sortOrder
 */
router.get('/', productController.listProducts);

/**
 * @route   GET /api/products/search
 * @desc    Búsqueda de texto completo
 * @access  Public
 * @query   q (query de búsqueda), page, limit
 */
router.get('/search', productController.searchProducts);

/**
 * @route   GET /api/products/low-stock
 * @desc    Obtener productos con stock bajo
 * @access  Public
 * @query   threshold (default: 10), page, limit
 */
router.get('/low-stock', productController.getLowStock);

/**
 * @route   GET /api/products/out-of-stock
 * @desc    Obtener productos sin stock
 * @access  Public
 * @query   page, limit
 */
router.get('/out-of-stock', productController.getOutOfStock);

/**
 * @route   GET /api/products/sku/:sku
 * @desc    Obtener producto por SKU
 * @access  Public
 */
router.get('/sku/:sku', productController.getProductBySku);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener producto por ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualizar producto
 * @access  Public
 */
router.put('/:id', productController.updateProduct);

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Actualizar stock del producto
 * @access  Public
 * @body    { quantity: Number, operation: 'add'|'subtract'|'set' }
 */
router.patch('/:id/stock', productController.updateStock);

/**
 * @route   DELETE /api/products/:id
 * @desc    Eliminar producto (soft delete)
 * @access  Public
 */
router.delete('/:id', productController.deleteProduct);

/**
 * @route   DELETE /api/products/:id/permanent
 * @desc    Eliminar producto permanentemente (hard delete)
 * @access  Public
 */
router.delete('/:id/permanent', productController.hardDeleteProduct);

module.exports = router;