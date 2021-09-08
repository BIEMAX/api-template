# Introduction

  Api-Template is a project that have the intention to easily design and create Rest APIs with NodeJs and Express.

  The API documentation is created using Swagger-UI, supporting multiple versions (at the same URL) and some definitions is defined in a configuration file.

  This API is developed to support Oracle, MySQL, SQL and MongoDB database connections.


# Instructions to run

1. Run `npm i` before running the project
2. Run into terminal the command `npm run dev`
3. The project will run in port `3001` by default
4. Copy file `.env.example` into `api-template` as `.env` and define the basic configurations


# Basic structure

The basic structure (by default, you can order by whatever you want):

```
📦src
 ┣ 📂app
 ┃ ┣ 📂v1 - API Version 1
 ┃ ┃ ┣ 📂apidoc - Swagger documentation and configuration for V1 version
 ┃ ┃ ┣ 📂tasks - Tasks endpoints
 ┃ ┃ ┃ ┣ 📂modules - Modules with promises
 ┃ ┃ ┃ ┣ 📂queries - Sequel files (SQL)
 ┃ ┃ ┃ ┣ 📂services - Endpoints with swagger documentation
 ┃ ┃ ┃ ┣ 📂validation - Validations on parameters
 ┃ ┃ ┃ ┗ 📜index.js - Routes/endpoints
 ┃ ┃ ┣ 📂users - Users endpoints
 ┃ ┃ ┗ 📂utilities - Utilities endpoints
 ┃ ┗ 📂v2 - API Version 2
 ┃ ┃ ┣ 📂apidoc
 ┃ ┃ ┣ 📂users
 ┃ ┃ ┗ 📂utilities
 ┣ 📂config
 ┃ ┣ 📂v1
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂v2
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📜i18n.js
 ┃ ┗ 📜index.js
 ┣ 📂docs
 ┃ ┣ 📜knowErrors.md
 ┃ ┣ 📜recommendedLinksToStudy.md
 ┃ ┣ 📜vsCodeFrameworks.md
 ┃ ┗ 📜vsCodeRecommendedExt.md
 ┣ 📂libs - Libraries for common usages
 ┣ 📂locales - Translations for messages and errors
 ┣ 📂routes - Endpoints for API versions (one file for each version)
 ┃ ┣ 📂v1
 ┃ ┃ ┗ 📜index.js 
 ┃ ┗ 📂v2
 ┃ ┃ ┗ 📜index.js
 ┣ 📂schemas - YML Files for schemas
 ┃ ┣ 📂generic
 ┃ ┣ 📂tasks
 ┃ ┗ 📂v1
 ┗ 📜app.js - 
```


# MongoDb commands

1. Run `sudo systemctl start mongod` to start MongoDb
2. Run `sudo systemctl status mongod` to check if the server is running
3. Run `sudo systemctl status mongod` to check version of mongodb

# Visual Studio fast tips

1. Create automatically an issue through TODO comment
  https://code.visualstudio.com/blogs/2020/05/06/github-issues-integration
2. VsCode config `editor.formatOnSave` putting 4 spaces insted 2
  https://stackoverflow.com/questions/36251820/visual-studio-code-format-is-not-using-indent-settings
3. 