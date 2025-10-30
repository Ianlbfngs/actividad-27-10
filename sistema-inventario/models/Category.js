const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es requerido'],
    unique: true,
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
    validate: {
      validator: function(value) {
        // Evitar auto-referencia
        return !value || value.toString() !== this._id?.toString();
      },
      message: 'Una categoría no puede ser su propia categoría padre'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false // No incluir por defecto en las consultas
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar búsquedas
categorySchema.index({ name: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1, isDeleted: 1 });

// Virtual para obtener subcategorías
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Middleware pre-save para validar categoría padre
categorySchema.pre('save', async function(next) {
  if (this.isModified('parentCategory') && this.parentCategory) {
    const parent = await this.constructor.findById(this.parentCategory);
    if (!parent) {
      throw new Error('La categoría padre no existe');
    }
    if (parent.isDeleted) {
      throw new Error('No se puede asignar una categoría eliminada como padre');
    }
  }
  next();
});

// Método estático para soft delete
categorySchema.statics.softDelete = async function(id) {
  const category = await this.findById(id);
  if (!category) {
    throw new Error('Categoría no encontrada');
  }
  
  // Verificar si tiene subcategorías activas
  const subcategories = await this.find({ 
    parentCategory: id, 
    isDeleted: false 
  });
  
  if (subcategories.length > 0) {
    throw new Error('No se puede eliminar una categoría con subcategorías activas');
  }
  
  // Verificar si tiene productos asociados
  const Product = mongoose.model('Product');
  const products = await Product.find({ category: id, isDeleted: false });
  
  if (products.length > 0) {
    throw new Error('No se puede eliminar una categoría con productos asociados');
  }
  
  category.isDeleted = true;
  category.isActive = false;
  await category.save();
  
  return category;
};

// Método para obtener árbol de categorías
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isDeleted: false }).lean();
  
  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => {
        const parent = cat.parentCategory?.toString();
        return parentId === null ? !parent : parent === parentId;
      })
      .map(cat => ({
        ...cat,
        children: buildTree(cat._id.toString())
      }));
  };
  
  return buildTree();
};

// Método para obtener ruta completa de la categoría
categorySchema.methods.getFullPath = async function() {
  const path = [this.name];
  let current = this;
  
  while (current.parentCategory) {
    current = await this.constructor.findById(current.parentCategory);
    if (current) {
      path.unshift(current.name);
    } else {
      break;
    }
  }
  
  return path.join(' > ');
};

module.exports = mongoose.model('Category', categorySchema);