const prisma = require('../lib/prisma');

async function main() {
  console.log('Seeding FlowStreat...');

  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = [
    { name: 'Camisetas', slug: 'camisetas' },
    { name: 'Calças', slug: 'calcas' },
    { name: 'Vestidos', slug: 'vestidos' },
    { name: 'Jaquetas', slug: 'jaquetas' },
  ];

  const createdCats = {};
  for (const c of categories) {
    const cat = await prisma.category.create({ data: c });
    createdCats[c.slug] = cat;
    console.log(`Categoria: ${cat.name}`);
  }

  const products = [
    { name: 'Camiseta Básica Branca', slug: 'camiseta-basica-branca', price: 49.9, categorySlug: 'camisetas', description: 'Camiseta 100% algodão', images: ['https://via.placeholder.com/400'] },
    { name: 'Camiseta Oversized Preta', slug: 'camiseta-oversized-preta', price: 79.9, categorySlug: 'camisetas', description: 'Oversized confortável', images: ['https://via.placeholder.com/400'] },
    { name: 'Camiseta Listrada', slug: 'camiseta-listrada', price: 59.9, categorySlug: 'camisetas', description: 'Listras clássicas', images: ['https://via.placeholder.com/400'] },
    { name: 'Calça Jeans Skinny', slug: 'calca-jeans-skinny', price: 129.9, categorySlug: 'calcas', description: 'Jeans skinny', images: ['https://via.placeholder.com/400'] },
    { name: 'Calça Moletom Cinza', slug: 'calca-moletom-cinza', price: 99.9, categorySlug: 'calcas', description: 'Moletom macio', images: ['https://via.placeholder.com/400'] },
    { name: 'Calça Alfaiataria Preta', slug: 'calca-alfaiataria-preta', price: 149.9, categorySlug: 'calcas', description: 'Elegância', images: ['https://via.placeholder.com/400'] },
    { name: 'Vestido Floral Verão', slug: 'vestido-floral-verao', price: 159.9, categorySlug: 'vestidos', description: 'Leve e fresco', images: ['https://via.placeholder.com/400'] },
    { name: 'Vestido Midi Preto', slug: 'vestido-midi-preto', price: 189.9, categorySlug: 'vestidos', description: 'Midi elegante', images: ['https://via.placeholder.com/400'] },
    { name: 'Vestido Longo Boho', slug: 'vestido-longo-boho', price: 199.9, categorySlug: 'vestidos', description: 'Estilo boho', images: ['https://via.placeholder.com/400'] },
    { name: 'Jaqueta Jeans Clara', slug: 'jaqueta-jeans-clara', price: 179.9, categorySlug: 'jaquetas', description: 'Jeans clara', images: ['https://via.placeholder.com/400'] },
    { name: 'Jaqueta Corta Vento', slug: 'jaqueta-corta-vento', price: 159.9, categorySlug: 'jaquetas', description: 'Impermeável', images: ['https://via.placeholder.com/400'] },
    { name: 'Jaqueta Couro Sintético', slug: 'jaqueta-couro-sintetico', price: 249.9, categorySlug: 'jaquetas', description: 'Couco sintético', images: ['https://via.placeholder.com/400'] },
  ];

  const sizes = ['P', 'M', 'G', 'GG'];
  const colors = ['Preto', 'Branco', 'Azul', 'Vermelho'];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images: p.images,
        categoryId: createdCats[p.categorySlug].id,
      },
    });

    // 2 tamanhos e 2 cores por produto
    for (const size of sizes.slice(0, 2)) {
      for (const color of colors.slice(0, 2)) {
        await prisma.productVariant.create({
          data: {
            size,
            color,
            stock: Math.floor(Math.random() * 20) + 5,
            sku: `${p.slug}-${size}-${color}`.toLowerCase(),
            productId: product.id,
          },
        });
      }
    }
    console.log(`Produto: ${product.name}`);
  }

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
