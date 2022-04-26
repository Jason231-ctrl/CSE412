# CSE 412 Project 

### How to play
Review Chess Manual PDF or go to this link
https://docs.google.com/document/d/1MKUd4j5_wOJFWQdN1WMxHUvzTUGFWVBUT1HuniXgjV4/edit?usp=sharing

Youtube video walkthrough/setup found here (RECOMMENDED):
- https://youtu.be/gBf70OvNwvI -
- skip to 2:31 for the setup -

## About this project
This is a working node app using the start/board frontend templates. It also includes a working (although not very helpful) API for the player DB table. 

### Setting up local project
You should be able to read the DB dump into your local environment using:
```bash
psql -d $(local database) -U $(local user) -f chessdb.sql
```

Then update /dbcreds.js with your database credentials to finish setup:
```javascript
module.exports = {
    user: $(local user),
    password: $(local password),
    host: "localhost",
    port: $(local port),
    database: $(local database)
};
```
(This file will be in .gitignore, meaning you can keep it updated in your environment without worrying about constantly updating after pulls.)

## Running the app
This space should be updated with dependencies once finished, but to run the app, just use:
```bash
node app
```

## Group Members
- Jason
- Anthony
- Maddie
- Brendan
