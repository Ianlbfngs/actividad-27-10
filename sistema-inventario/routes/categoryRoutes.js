const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @route   POST /api/categories
 * @desc    Crear nueva categoría
 * @access  Public
 */
router.post('/', categoryController.createCategory);

/**
 * @route   GET /api/categories
 * @desc    Listar todas las categorías con filtros y paginación
 * @access  Public
 * @query   page, limit, search, isActive, parentCategory, sortBy, sortOrder
 */
router.get('/', categoryController.listCategories);

/**
 * @route   GET /api/categories/tree
 * @desc    Obtener árbol de categorías (jerárquico)
 * @access  Public
 */
router.get('/tree', categoryController.getCategoryTree);

/**
 * @route   GET /api/categories/:id
 * @desc    Obtener categoría por ID
 * @access  Public
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route   GET /api/categories/:id/subcategories
 * @desc    Obtener subcategorías de una categoría
 * @access  Public
 */
router.get('/:id/subcategories', categoryController.getSubcategories);

/**
 * @route   PUT /api/categories/:id
 * @desc    Actualizar categoría
 * @access  Public
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Eliminar categoría (soft delete)
 * @access  Public
 */
router.delete('/:id', categoryController.deleteCategory);

/**
 * @route   DELETE /api/categories/:id/permanent
 * @desc    Eliminar categoría permanentemente (hard delete)
 * @access  Public
 */
router.delete('/:id/permanent', categoryController.hardDeleteCategory);

module.exports = router;