-- CreateEnum
CREATE TYPE "public"."FeatureFlagType" AS ENUM ('BOOLEAN', 'STRING', 'NUMBER', 'JSON');

-- CreateEnum
CREATE TYPE "public"."FeatureFlagState" AS ENUM ('DRAFT', 'REVIEW', 'ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."feature_flags" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "type" "public"."FeatureFlagType" NOT NULL DEFAULT 'BOOLEAN',
    "value" JSONB,
    "rules" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feature_flag_scopes" (
    "id" TEXT NOT NULL,
    "flagId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "state" "public"."FeatureFlagState" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flag_scopes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "public"."feature_flags"("key");

-- CreateIndex
CREATE INDEX "feature_flag_scopes_scope_scopeId_idx" ON "public"."feature_flag_scopes"("scope", "scopeId");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flag_scopes_flagId_scope_scopeId_key" ON "public"."feature_flag_scopes"("flagId", "scope", "scopeId");

-- AddForeignKey
ALTER TABLE "public"."feature_flag_scopes" ADD CONSTRAINT "feature_flag_scopes_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "public"."feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
