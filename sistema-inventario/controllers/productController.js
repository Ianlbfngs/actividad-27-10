const Product = require('../models/Product');

// CREATE - Crear nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    await product.populate('category', 'name description');
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message
    });
  }
};

// READ - Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('category', 'name description parentCategory');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al obtener el producto',
      error: error.message
    });
  }
};

// READ - Obtener producto por SKU
exports.getProductBySku = async (req, res) => {
  try {
    const product = await Product.findOne({
      sku: req.params.sku.toUpperCase(),
      isDeleted: false
    }).populate('category', 'name description');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al obtener el producto',
      error: error.message
    });
  }
};

// UPDATE - Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('category', 'name description');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

// UPDATE - Actualizar stock
exports.updateStock = async (req, res) => {
  try {
    const { quantity, operation = 'set' } = req.body;
    
    if (!quantity && quantity !== 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad es requerida'
      });
    }
    
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    await product.updateStock(quantity, operation);
    
    res.status(200).json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el stock',
      error: error.message
    });
  }
};

// DELETE - Eliminar producto (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.softDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al eliminar el producto',
      error: error.message
    });
  }
};

// DELETE - Eliminar físicamente (permanente)
exports.hardDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Producto eliminado permanentemente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al eliminar el producto',
      error: error.message
    });
  }
};

// LIST - Listar productos con filtros avanzados y paginación
exports.listProducts = async (req, res) => {
  try {
    const result = await Product.advancedSearch(req.query, req.query);
    
    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al listar productos',
      error: error.message
    });
  }
};

// Búsqueda de texto completo
exports.searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro de búsqueda "q" es requerido'
      });
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [products, total] = await Promise.all([
      Product.find({
        $text: { $search: q },
        isDeleted: false
      })
        .populate('category', 'name')
        .select('name description price stock sku isAvailable')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments({
        $text: { $search: q },
        isDeleted: false
      })
    ]);
    
    res.status(200).json({
      success: true,
      data: products,
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
      message: 'Error en la búsqueda',
      error: error.message
    });
  }
};

// Obtener productos con stock bajo
exports.getLowStock = async (req, res) => {
  try {
    const { threshold = 10, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const query = {
      isDeleted: false,
      stock: { $gt: 0, $lt: Number(threshold) }
    };
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort({ stock: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      data: products,
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
      message: 'Error al obtener productos con stock bajo',
      error: error.message
    });
  }
};

// Obtener productos sin stock
exports.getOutOfStock = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const query = {
      isDeleted: false,
      stock: 0
    };
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      data: products,
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
      message: 'Error al obtener productos sin stock',
      error: error.message
    });
  }
};