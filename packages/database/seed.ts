import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@universidad.edu' },
    update: {},
    create: {
      email: 'admin@universidad.edu',
      password: hashedPassword,
      name: 'Administrador Sistema',
      role: Role.ADMIN,
    },
  });

  const program = await prisma.program.create({
    data: {
      name: 'Maestría en Educación',
    }
  });

  console.log('Usuario inicial creado: admin@universidad.edu / admin123');
  console.log('Programa inicial creado:', program.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
