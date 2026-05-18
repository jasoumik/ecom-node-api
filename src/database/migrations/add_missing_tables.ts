import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Carts Table
  await knex.schema.createTable('carts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['user_id']);
  });

  // Cart Items Table
  await knex.schema.createTable('cart_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('cart_id').notNullable().references('id').inTable('carts').onDelete('CASCADE');
    table.uuid('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
    table.uuid('variant_id').nullable().references('id').inTable('product_variants').onDelete('CASCADE');
    table.integer('quantity').notNullable().defaultTo(1);
    table.timestamps(true, true);
    table.unique(['cart_id', 'product_id', 'variant_id']);
  });

  // Payments Table
  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.string('method').notNullable();
    table.string('transaction_id').nullable();
    table.string('note').nullable();
    table.uuid('created_by').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Email Templates Table
  await knex.schema.createTable('email_templates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').unique().notNullable();
    table.string('subject').notNullable();
    table.text('body').notNullable();
    table.jsonb('variables').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  // Email Logs Table
  await knex.schema.createTable('email_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('to').notNullable();
    table.string('subject').notNullable();
    table.text('body').notNullable();
    table.string('status').defaultTo('sent');
    table.text('error').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // SMS Templates Table
  await knex.schema.createTable('sms_templates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').unique().notNullable();
    table.text('body').notNullable();
    table.jsonb('variables').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });

  // SMS Logs Table
  await knex.schema.createTable('sms_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('to').notNullable();
    table.text('body').notNullable();
    table.string('status').defaultTo('sent');
    table.text('error').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('sms_logs');
  await knex.schema.dropTableIfExists('sms_templates');
  await knex.schema.dropTableIfExists('email_logs');
  await knex.schema.dropTableIfExists('email_templates');
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('cart_items');
  await knex.schema.dropTableIfExists('carts');
}
