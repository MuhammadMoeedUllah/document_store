-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Books" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "publishersId" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "ISBN" TEXT NOT NULL,
    "Genre" TEXT NOT NULL,
    "PublishDate" TIMESTAMP(3) NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Condition" TEXT NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "bookId" INTEGER NOT NULL,
    "stockUsed" INTEGER NOT NULL,
    "stockAvailable" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "Authors" (
    "authorId" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,

    CONSTRAINT "Authors_pkey" PRIMARY KEY ("authorId")
);

-- CreateTable
CREATE TABLE "Publishers" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Publishers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "orderId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL,
    "Total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "_AuthorsToBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_bookId_key" ON "Inventory"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorsToBooks_AB_unique" ON "_AuthorsToBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorsToBooks_B_index" ON "_AuthorsToBooks"("B");

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_publishersId_fkey" FOREIGN KEY ("publishersId") REFERENCES "Publishers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorsToBooks" ADD CONSTRAINT "_AuthorsToBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Authors"("authorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorsToBooks" ADD CONSTRAINT "_AuthorsToBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
