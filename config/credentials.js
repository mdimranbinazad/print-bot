const csv_parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, '../secret/credentials.csv'), {
  encoding: 'UTF8'
});

const credentials = csv_parse(file,{
  columns: true
});

const password = {};
const printer = {};
for ( let i = 0; i < credentials.length; i++ ) {
  password[credentials[i].username] = credentials[i].password;
  printer[credentials[i].username] = credentials[i].printer;
}

module.exports = {
  password,
  printer
}
