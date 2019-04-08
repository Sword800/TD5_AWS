var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
    useNullAsDefault: true
});

async function init()
{

   await knex.schema.dropTableIfExists('users')
      .then(() => {
      knex.schema.createTable('users', (table) => {
        table.string('login',255).primary();
        table.string('pass',255).notNull();
        table.string('name',255);
        table.integer('color1',10).defaultTo(0);
        table.integer('color2',10).defaultTo(0);
        table.string('token');
      })
});
 await knex.destroy();

}


