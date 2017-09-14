/* global db:true $:true */
const {dialog} = require('electron').remote;
const fs = require('graceful-fs');

module.exports.load = () => {
  // Export on click
  $('#out').click(() => {
    const content = db.export();

    // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
    dialog.showSaveDialog({defaultPath: 'mouse-brick.db', filters: [{name: 'database', extensions: ['db']}]}, fileName => {
      if (fileName === undefined) {
        console.log('File NOT saved');
        return;
      }
      // FileName is a string that contains the path and filename created in the save file dialog.
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
    // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
    /*
    dialog.showOpenDialog([browserWindow, ]options[, callback])

    browserWindow BrowserWindow (optional)
    options Object
        title String
        defaultPath String
        filters Array
        properties Array - Contains which features the dialog should use, can contain openFile, openDirectory, multiSelections and createDirectory
    callback Function (optional)
*/
    dialog.showOpenDialog({filters: [{name: 'database', extensions: ['db']}]}, fileNames => {
      if (fileNames === undefined) {
        console.log('No File selected');
        return;
      }
      console.log(fileNames);
      // FileName is a string that contains the path and filename created in the save file dialog.
      fs.readFile(fileNames[0], (err, data) => {
        if (err) {
          console.log('An error ocurred reading the file ' + err.message);
        }
        db.import(data);
        console.log('file succesfully saved');
      });
    });
  });
};
