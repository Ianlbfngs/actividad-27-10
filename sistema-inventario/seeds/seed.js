const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario');
    console.log('MongoDB conectado para seeding');
  } catch (error) {
    console.error('Error de conexión:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Limpiar colecciones
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Colecciones limpiadas');

    // Crear categorías principales
    const electronics = await Category.create({
      name: 'Electrónica',
      description: 'Productos electrónicos y tecnología'
    });

    const clothing = await Category.create({
      name: 'Ropa',
      description: 'Prendas de vestir y accesorios'
    });

    const home = await Category.create({
      name: 'Hogar',
      description: 'Artículos para el hogar'
    });

    // Crear subcategorías
    const smartphones = await Category.create({
      name: 'Smartphones',
      description: 'Teléfonos inteligentes',
      parentCategory: electronics._id
    });

    const laptops = await Category.create({
      name: 'Laptops',
      description: 'Computadoras portátiles',
      parentCategory: electronics._id
    });

    const menClothing = await Category.create({
      name: 'Ropa Hombre',
      description: 'Ropa para hombres',
      parentCategory: clothing._id
    });

    const womenClothing = await Category.create({
      name: 'Ropa Mujer',
      description: 'Ropa para mujeres',
      parentCategory: clothing._id
    });

    const furniture = await Category.create({
      name: 'Muebles',
      description: 'Muebles para el hogar',
      parentCategory: home._id
    });

    console.log('Categorías creadas');

    // Crear productos
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Smartphone Apple con chip A17 Pro, cámara de 48MP y diseño de titanio',
        price: 999.99,
        comparePrice: 1199.99,
        sku: 'IPHONE-15-PRO-256',
        stock: 50,
        category: smartphones._id,
        images: [
          'https://example.com/iphone15-1.jpg',
          'https://example.com/iphone15-2.jpg'
        ],
        specifications: new Map([
          ['Almacenamiento', '256GB'],
          ['Color', 'Titanio Natural'],
          ['Pantalla', '6.1 pulgadas']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Apple Inc.',
          contact: 'supplier@apple.com'
        }
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Smartphone Samsung con Snapdragon 8 Gen 3, pantalla AMOLED 6.2"',
        price: 849.99,
        comparePrice: 999.99,
        sku: 'SAMSUNG-S24-256',
        stock: 75,
        category: smartphones._id,
        images: ['https://example.com/samsung-s24.jpg'],
        specifications: new Map([
          ['Almacenamiento', '256GB'],
          ['RAM', '8GB'],
          ['Color', 'Negro']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Samsung Electronics',
          contact: 'supplier@samsung.com'
        }
      },
      {
        name: 'MacBook Pro 14"',
        description: 'Laptop profesional con chip M3 Pro, 18GB RAM y 512GB SSD',
        price: 1999.99,
        comparePrice: 2299.99,
        sku: 'MBP-14-M3PRO-512',
        stock: 30,
        category: laptops._id,
        images: ['https://example.com/macbook-pro-14.jpg'],
        specifications: new Map([
          ['Procesador', 'M3 Pro'],
          ['RAM', '18GB'],
          ['Almacenamiento', '512GB SSD'],
          ['Pantalla', '14.2" Liquid Retina XDR']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Apple Inc.',
          contact: 'supplier@apple.com'
        }
      },
      {
        name: 'Dell XPS 15',
        description: 'Laptop de alto rendimiento con Intel Core i7, 16GB RAM',
        price: 1499.99,
        sku: 'DELL-XPS15-I7-16',
        stock: 8,
        category: laptops._id,
        images: ['https://example.com/dell-xps15.jpg'],
        specifications: new Map([
          ['Procesador', 'Intel Core i7-13700H'],
          ['RAM', '16GB DDR5'],
          ['Almacenamiento', '512GB SSD'],
          ['GPU', 'NVIDIA RTX 4050']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Dell Technologies',
          contact: 'supplier@dell.com'
        }
      },
      {
        name: 'Camisa Casual Hombre',
        description: 'Camisa de algodón 100% para uso casual',
        price: 39.99,
        comparePrice: 59.99,
        sku: 'SHIRT-MEN-CASUAL-L',
        stock: 120,
        category: menClothing._id,
        images: ['https://example.com/shirt-casual.jpg'],
        specifications: new Map([
          ['Talla', 'L'],
          ['Material', '100% Algodón'],
          ['Color', 'Azul Claro']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Fashion Group',
          contact: 'supplier@fashion.com'
        }
      },
      {
        name: 'Vestido Elegante Mujer',
        description: 'Vestido elegante ideal para eventos formales',
        price: 89.99,
        comparePrice: 129.99,
        sku: 'DRESS-WOMEN-ELEGANT-M',
        stock: 45,
        category: womenClothing._id,
        images: ['https://example.com/dress-elegant.jpg'],
        specifications: new Map([
          ['Talla', 'M'],
          ['Material', 'Poliéster y Elastano'],
          ['Color', 'Negro']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Fashion Group',
          contact: 'supplier@fashion.com'
        }
      },
      {
        name: 'Sofá 3 Plazas',
        description: 'Sofá cómodo de 3 plazas con estructura de madera',
        price: 699.99,
        sku: 'SOFA-3SEAT-GRAY',
        stock: 15,
        category: furniture._id,
        images: ['https://example.com/sofa-3seat.jpg'],
        specifications: new Map([
          ['Dimensiones', '220x90x85 cm'],
          ['Material', 'Tela y Madera'],
          ['Color', 'Gris']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Home Furniture Co.',
          contact: 'supplier@homefurniture.com'
        }
      },
      {
        name: 'Mesa de Comedor',
        description: 'Mesa de comedor para 6 personas, madera maciza',
        price: 449.99,
        sku: 'TABLE-DINING-6P-WOOD',
        stock: 20,
        category: furniture._id,
        images: ['https://example.com/dining-table.jpg'],
        specifications: new Map([
          ['Dimensiones', '180x90x75 cm'],
          ['Material', 'Madera de Roble'],
          ['Capacidad', '6 personas']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Home Furniture Co.',
          contact: 'supplier@homefurniture.com'
        }
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'Smartphone con Google Tensor G3 y cámara AI avanzada',
        price: 899.99,
        sku: 'PIXEL-8PRO-256',
        stock: 0,
        category: smartphones._id,
        images: ['https://example.com/pixel-8pro.jpg'],
        specifications: new Map([
          ['Almacenamiento', '256GB'],
          ['RAM', '12GB'],
          ['Color', 'Bay Blue']
        ]),
        isAvailable: false,
        supplier: {
          name: 'Google LLC',
          contact: 'supplier@google.com'
        }
      },
      {
        name: 'Pantalón Jeans Hombre',
        description: 'Jeans de mezclilla estilo slim fit',
        price: 59.99,
        sku: 'JEANS-MEN-SLIM-32',
        stock: 3,
        category: menClothing._id,
        images: ['https://example.com/jeans-slim.jpg'],
        specifications: new Map([
          ['Talla', '32'],
          ['Corte', 'Slim Fit'],
          ['Color', 'Azul Oscuro']
        ]),
        isAvailable: true,
        supplier: {
          name: 'Fashion Group',
          contact: 'supplier@fashion.com'
        }
      }
    ];

    await Product.insertMany(products);
    console.log('Productos creados');

    console.log('\n✅ Seed completado exitosamente!');
    console.log(`📦 ${products.length} productos creados`);
    console.log(`📁 8 categorías creadas (3 principales + 5 subcategorías)`);

  } catch (error) {
    console.error('Error durante el seeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
    process.exit(0);
  }
};

// Ejecutar seed
connectDB().then(() => seedData());