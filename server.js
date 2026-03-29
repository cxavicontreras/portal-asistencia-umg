require("dotenv").config();
const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});

// Ping de prueba
app.get("/ping", (req, res) => {
    res.json({ ok: true });
});

// Login
app.post("/login", async (req, res) => {
    const { usuario, password } = req.body;
    console.log("Datos recibidos:", usuario, password);

    try {
        const pool = await connectDB();

        const [rows] = await pool.execute(`
            SELECT 
                u.id,
                u.username,
                u.password_hash,
                p.nombre,
                p.apellido,
                p.correo
            FROM usuarios u
            INNER JOIN personas p ON u.persona_id = p.id
            WHERE u.username = ?
              AND u.activo = TRUE
              AND p.activo = TRUE
            LIMIT 1
        `, [usuario]);

        console.log("Resultado:", rows);

        if (rows.length === 0) {
            return res.json({
                success: false,
                error: "Usuario o contraseña incorrectos."
            });
        }

        const user = rows[0];

        if (user.password_hash !== password) {
            return res.json({
                success: false,
                error: "Usuario o contraseña incorrectos."
            });
        }

        return res.json({
            success: true,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});