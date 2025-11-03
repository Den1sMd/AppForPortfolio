import express from "express";
import mariadb from "mariadb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });


console.log("JWT_SECRET =", process.env.JWT_SECRET);


const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Root@0001',
  database: 'appforfun',
  connectionLimit: 10,
  connectTimeout: 10000,

});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token manquant" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
}


app.post("/register", async (req, res) => {
  let conn;
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe requis" });

    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0)
      return res.status(400).json({ error: "Utilisateur déjà existant" });

    const hashed = await bcrypt.hash(password, 10);
    await conn.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashed]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/login", async (req, res) => {
  let conn;
  try {
    const { email, password } = req.body;
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(400).json({ error: "Utilisateur introuvable" });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid)
      return res.status(401).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
    token,
    user: {
      id: rows[0].id,
      email: rows[0].email
    }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/calcul", verifyToken, async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: "userId manquant" });

  let conn;
  

  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE users SET money = money + 10, streak = streak + 1 WHERE id = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

   
    const rows = await conn.query("SELECT money, streak FROM users WHERE id = ?", [userId]);

    res.json({ money: rows[0].money, streak: rows[0].streak });
  }
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
  finally {
    if (conn) conn.release();
  }
})

app.get("/profile", verifyToken, async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: "userId manquant" });

  let conn;

  try {
     conn = await pool.getConnection();
     const rows = await conn.query(
      "SELECT money, streak, email FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({
      money: rows[0].money,
      streak: rows[0].streak,
      email: rows[0].email,
    });

  }
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
  finally {
    if (conn) conn.release();
  }
})

app.get("/endstreak", verifyToken, async (req, res) => {

  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: "userId manquant" });

  let conn;


  try {
    conn = await pool.getConnection();
      await conn.query("UPDATE users SET streak = 0 WHERE id = ?", [userId]);
      const rows = await conn.query("SELECT streak FROM users WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({
      streak: rows[0].streak
    });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
  finally {
    if (conn) conn.release();
  }

})

app.listen(3001, () => console.log("Backend démarré sur http://localhost:3001"));
