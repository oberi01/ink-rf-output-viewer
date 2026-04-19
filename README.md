# ink-rf-output-viewer
Viewer for RobotFramework output.xml file in a terminal session

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

## Requirements
The tool shall
- Display test case names including suite hierarchy
- Display ALL or only FAILED tests
- For a selected Test show Error messages and contained Keywords
- Provide a good UX experience

## Installation

    npm install ink react fast-xml-parser
    npm install --save-dev typescript @types/node @types/react
  
## License
This project is licensed under the MIT License.
