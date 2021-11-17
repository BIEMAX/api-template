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
 ┃ ┃ ┗ 📜index.js - Documentation about Swagger Tags for API V1
 ┃ ┣ 📂v2
 ┃ ┃ ┗ 📜index.js - Documentation about Swagger Tags for API V2
 ┃ ┣ 📜i18n.js - Configuration for multiple languages supports
 ┃ ┗ 📜index.js - 
 ┣ 📂docs - General documentations
 ┃ ┣ 📜knowErrors.md
 ┃ ┣ 📜recommendedLinksToStudy.md
 ┃ ┣ 📜vsCodeFrameworks.md
 ┃ ┗ 📜vsCodeRecommendedExt.md
 ┣ 📂libs - Libraries for common usages
 ┣ 📂locales - Translations for messages and errors
 ┣ 📂routes - Endpoints for API versions (one file for each version)
 ┃ ┣ 📂v1
 ┃ ┃ ┗ 📜index.js - Version 1
 ┃ ┗ 📂v2
 ┃ ┃ ┗ 📜index.js - Version 1
 ┣ 📂schemas - YML Files for schemas
 ┃ ┣ 📂generic - Generic schemas usable for multiple API versions
 ┃ ┗ 📂v1 - Schemas for V1
 ┗ 📜app.js - 
```


# Create new API Version

To create a new API, you'll need follow the steps bellow:

 1. Create a new folder inside `'src/app/'` with the name what you wanted (we'll called the new folder as `V3` for now)
 2. Inside the new folder created previously (`V3`), create a subfolder called `apidoc` that will contatin the swagger documentation

 > `src/app/v3/apidoc`
 >
 > __Note:__ You can copy the files from existing `apidoc` folder (from a different version)

 3. Create a new folder called `V3` inside the folder `src/routes/` and added a file `index.js` with the content:

 > ```javascript
 > const config = require('../../config/index')
 >
 > /**
 >  * Create api routes for Version 3
 >  * @param {*} app 
 >  */
 > module.exports = (app) => {
 >  if (config.api.showDocumentation == 'true') {
 >    app.use('/v3/api', require('../../app/v3/apidoc')(app))
 >    app.use('/v3', require('../../app/v3/apidoc')(app)) //main route
 >  }
 >
 >  app.use('/v3/users', require('../../app/v3/users')(app))
 >  }
 > ```

 4. After created the file, you need add the following line into `src/app.js` after line 45:

 > ```javascript
 > require('./routes/v3/index')(app)
 > ```

 5. Done! Now, you need just create the new routes and documentation.


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
