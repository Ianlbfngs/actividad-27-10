const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    index: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'El precio debe ser un número válido'
    }
  },
  comparePrice: {
    type: Number,
    min: [0, 'El precio de comparación no puede ser negativo'],
    validate: {
      validator: function(value) {
        return !value || value >= this.price;
      },
      message: 'El precio de comparación debe ser mayor o igual al precio actual'
    }
  },
  sku: {
    type: String,
    required: [true, 'El SKU es requerido'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z0-9-]+$/, 'El SKU solo puede contener letras mayúsculas, números y guiones']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'El stock debe ser un número entero'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida'],
    validate: {
      validator: async function(value) {
        const Category = mongoose.model('Category');
        const category = await Category.findOne({ _id: value, isDeleted: false });
        return !!category;
      },
      message: 'La categoría no existe o está inactiva'
    }
  },
  images: {
    type: [String],
    validate: {
      validator: function(array) {
        return array.every(url => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        });
      },
      message: 'Todas las imágenes deben ser URLs válidas'
    }
  },
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  supplier: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'El nombre del proveedor no puede exceder 100 caracteres']
    },
    contact: {
      type: String,
      trim: true,
      maxlength: [100, 'El contacto del proveedor no puede exceder 100 caracteres']
    }
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para búsquedas optimizadas
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ price: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ isDeleted: 1, isAvailable: 1 });

// Virtual para calcular descuento
productSchema.virtual('discount').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual para estado de stock
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock < 10) return 'low_stock';
  return 'in_stock';
});

// Middleware para actualizar disponibilidad según stock
productSchema.pre('save', function(next) {
  if (this.isModified('stock')) {
    this.isAvailable = this.stock > 0 && this.isAvailable;
  }
  next();
});

// Método estático para búsqueda avanzada con filtros
productSchema.statics.advancedSearch = async function(filters = {}, options = {}) {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    isAvailable,
    supplier,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = { ...filters, ...options };

  const query = { isDeleted: false };

  // Búsqueda por texto
  if (search) {
    query.$text = { $search: search };
  }

  // Filtro por categoría (incluyendo subcategorías)
  if (category) {
    const Category = mongoose.model('Category');
    const categoryDoc = await Category.findById(category);
    if (categoryDoc) {
      const subcategories = await Category.find({ parentCategory: category });
      const categoryIds = [category, ...subcategories.map(c => c._id)];
      query.category = { $in: categoryIds };
    }
  }

  // Filtros de precio
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  // Filtro de stock
  if (inStock === 'true' || inStock === true) {
    query.stock = { $gt: 0 };
  }

  // Filtro de disponibilidad
  if (isAvailable !== undefined) {
    query.isAvailable = isAvailable === 'true' || isAvailable === true;
  }

  // Filtro por proveedor
  if (supplier) {
    query['supplier.name'] = { $regex: supplier, $options: 'i' };
  }

  // Paginación
  const skip = (Number(page) - 1) * Number(limit);
  
  // Ordenamiento
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Ejecutar consulta
  const [products, total] = await Promise.all([
    this.find(query)
      .populate('category', 'name description')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  };
};

// Método estático para soft delete
productSchema.statics.softDelete = async function(id) {
  const product = await this.findById(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  
  product.isDeleted = true;
  product.isAvailable = false;
  await product.save();
  
  return product;
};

// Método para actualizar stock
productSchema.methods.updateStock = async function(quantity, operation = 'add') {
  if (operation === 'add') {
    this.stock += quantity;
  } else if (operation === 'subtract') {
    if (this.stock < quantity) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
  } else if (operation === 'set') {
    this.stock = quantity;
  }
  
  await this.save();
  return this;
};

module.exports = mongoose.model('Product', productSchema);