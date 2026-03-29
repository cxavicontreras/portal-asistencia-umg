const mysql = require("mysql2/promise");

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "biometrico_umg",
    port: Number(process.env.DB_PORT || 3306)
};

let pool;

async function connectDB() {
    try {
        if (pool) return pool;

        pool = mysql.createPool({
            ...config,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("Conexión exitosa a MySQL");
        return pool;
    } catch (error) {
        console.error("Error al conectar a MySQL:", error.message);
        throw error;
    }
}

module.exports = { connectDB };