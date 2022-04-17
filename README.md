# CSE 412 Project 

## ChessDB

This is working node app using the start/board frontend templates. It also includes a working API for the player DB table. 

Uses local postgresql environment, using user postgres, with an env password (so PG_ROOT env variable with postgres user must be used with local postgres db must be set).

### Setting up local project
Once the database dump is finished, set your environment up using:
```bash
psql -d $(local database) -U $(local user) -f chessdb.sql
```

Then update /src/server/db.js to your configuration:
```javascript
const pool = new Pool({
    user: $(local user),
    password: $(local password),
    host: "localhost",
    port: $(local port), // likely 5432
    database: $(local database) 
})
```
