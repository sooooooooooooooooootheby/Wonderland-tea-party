import mysql from "mysql";

const db = mysql.createPool({
    host: useRuntimeConfig().databaseHost,
    user: useRuntimeConfig().databaseUser,
    // user: "root",
    password: useRuntimeConfig().databasePassword,
    database: useRuntimeConfig().databaseDatabase,
    charset: useRuntimeConfig().databaseCharset,
});

export default db;
