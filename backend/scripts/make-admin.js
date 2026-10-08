// Uso: node scripts/make-admin.js --email dono@loja.com [--password 123456 --name "Dono"]
// - Se o usuário existe: vira admin.
// - Se não existe: cria com a senha informada (obrigatória nesse caso) já como admin.
// Rode da pasta backend/: node scripts/make-admin.js --email ...
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const prisma = require('../lib/prisma');
const { hashPassword } = require('../utils/password');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

(async () => {
  const email = arg('--email');
  const password = arg('--password');
  const name = arg('--name') || 'Admin';
  if (!email) {
    console.error('Uso: node scripts/make-admin.js --email dono@loja.com [--password 123456 --name "Dono"]');
    process.exit(1);
  }
  let user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    user = await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } });
    console.log(`OK: ${email} agora é admin. Entre pelo login normal do site.`);
  } else {
    if (!password || password.length < 6) {
      console.error('Usuário não existe. Informe --password (mínimo 6 caracteres) para criar.');
      process.exit(1);
    }
    user = await prisma.user.create({
      data: { name, email, passwordHash: await hashPassword(password), role: 'admin' },
    });
    console.log(`OK: admin ${email} criado. Entre pelo login normal do site.`);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e.message); try { await prisma.$disconnect(); } catch {} process.exit(1); });
