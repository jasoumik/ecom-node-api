import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // age_groups: add slug
  await knex.schema.alterTable('age_groups', (table) => {
    table.string('slug').nullable();
  });
  // Make existing rows have a slug (derived from label) before adding unique constraint
  await knex.raw(`
    UPDATE age_groups SET slug = lower(regexp_replace(trim(label), '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL
  `);
  await knex.schema.alterTable('age_groups', (table) => {
    table.string('slug').notNullable().unique().alter();
  });

  // categories: add slug and mother_category_id
  await knex.schema.alterTable('categories', (table) => {
    table.string('slug').nullable();
    table.uuid('mother_category_id').nullable().references('id').inTable('mother_categories').onDelete('SET NULL');
  });
  await knex.raw(`
    UPDATE categories SET slug = lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL
  `);
  await knex.schema.alterTable('categories', (table) => {
    table.string('slug').notNullable().unique().alter();
  });

  // brands: add slug and mother_category_id
  await knex.schema.alterTable('brands', (table) => {
    table.string('slug').nullable();
    table.uuid('mother_category_id').nullable().references('id').inTable('mother_categories').onDelete('SET NULL');
  });
  await knex.raw(`
    UPDATE brands SET slug = lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL
  `);
  await knex.schema.alterTable('brands', (table) => {
    table.string('slug').notNullable().unique().alter();
  });

  // products: add slug
  await knex.schema.alterTable('products', (table) => {
    table.string('slug').nullable();
  });
  await knex.raw(`
    UPDATE products SET slug = lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL
  `);
  await knex.schema.alterTable('products', (table) => {
    table.string('slug').notNullable().unique().alter();
  });

  // bundles: add slug
  const hasBundleSlug = await knex.schema.hasColumn('bundles', 'slug');
  if (!hasBundleSlug) {
    await knex.schema.alterTable('bundles', (table) => {
      table.string('slug').nullable();
    });
    await knex.raw(`
      UPDATE bundles SET slug = lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'))
      WHERE slug IS NULL
    `);
    await knex.schema.alterTable('bundles', (table) => {
      table.string('slug').notNullable().unique().alter();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('slug');
  });
  await knex.schema.alterTable('brands', (table) => {
    table.dropColumn('slug');
    table.dropColumn('mother_category_id');
  });
  await knex.schema.alterTable('categories', (table) => {
    table.dropColumn('slug');
    table.dropColumn('mother_category_id');
  });
  await knex.schema.alterTable('age_groups', (table) => {
    table.dropColumn('slug');
  });
}
