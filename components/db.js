const { PrismaClient } = require('@prisma/client');
const dataBase = new PrismaClient();

module.exports = {dataBase}