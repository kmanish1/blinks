/*
  Warnings:

  - Added the required column `message` to the `Blink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blink" ADD COLUMN     "message" TEXT NOT NULL;
