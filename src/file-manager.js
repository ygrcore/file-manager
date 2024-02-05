import {createReadStream, createWriteStream, access, constants, readdir, writeFile, rename, unlink} from 'fs';
import os from 'os';
import {join, resolve} from 'path';
import { createHash } from 'crypto';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

const FileManager = {
  currentDirectory: process.cwd(),

  printCurrentDirectory: function () {
    console.log(`\nYou are currently in ${this.currentDirectory}`);
  },

  changeDirectory: function (newDir) {
    const targetDirectory = resolve(this.currentDirectory, newDir);
    access(targetDirectory, constants.R_OK | constants.X_OK, (err) => {
      if (err) {
        console.error('Operation failed: Invalid directory');
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
        console.error(`Operation failed: ${err.message}`);
      } else {
        files.sort((a, b) => b.isDirectory() - a.isDirectory() || a.name.localeCompare(b.name));
        files.forEach(file => {
          const type = file.isDirectory() ? 'directory' : 'file';
          const fileObject = { Name: file.name, Type: type };
          fileArray.push(fileObject);
        });
        console.log('\n');
        console.table(fileArray, ['Name', 'Type']);
        this.printCurrentDirectory();
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
      this.printCurrentDirectory();
    });

    readStream.on('error', (err) => {
      console.error(`Operation failed: ${err.message}`);
    });
  },

  add: function (filename) {
    const filePath = join(this.currentDirectory, filename);

    writeFile(filePath, '', (err) => {
      if (err) {
        console.error(`Operation failed: ${err.message}`);
      } else {
        console.log(`File ${filename} created successfully.`);
        this.printCurrentDirectory();
      }
    });
  },

  rename: function (oldFilename, newFilename) {
    const oldPath = join(this.currentDirectory, oldFilename);
    const newPath = join(this.currentDirectory, newFilename);

    access(oldPath, constants.F_OK, (err) => {
      if (err) {
        console.error(`Operation failed: File not found ${oldPath}`);
      } else {
        rename(oldPath, newPath, (renameErr) => {
          if (renameErr) {
            console.error(`Operation failed: ${renameErr.message}`);
          } else {
            console.log(`File renamed successfully from ${oldFilename} to ${newFilename}`);
            this.printCurrentDirectory();
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
      this.printCurrentDirectory();
    });

    writeStream.on('error', (err) => {
      console.error(`Operation failed: ${err.message}`);
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
          console.error(`Operation failed: ${err.message}`);
        } else {
          console.log('File moved successfully.');
          this.printCurrentDirectory();
        }
      });
    });

    writeStream.on('error', (err) => {
      console.error(`Operation failed: ${err.message}`);
    });
  },

  deleteFile: function (filename) {
    const filePathToRemove = join(this.currentDirectory, filename);

    unlink(filePathToRemove, (err) => {
      if (err) {
        console.error(`Operation failed: ${err.message}`);
      } else {
        console.log('File deleted successfully.');
        this.printCurrentDirectory();
      }
    });
  },

  getEOL: function () {
    console.log(`The End-Of-Line (EOL) is: ${JSON.stringify(os.EOL)}`);
    this.printCurrentDirectory();
  },

  getCPUS: function () {
    const cpusInfo = os.cpus();

    console.log('Overall amount of CPUS:', cpusInfo.length);
    cpusInfo.forEach((cpu, index) => {
      console.log(`CPU ${index + 1}:`);
      console.log(`  Model: ${cpu.model}`);
      console.log(`  Clock rate: ${cpu.speed / 1000} GHz`);
    });
    this.printCurrentDirectory();
  },

  getHomedir: function () {
    const homeDirectory = os.homedir();
    console.log('Home Directory:', homeDirectory);
    this.printCurrentDirectory();
  },

  getUsername: function () {
    const systemUsername = os.userInfo().username;
    console.log('System Username:', systemUsername);
    this.printCurrentDirectory();
  },
  getCpuArchitecture: function () {
    const cpuArchitecture = os.arch();
    console.log('CPU Architecture:', cpuArchitecture);
    this.printCurrentDirectory();
  },

  calculateHash: function(filePath) {
    const hash = createHash('sha256');
    const stream = createReadStream(filePath);

    stream.on('data', (data) => {
      hash.update(data);
    });

    stream.on('end', () => {
      const fileHash = hash.digest('hex');
      console.log(`${filePath} hash:`, fileHash);
      this.printCurrentDirectory();
    });

    stream.on('error', (error) => {
      console.error(`Operation failed: ${error.message}`);
    });
  },

  compressFile: function(sourcePath, destinationPath) {
    const sourceStream = createReadStream(sourcePath);
    const destinationStream = createWriteStream(destinationPath);
    const compressStream = createBrotliCompress();

    sourceStream.pipe(compressStream).pipe(destinationStream);

    destinationStream.on('finish', () => {
      console.log('File compressed successfully.');
      this.printCurrentDirectory();
    });

    destinationStream.on('error', (error) => {
      console.error(`Operation failed: ${error.message}`);
    });

    sourceStream.on('error', (error) => {
      console.error(`Operation failed: ${error.message}`);
    });
  },

  decompressFile: function(sourcePath, destinationPath) {
    const sourceStream = createReadStream(sourcePath);
    const destinationStream = createWriteStream(destinationPath);
    const decompressStream = createBrotliDecompress();

    sourceStream.pipe(decompressStream).pipe(destinationStream);

    destinationStream.on('finish', () => {
      console.log('File decompressed successfully.');
      this.printCurrentDirectory();
    });

    destinationStream.on('error', (error) => {
      console.error(`Operation failed: ${error.message}`);
    });

    sourceStream.on('error', (error) => {
      console.error(`Operation failed: ${error.message}`);
    });
  },

};

export default FileManager;
