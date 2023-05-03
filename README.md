# Open Mina Fuzzing

This project was created to help developers to trace and debug the Mina blockchain. It is a web application written in Angular 15 that uses one or more Mina nodes as backends.

The application is available at [http://1.k8.openmina.com:31308](http://1.k8.openmina.com:31308)

# Table of Contents
[How to run it on your machine](#how-to-run-it-on-your-machine)

## How to run it on your machine

1. **Install Node.js:** First, you need to install Node.js v18 on your computer.
   #### Windows ####
   * For Windows, you can download the Node.js v18 installer from here: https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi and then follow the installation instructions.
   #### Linux ####
   * For Linux, you can use the following commands to install Node.js v18 on Ubuntu:
     1. Update the package manager: `sudo apt update` (for Ubuntu/Debian-based distros)
     2. Install the curl package if it's not already installed: `sudo apt install curl`
     3. Download the Node.js setup script using curl: `curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
     4. Install Node.js using the package manager: `sudo apt-get install -y nodejs=18.*`
     5. Verify that Node.js is installed by checking the version in a terminal: `node -v`
    #### Mac ####
   * For Mac, you can use the following commands to install Node.js v18:
     1. Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
     2. Install Node.js v18: `brew install node@18`
     3. Verify that Node.js is installed by checking the version in a terminal: `node -v`

2. **Install Angular CLI:** Once you have Node.js installed, open a command prompt or terminal window and run the following command to install the Angular CLI:
   `npm install -g @angular/cli@15.0.0`.
   This command will install the version 15 of the Angular CLI globally on your computer.
   To verify that the Angular CLI is installed, run the following command in a terminal: `ng --version`

3. **Clone the project:** Next, clone the Angular project from the Git repository or download the source code as a ZIP file and extract it to a local directory on your computer.

4. **Install project dependencies:** Open a command prompt or terminal window in the project directory and run the following command to install the project dependencies:
   `npm install`.
   This command will install all the required dependencies for the project based on the package.json file.
5. Configure the location of the fuzzing files:
   * Open the `src/environments/environment.ts` file in a text editor.
   * Change the `filesAbsolutePath` value to the location of the fuzzing files on your computer.
   * Save the file.
6. **Serve the project:** Finally, run the following command to serve the project:
   `npm run start`
   This command will start a development server and open the project in your default web browser. You can access the project at http://localhost:4200/.
