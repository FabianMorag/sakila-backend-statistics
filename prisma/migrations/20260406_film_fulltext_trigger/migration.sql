-- Ensure film.fulltext is always populated for inserts/updates.
-- Prisma schema cannot declare triggers, so this lives in a SQL migration.

DROP TRIGGER IF EXISTS film_fulltext_trigger ON "film";

CREATE TRIGGER film_fulltext_trigger
BEFORE INSERT OR UPDATE ON "film"
FOR EACH ROW
EXECUTE FUNCTION tsvector_update_trigger(
  'fulltext',
  'pg_catalog.english',
  'title',
  'description'
);

-- Backfill any existing rows that might have been inserted before the trigger existed.
UPDATE "film"
SET "fulltext" = to_tsvector(
  'pg_catalog.english',
  coalesce("title", '') || ' ' || coalesce("description", '')
)
WHERE "fulltext" IS NULL;
