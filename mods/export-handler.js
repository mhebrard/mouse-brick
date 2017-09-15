/* global db:true $:true */
const {dialog} = require('electron').remote;
const fs = require('graceful-fs');

module.exports.load = () => {
  // Export on click
  $('#out').click(() => {
    const content = db.export();

    dialog.showSaveDialog({defaultPath: 'mouse-brick.db', filters: [{name: 'database', extensions: ['db']}]}, fileName => {
      if (fileName === undefined) {
        console.log('File NOT saved');
        return;
      }
      fs.writeFile(fileName, content, err => {
        if (err) {
          console.log('An error ocurred creating the file ' + err.message);
        }
        console.log('file succesfully saved');
      });
    });
  });

  // Import on click
  $('#in').click(() => {
    dialog.showOpenDialog({filters: [{name: 'database', extensions: ['db']}]}, fileNames => {
      if (fileNames === undefined) {
        console.log('No File selected');
        return;
      }
      fs.readFile(fileNames[0], (err, data) => {
        if (err) {
          console.log('An error ocurred reading the file ' + err.message);
        }
        db.import(data);
        console.log('file succesfully saved');
      });
    });
  });

  // New on click
  $('#new').click(() => {
    db.empty();
  });
};
