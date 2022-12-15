-- CreateTable
CREATE TABLE "Requests" (
    "id" TEXT NOT NULL,
    "userName" TEXT,
    "userEmail" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);
