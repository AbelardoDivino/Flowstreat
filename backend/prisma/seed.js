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
    { name: 'Tênis', slug: 'tenis' },
    { name: 'Acessórios', slug: 'acessorios' },
  ];

  const createdCats = {};
  for (const c of categories) {
    const cat = await prisma.category.create({ data: c });
    createdCats[c.slug] = cat;
    console.log(`Categoria: ${cat.name}`);
  }

  const localPics = [
    '/pictures/d.jpeg',
    '/pictures/dsd.jpeg',
    '/pictures/s.jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.05.36.jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.05.44.jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.05.45%20(1).jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.05.45%20(2).jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.05.45.jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.05.46.jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.06.09.jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.06.11%20(1).jpeg',
    '/pictures/WhatsApp%20Image%202026-09-14%20at%2014.06.11%20(2).jpeg',
  ];
  const products = [
    { name: 'Camiseta Básica Branca', slug: 'camiseta-basica-branca', price: 49.9, categorySlug: 'camisetas', description: 'Camiseta 100% algodão' },
    { name: 'Camiseta Oversized Preta', slug: 'camiseta-oversized-preta', price: 79.9, categorySlug: 'camisetas', description: 'Oversized confortável' },
    { name: 'Camiseta Listrada', slug: 'camiseta-listrada', price: 59.9, categorySlug: 'camisetas', description: 'Listras clássicas' },
    { name: 'Calça Jeans Skinny', slug: 'calca-jeans-skinny', price: 129.9, categorySlug: 'calcas', description: 'Jeans skinny' },
    { name: 'Calça Moletom Cinza', slug: 'calca-moletom-cinza', price: 99.9, categorySlug: 'calcas', description: 'Moletom macio' },
    { name: 'Calça Alfaiataria Preta', slug: 'calca-alfaiataria-preta', price: 149.9, categorySlug: 'calcas', description: 'Elegância' },
    { name: 'Vestido Floral Verão', slug: 'vestido-floral-verao', price: 159.9, categorySlug: 'vestidos', description: 'Leve e fresco' },
    { name: 'Vestido Midi Preto', slug: 'vestido-midi-preto', price: 189.9, categorySlug: 'vestidos', description: 'Midi elegante' },
    { name: 'Vestido Longo Boho', slug: 'vestido-longo-boho', price: 199.9, categorySlug: 'vestidos', description: 'Estilo boho' },
    { name: 'Jaqueta Jeans Clara', slug: 'jaqueta-jeans-clara', price: 179.9, categorySlug: 'jaquetas', description: 'Jeans clara' },
    { name: 'Jaqueta Corta Vento', slug: 'jaqueta-corta-vento', price: 159.9, categorySlug: 'jaquetas', description: 'Impermeável' },
    { name: 'Jaqueta Couro Sintético', slug: 'jaqueta-couro-sintetico', price: 249.9, categorySlug: 'jaquetas', description: 'Couco sintético' },
    { name: 'Tênis Street Flow', slug: 'tenis-street-flow', price: 199.9, categorySlug: 'tenis', description: 'Tênis street, amortecimento macio' },
    { name: 'Tênis Runner Preto', slug: 'tenis-runner-preto', price: 229.9, categorySlug: 'tenis', description: 'Runner leve e respirável' },
    { name: 'Tênis Cano Alto', slug: 'tenis-cano-alto', price: 259.9, categorySlug: 'tenis', description: 'Cano alto estiloso' },
    { name: 'Boné FlowStreat', slug: 'bone-flowstreat', price: 59.9, categorySlug: 'acessorios', description: 'Boné ajustável bordado' },
    { name: 'Shoulder Bag', slug: 'shoulder-bag', price: 89.9, categorySlug: 'acessorios', description: 'Bolsa transversal street' },
    { name: 'Meias Pack 3', slug: 'meias-pack-3', price: 39.9, categorySlug: 'acessorios', description: 'Pack 3 meias cano médio' },
  ];

  const sizes = ['P', 'M', 'G', 'GG'];
  const colors = ['Preto', 'Branco', 'Azul', 'Vermelho'];

  for (let idx = 0; idx < products.length; idx++) {
    const p = products[idx];
    const images = [localPics[idx % localPics.length], localPics[(idx + 1) % localPics.length]];
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images,
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
