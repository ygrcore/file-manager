import {createReadStream, createWriteStream, access, constants, readdir, writeFile, rename, unlink} from 'fs';
import os from 'os';
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

  copyFileToDirectory: function (filename, destinationDirectory) {
    const sourcePath = resolve(this.currentDirectory, filename);
    const destinationPath = resolve(destinationDirectory, filename);

    const readStream = createReadStream(sourcePath);
    const writeStream = createWriteStream(destinationPath);

    readStream.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`File ${filename} copied to ${destinationDirectory}`);
    });

    writeStream.on('error', (err) => {
      console.error(`Error copying file: ${err.message}`);
    });
  },

  moveFileToDirectory: function (filename, destinationDirectory) {
    const sourceFilePath = join(this.currentDirectory, filename);
    const destinationFilePath = join(destinationDirectory, filename);

    const readStream = createReadStream(sourceFilePath);
    const writeStream = createWriteStream(destinationFilePath);

    readStream.pipe(writeStream);

    writeStream.on('finish', () => {
      unlink(sourceFilePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
        } else {
          console.log('File moved successfully.');
        }
      });
    });

    writeStream.on('error', (err) => {
      console.error(`Error writing to destination file: ${err.message}`);
    });
  },

  deleteFile: function (filename) {
    const filePathToRemove = join(this.currentDirectory, filename);

    unlink(filePathToRemove, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err.message}`);
      } else {
        console.log('File deleted successfully.');
      }
    });
  },

  getEOL: function () {
    console.log(`The End-Of-Line (EOL) is: ${JSON.stringify(os.EOL)}`);
  },

  getCPUS: function () {
    const cpusInfo = os.cpus();

    console.log('Overall amount of CPUS:', cpusInfo.length);
    cpusInfo.forEach((cpu, index) => {
      console.log(`CPU ${index + 1}:`);
      console.log(`  Model: ${cpu.model}`);
      console.log(`  Clock rate: ${cpu.speed / 1000} GHz`);
    });
  },

};

export default FileManager;
