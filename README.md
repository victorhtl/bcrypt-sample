## Run

- Run `git clone git@github.com:victorhtl/bcrypt-sample.git`
- Inside the cloned directory, run `npm i`
- Create a config.js file with your database credentials like the model bellow

```
export const Config = {
    user: 'username',
    database: 'databasename',
    password: 'yourpassword',
    host: 'localhost',
    port: 5432
}
```
- Run `npm start`