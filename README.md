# Rest API for Stock manager using NodeJs and MongoDB
## Requirements
* Node, NPM and MongoDB

## Installation
* Install nodemon: ``` npm install nodemon -g ```

## Start 
* npm install
* nodemon server.js

## Config
* Check /config.app.json
    * PORT
    * HASH Salt
    * Number of records per page
    * JWT secret Key

##Available routes
* Users
    * POST users/register -> Create new user
    * POST users/login -> Obtain a JWT token

* Stock
    * GET /stock -> Get all stock items
    * POST /stock -> Create new stock item
    * PUT /stock/:id -> Update existing stock item
    * DELETE /stock/:id -> Delete existing stock item

 

