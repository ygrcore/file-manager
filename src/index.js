import readline from "readline";
import FileManager from "./file-manager.js";
import { username } from "./utils/userName.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

console.log(`Welcome to the File Manager, ${username || "Programmer"}!`);

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
        console.log('New directory is not provided.')
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
        console.log('Filename not specified');
      }
      break;
    case "add":
      const newFile = args[0];
      if (newFile) {
        FileManager.add(newFile);
      } else {
        console.log('Filename not specified');
      }
      break;
    case "rn":
      const oldFilename = args[0];
      const newFilename = args[1];
      if (oldFilename & newFilename) {
        FileManager.rename(oldFilename, newFilename);
      } else {
        console.log('Miss some arguments')
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
