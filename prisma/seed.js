require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function upsertUser({ name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { name, email, password: hashedPassword, role },
  });
}

async function findOrCreateTimeBlock(data) {
  const existing = await prisma.timeBlock.findFirst({ where: data });
  return existing ?? prisma.timeBlock.create({ data });
}

async function findOrCreateAppointment(data) {
  const existing = await prisma.appointment.findFirst({ where: data });
  return existing ?? prisma.appointment.create({ data });
}

async function main() {
  /*   await prisma.appointment.deleteMany();
  await prisma.timeBlock.deleteMany();
  await prisma.user.deleteMany(); */

  // Crear usuarios
  const user1 = await upsertUser({
    name: "Paulo Galarza",
    email: "paulo.galarza@example.com",
    password: "admin123",
    role: "ADMIN",
  });
  const user2 = await upsertUser({
    name: "Julian Galarza",
    email: "julian.galarza@example.com",
    password: "user123",
    role: "USER",
  });
  // Crear bloques de tiempo
  const timeBlock1 = await findOrCreateTimeBlock({
    startTime: new Date("2026-10-26T09:00:00Z"),
    endTime: new Date("2026-10-26T11:00:00Z"),
  });
  const timeBlock2 = await findOrCreateTimeBlock({
    startTime: new Date("2026-10-26T10:00:00Z"),
    endTime: new Date("2026-10-26T11:11:00Z"),
  });
  // Crear citas
  await findOrCreateAppointment({
    date: new Date("2026-10-26T09:00:00Z"),
    userId: user1.id,
    timeBlockId: timeBlock1.id,
  });
  await findOrCreateAppointment({
    date: new Date("2026-10-26T10:00:00Z"),
    userId: user2.id,
    timeBlockId: timeBlock2.id,
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
