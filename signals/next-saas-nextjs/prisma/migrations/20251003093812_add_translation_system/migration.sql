-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "public"."signals" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pair" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entry" DOUBLE PRECISION NOT NULL,
    "stop_loss" DOUBLE PRECISION NOT NULL,
    "take_profit" DOUBLE PRECISION NOT NULL,
    "current_price" DOUBLE PRECISION,
    "confidence" INTEGER NOT NULL,
    "market" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "author" TEXT NOT NULL,
    "author_image" TEXT,
    "chart_image" TEXT,
    "published_date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "key_levels" JSONB,
    "analyst_stats" JSONB,
    "colors" JSONB,

    CONSTRAINT "signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."drills" (
    "id" SERIAL NOT NULL,
    "signal_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."translations_dynamic" (
    "id" SERIAL NOT NULL,
    "content_type" TEXT NOT NULL,
    "content_id" TEXT,
    "key" TEXT NOT NULL,
    "en_value" TEXT NOT NULL,
    "ur_value" TEXT,
    "ur_status" TEXT NOT NULL DEFAULT 'pending',
    "ur_updated_by" TEXT,
    "ur_approved_by" TEXT,
    "ur_updated_at" TIMESTAMP(3),
    "ur_approved_at" TIMESTAMP(3),
    "namespace" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_dynamic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."translation_history" (
    "id" SERIAL NOT NULL,
    "translation_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "translation_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "translations_dynamic_key_key" ON "public"."translations_dynamic"("key");

-- CreateIndex
CREATE INDEX "translations_dynamic_key_idx" ON "public"."translations_dynamic"("key");

-- CreateIndex
CREATE INDEX "translations_dynamic_ur_status_idx" ON "public"."translations_dynamic"("ur_status");

-- CreateIndex
CREATE INDEX "translations_dynamic_content_type_idx" ON "public"."translations_dynamic"("content_type");

-- CreateIndex
CREATE INDEX "translations_dynamic_ur_status_ur_value_idx" ON "public"."translations_dynamic"("ur_status", "ur_value");

-- CreateIndex
CREATE INDEX "translation_history_translation_id_idx" ON "public"."translation_history"("translation_id");

-- CreateIndex
CREATE INDEX "translation_history_user_id_idx" ON "public"."translation_history"("user_id");

-- AddForeignKey
ALTER TABLE "public"."drills" ADD CONSTRAINT "drills_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "public"."signals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."translations_dynamic" ADD CONSTRAINT "translations_dynamic_ur_updated_by_fkey" FOREIGN KEY ("ur_updated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."translations_dynamic" ADD CONSTRAINT "translations_dynamic_ur_approved_by_fkey" FOREIGN KEY ("ur_approved_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."translation_history" ADD CONSTRAINT "translation_history_translation_id_fkey" FOREIGN KEY ("translation_id") REFERENCES "public"."translations_dynamic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."translation_history" ADD CONSTRAINT "translation_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
