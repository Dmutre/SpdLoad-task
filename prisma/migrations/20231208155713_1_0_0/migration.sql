-- CreateEnum
CREATE TYPE "State" AS ENUM ('APPROVED', 'PENDING', 'DECLINED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "state" "State" NOT NULL DEFAULT 'PENDING',
    "avatar" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mail_tokens" (
    "value" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mail_tokens_pkey" PRIMARY KEY ("value")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mail_tokens_user_id_key" ON "mail_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "mail_tokens" ADD CONSTRAINT "mail_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
