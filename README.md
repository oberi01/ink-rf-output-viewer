# ink-rf-output-viewer
Interactive terminal viewer for RobotFramework output.xml file 
built with  [Ink](https://github.com).

## Intended use
The scope of this little tool is to provide the user with an overview
of a RobotFramework test result when accessing the output.xml file
e.g. in a ssh session.

It is not meant to duplicate functionality of RobotFramework log.html
and report.html. If those exist and html rendering is available,
those should be used.

## Intended audience
This tool is intended to be used by developers and testers which have
basic knowledge of Robot Framework and npm.

## Features
- **Filtered**: Switch between all and only failed tests (Key `a`).
- **Detail View**: View of Error messages and Keywords in terminal session.
- **Windowing**: Support for large test suites.
- **Navigation**: via Arrow Up/Down keys.

## Installation

1. Clone Repository
   ```bash
   git clone https://github.com/oberi01/ink-rf-output-viewer.git
   cd ink-rf-output-viewer

2. Install Dependencies
   ```bash
   npm install ink react fast-xml-parser
   npm install --save-dev typescript @types/node @types/react

## Run Tool
1. Run TypeScript Compiler (only needed once)
   ```bash
   npx tsc

2. Run Tool
   ```bash
    node dist/index.js 

## Dependencies
- [Node.js](https://nodejs.org)
- npm

## License
This project is licensed under the MIT License.











