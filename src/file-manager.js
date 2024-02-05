import {createReadStream, access, constants, readdir, writeFile, rename} from 'fs';
import {join, resolve} from 'path';

const FileManager = {
  currentDirectory: process.cwd(),

  printCurrentDirectory: function () {
    console.log(`You are currently in ${this.currentDirectory}`);
  },

  changeDirectory: function (newDir) {
    const targetDirectory = resolve(this.currentDirectory, newDir);
    access(targetDirectory, constants.R_OK | constants.X_OK, (err) => {
      if (err) {
        console.error('Invalid directory or insufficient permissions.');
      } else {
        this.currentDirectory = targetDirectory;
        this.printCurrentDirectory();
      }
    });
  },

  listFiles: function () {
    const fileArray = [];
    readdir(this.currentDirectory, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${err.message}`);
      } else {
        files.sort((a, b) => b.isDirectory() - a.isDirectory() || a.name.localeCompare(b.name));
        files.forEach(file => {
          const type = file.isDirectory() ? 'directory' : 'file';
          const fileObject = { Name: file.name, Type: type };
          fileArray.push(fileObject);
        });
        console.log('\n');
        console.table(fileArray, ['Name', 'Type']);
      }
    });
  },

  cat: function (filename) {
    const filePath = join(this.currentDirectory, filename);
    const readStream = createReadStream(filePath);

    readStream.on('data', (chunk) => {
      process.stdout.write(chunk);
    });

    readStream.on('end', () => {
      console.log('\nFile read complete.');
    });

    readStream.on('error', (err) => {
      console.error(`Error reading file: ${err.message}`);
    });
  },

  add: function (filename) {
    const filePath = join(this.currentDirectory, filename);

    writeFile(filePath, '', (err) => {
      if (err) {
        console.error(`Error creating file: ${err.message}`);
      } else {
        console.log(`File ${filename} created successfully.`);
      }
    });
  },

  rename: function (oldFilename, newFilename) {
    const oldPath = join(this.currentDirectory, oldFilename);
    const newPath = join(this.currentDirectory, newFilename);

    access(oldPath, constants.F_OK, (err) => {
      if (err) {
        console.error(`File not found: ${oldPath}`);
      } else {
        rename(oldPath, newPath, (renameErr) => {
          if (renameErr) {
            console.error(`Error renaming file: ${renameErr.message}`);
          } else {
            console.log(`File renamed successfully from ${oldFilename} to ${newFilename}`);
          }
        });
      }
    });
  },

};

export default FileManager;
