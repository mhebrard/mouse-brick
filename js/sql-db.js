const sql = require('sql.js');
const fs = require('graceful-fs');

// Global database
let db;
const dbPath = 'data/database.db';

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
      // Init db
      let sqlstr = 'CREATE TABLE hello (a int, b char);';
      sqlstr += 'INSERT INTO hello VALUES (0, "hello");';
      sqlstr += 'INSERT INTO hello VALUES (1, "world");';
      db.run(sqlstr); // Run the query without returning anything

      // Write to disk
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);

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
