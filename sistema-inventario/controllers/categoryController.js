const Category = require('../models/Category');

// CREATE - Crear nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la categoría',
      error: error.message
    });
  }
};

// READ - Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('parentCategory', 'name');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    // Obtener ruta completa
    const fullPath = await category.getFullPath();
    
    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        fullPath
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al obtener la categoría',
      error: error.message
    });
  }
};

// UPDATE - Actualizar categoría
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('parentCategory', 'name');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la categoría',
      error: error.message
    });
  }
};

// DELETE - Eliminar categoría (soft delete)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.softDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Categoría eliminada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message
    });
  }
};

// DELETE - Eliminar físicamente (permanente)
exports.hardDeleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Categoría eliminada permanentemente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message
    });
  }
};

// LIST - Listar categorías con filtros y paginación
exports.listCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      parentCategory,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Construcción de query
    const query = { isDeleted: false };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (parentCategory) {
      query.parentCategory = parentCategory === 'null' ? null : parentCategory;
    }

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Ejecutar consulta
    const [categories, total] = await Promise.all([
      Category.find(query)
        .populate('parentCategory', 'name')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Category.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al listar categorías',
      error: error.message
    });
  }
};

// Obtener árbol de categorías
exports.getCategoryTree = async (req, res) => {
  try {
    const tree = await Category.getCategoryTree();
    
    res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al obtener el árbol de categorías',
      error: error.message
    });
  }
};

// Obtener subcategorías de una categoría
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Category.find({
      parentCategory: req.params.id,
      isDeleted: false
    });
    
    res.status(200).json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al obtener subcategorías',
      error: error.message
    });
  }
};