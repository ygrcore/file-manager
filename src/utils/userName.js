const args = process.argv.slice(2);

const getArgumentValue = (argumentName) => {
  const index = args.findIndex((arg) => arg.startsWith(`--${argumentName}=`));
  return index !== -1 ? args[index].split('=')[1] : null;
};

export const username = getArgumentValue('username');