const fs = require("fs");
const path = require("path");

const dirPath = 'public/img';
const exceptFile = 'example.jpeg';

module.exports = function removeAllFiles() {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    for (const file of files) {
      if (file === exceptFile) continue;
      fs.unlink(path.join(dirPath, file), err => {
        if (err) {
          console.error(err);
        }
      });
    }
  });
};