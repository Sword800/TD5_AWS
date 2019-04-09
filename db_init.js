var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
    useNullAsDefault: true
});

async function init_dropUsers()
{
   var drop_users = await knex.schema.dropTableIfExists('users');
};


async function init_tableUsers()
{
  
 var create_table = await knex.schema.createTable('users', function (table) {
  table.string('login',255).primary();
  table.string('pass', 255).notNullable();
  table.string('name',255);
  table.string('color1',10);
  table.string('color2',10);
});
   
};

async function info_column()
{
  var info_col = await knex('users').columnInfo();
};

async function ajout()
{
  
   var add_jojo = await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
               [ 'Sword', 'jojo', 'Joran', 'green', 'black' ]);
    
  var add_maxou = await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
               [ 'Maxou', 'max', 'Maxime', 'red', 'yellow' ]);
 
  
};

async function selection()   
{
  var aff = await knex('users');
  console.log(aff);
  
  var destroy = await knex.destroy();
};

async function go() {
  await init_dropUsers()
  await init_tableUsers()
  await ajout()
  await info_column()
  await selection()
}

go()