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
      FileManager.changeDirectory(args[0]);
      break;
    case "ls":
      FileManager.listFiles();
      break;
    case "cat":
      FileManager.cat(args[0]);
      break;
    case "add":
      FileManager.add(args[0]);
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
      console.log('Invalid command.');
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log(
    `Thank you for using File Manager, ${username || "Programmer"}, goodbye!`
  );
  process.exit(0);
});
