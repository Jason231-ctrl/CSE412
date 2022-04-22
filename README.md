# CSE 412 Project 

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
This file will be in .gitignore, meaning you can keep it updated in your environment without worrying about constantly updating after pulls.

## Group Members
- Jason
- Anthony
- Maddie
- Brendan