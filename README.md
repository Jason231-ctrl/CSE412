# CSE 412 Project 

This is a working node app using the start/board frontend templates. It also includes a working (although not very helpful) API for the player DB table. 

### Setting up local project
You should be able to read the DB dump into your local environment using:
```bash
psql -d $(local database) -U $(local user) -f chessdb.sql
```

Then update /src/server/db.js to your configuration:
```javascript
const pool = new Pool({
    user: $(local user),
    password: $(local password),
    host: "localhost",
    port: $(local port), // usually 5432
    database: $(local database) 
})
```
