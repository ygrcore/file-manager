# NodeJS: File Manager

Use 20 LTS version of Node.js

The program is started by npm-script start in following way:
```bash
npm run start -- --username=your_username
```
Finish program by `ctrl + c` pressed or user sent `.exit` command into console

List of operations and their syntax:
- Navigation & working directory (nwd)
    - Print in console current Directory
    ```bash
    dir
    ```
    - Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
    ```bash
    up
    ```
    - Go to dedicated folder from current directory (`path_to_directory` can be relative or absolute)
    ```bash
    cd path_to_directory
    ```
    - Print in console list of all files and folders in current directory. List should contain:
        - list should contain files and folder names (for files - with extension)
        - folders and files are sorted in alphabetical order ascending, but list of folders goes first
        - type of directory content should be marked explicitly (e.g. as a corresponding column value)
    ```bash
    ls
    ```

- Basic operations with files
    - Read file and print it's content in console (using Readable stream):
    ```bash
    cat path_to_file
    ```
    - Create empty file in current working directory:
    ```bash
    add new_file_name
    ```
    - Rename file (content remains unchanged):
    ```bash
    rn path_to_file new_filename
    ```
    - Copy file (using Readable and Writable streams):
    ```bash
    cp path_to_file path_to_new_directory
    ```
    - Move file (same as copy but initial file is deleted, copying part using Readable and Writable streams):
    ```bash
    mv path_to_file path_to_new_directory
    ```
    - Delete file:
    ```bash
    rm path_to_file
    ```
- Operating system info (prints following information in console)
    - Get EOL (default system End-Of-Line) and print it to console
    ```bash
    os --EOL
    ```
    - Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
    ```bash
    os --cpus
    ```
    - Get home directory and print it to console
    ```bash
    os --homedir
    ```
    - Get current *system user name* and print it to console
    ```bash
    os --username
    ```
    - Get CPU architecture for which Node.js binary has compiled and print it to console
    ```bash
    os --architecture
    ```
- Hash calculation
    - Calculate hash for file and print it into console
    ```bash
    hash path_to_file
    ```
- Compress and decompress operations
    - Compress file (using Brotli algorithm, using Streams API)
    ```bash
    compress path_to_file path_to_destination
    ```
    - Decompress file (using Brotli algorithm, using Streams API)
    ```bash
    decompress path_to_file path_to_destination
    ```