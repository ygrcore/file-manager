import readline from "readline";
import FileManager from "./file-manager.js";
import { username } from "./utils/userName.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

console.log(`Welcome to the File Manager, ${username || "Programmer"}!`);
FileManager.printCurrentDirectory();

rl.prompt();

rl.on("line", (line) => {
  const [command, ...args] = line.trim().split(" ");

  switch (command) {
    case "dir":
      FileManager.printCurrentDirectory();
      break;
    case "up":
      FileManager.changeDirectory("..");
      break;
    case "cd":
      const newDir = args[0];
      if (newDir) {
        FileManager.changeDirectory(newDir);
      } else {
        console.log("Invalid input: New directory is not provided.");
      }
      break;
    case "ls":
      FileManager.listFiles();
      break;
    case "cat":
      const fileToRead = args[0];
      if (fileToRead) {
        FileManager.cat(fileToRead);
      } else {
        console.log("Invalid input: Filename not specified");
      }
      break;
    case "add":
      const newFile = args[0];
      if (newFile) {
        FileManager.add(newFile);
      } else {
        console.log("Invalid input: Filename not specified");
      }
      break;
    case "rn":
      const oldFilename = args[0];
      const newFilename = args[1];
      if (oldFilename & newFilename) {
        FileManager.rename(oldFilename, newFilename);
      } else {
        console.log("Invalid input: Missed some arguments");
      }
      break;
    case "cp":
      const fileToCopy = args[0];
      const destinationToCopyFile = args[1];
      if (fileToCopy && destinationToCopyFile) {
        FileManager.copyFileToDirectory(fileToCopy, destinationToCopyFile);
      } else {
        console.log("Invalid input: Missed some arguments or they are incorrect");
      }
      break;
    case "mv":
      const fileToMove = args[0];
      const destinationToMoveFile = args[1];
      if (fileToMove && destinationToMoveFile) {
        FileManager.moveFileToDirectory(fileToMove, destinationToMoveFile);
      } else {
        console.log("Invalid input: Missed some arguments or they are incorrect");
      }
      break;
    case "rm":
      const fileNameToRemove = args[0];
      if (fileNameToRemove) {
        FileManager.deleteFile(fileNameToRemove);
      } else {
        console.log("Invalid input: Missed the file name to remove");
      }
      break;
    case "os":
      const osCommand = args[0];
      if (osCommand === "--EOL") {
        FileManager.getEOL();
      } else if (osCommand === "--cpus") {
        FileManager.getCPUS();
      } else if (osCommand === "--homedir") {
        FileManager.getHomedir();
      } else if (osCommand === "--username") {
        FileManager.getUsername();
      } else if (osCommand === "--architecture") {
        FileManager.getCpuArchitecture();
      } else {
        console.log(
          'Invalid input. Use "os" with some of available flags: "--EOL, --cpus, --homedir, --username, --architecture"'
        );
      }
      break;
    case "hash":
      const fileToHash = args[0];
      if (fileToHash) {
        FileManager.calculateHash(fileToHash);
      } else {
        console.log("Invalid input: Missed the file name to calculate hash");
      }
      break;
    case "compress":
      const filePathToCompress = args[0];
      const fileCompressedDestinationPath = args[1];
      if (filePathToCompress && fileCompressedDestinationPath) {
        FileManager.compressFile(filePathToCompress, fileCompressedDestinationPath);
      } else {
        console.log("Invalid input: Missed some arguments");
      }
      break;
    case "decompress":
      const filePathToDecompress = args[0];
      const fileDecompressedDestinationPath = args[1];
      if (filePathToDecompress && fileDecompressedDestinationPath) {
        FileManager.compressFile(filePathToDecompress, fileDecompressedDestinationPath);
      } else {
        console.log("Invalid input: Missed some arguments");
      }
      break;
    case ".exit":
      console.log(
        `Thank you for using File Manager, ${
          username || "Programmer"
        }, goodbye!`
      );
      process.exit(0);
      break;

    default:
      console.log("Invalid command.");
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log(
    `Thank you for using File Manager, ${username || "Programmer"}, goodbye!`
  );
  process.exit(0);
});
