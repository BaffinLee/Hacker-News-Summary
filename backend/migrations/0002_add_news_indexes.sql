-- Add indexes for common news read patterns
CREATE INDEX IF NOT EXISTS "idx_news_createdAt" ON "News" ("createdAt");
CREATE INDEX IF NOT EXISTS "idx_news_summarized_createdAt" ON "News" ("createdAt") WHERE "summary" IS NOT NULL AND "summary" <> '';
CREATE INDEX IF NOT EXISTS "idx_news_unsummarized_createdAt" ON "News" ("createdAt") WHERE "summary" IS NULL;
