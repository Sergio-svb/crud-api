const fs = require('fs');

class bookCreater {
  constructor() {
    this.fileContent = "Summary about this book2.";
    this.filePath = "./source/bookSummary.txt";
  }

  writeToFile () {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, this.fileContent, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(`The file ${this.filePath} was succesfully saved!`);
        }
      });
    });
  }
};


module.exports = new bookCreater();