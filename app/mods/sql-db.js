const sql = require('sql.js');
const path = require('path');
const fs = require('graceful-fs');

// Global database
let db;
const dbPath = path.join(__dirname, '../data/database.db');
console.log(dbPath);
console.log(fs.existsSync(dbPath));
// Load existing database
// Or create a new one
module.exports.load = () => {
  return new Promise(resolve => {
    // Check if DB exist
    if (fs.existsSync(dbPath)) {
      // Read db from disk
      const filebuffer = fs.readFileSync(dbPath);
      // Load the db
      db = new sql.Database(filebuffer);
      resolve(db);
    } else {
      // Create new db
      db = new sql.Database();
      module.exports.empty();
      // Return db
      resolve(db);
    }
  }).catch(err => {
    console.log('ERROR in loadDB', err);
    return Promise.reject();
  });
};

// Send request to db
// Return the raw result
// DO NOT save the database
module.exports.exec = str => {
  return db.exec(str);
};

// Send a request to db
// Do save the database
module.exports.run = str => {
  db.run(str);
  write();
};

// Insert a new line in the database and save
module.exports.insert = d => {
  let str;
  switch (d.table) {
    case 'mice':
      str = `INSERT INTO ${d.table} VALUES (?,?,?,?,?,?,?,?,?)`;
      db.run(str, [d.id, d.birth, d.death, d.sex, d.father, d.mother, d.genotype, d.validated, d.box]);
      break;
    case 'events':
      str = `INSERT INTO ${d.table} (type, label, desc, mouse, start, end, day) VALUES (?,?,?,?,?,?,?)`;
      db.run(str, [d.type, d.label, d.desc, d.mouse, d.start, d.end, d.day]);
      break;
    default:
  }
  console.log(str, d);
  write();
};

// Update a line in the database and save
module.exports.update = d => {
  const str = `UPDATE ${d.table} SET ${d.set} WHERE ID="${d.id}"`;
  db.run(str);
  console.log(str, d);
  write();
};

module.exports.select = str => {
  // Prepare an sql statement
  // const stmt = db.prepare(str);
  // Bind values to the parameters and fetch the results of the query
  // const result = stmt.getAsObject(data);
  // return result;
  const res = db.exec(str);
  if (res && res[0] && res[0].values) {
    return res[0].values.map(line => {
      const obj = {};
      res[0].columns.forEach((key, i) => {
        obj[key] = line[i];
      });
      return obj;
    });
  }
  return [];
};

module.exports.export = () => {
  return Buffer.from(db.export());
};

module.exports.import = data => {
  const Uints = new Uint8Array(data);
  db = new sql.Database(Uints);
  write();
};

module.exports.empty = () => {
  // Init db
  const sqlstr =
  'DROP TABLE events; ' +
  'DROP TABLE mice; ' +
  'CREATE TABLE IF NOT EXISTS mice (' +
  'ID TEXT PRIMARY KEY NOT NULL,' +
  'birth TEXT,' +
  'death TEXT,' +
  'sex TEXT,' +
  'father TEXT,' +
  'mother TEXT,' +
  'genotype TEXT,' +
  'validated INTEGER,' +
  'box TEXT' +
  '); ' +
  'CREATE TABLE IF NOT EXISTS events (' +
  'ID INTEGER PRIMARY KEY,' +
  'type TEXT,' +
  'label TEXT,' +
  'desc TEXT,' +
  'mouse TEXT,' +
  'start TEXT,' +
  'end TEXT,' +
  'day INTEGER' +
  ');';

  db.run(sqlstr); // Run the query without returning anything

  write();
};

function write() {
  // Write to disk
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}
