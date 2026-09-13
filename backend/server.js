const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());


// MySQL Connection
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "xxxx",
    database: process.env.MYSQLDATABASE || "student_management",
    port: process.env.MYSQLPORT || 3306
});


db.connect((err) => {

    if (err) {
        console.log("MySQL connection failed!");
        console.log(err.message);
        return;
    }

    console.log("MySQL connected successfully!");

});


// Test Route
app.get("/", (req, res) => {

    res.send("Student Management System Backend is running!");

});

// GET ALL STUDENTS
app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch students"
            });

        }

        res.json(results);

    });

});

// ADD STUDENT
app.post("/api/students", (req, res) => {

    const {
        name,
        email,
        course,
        marks,
        attendance
    } = req.body;

    const sql = `
        INSERT INTO students
        (name, email, course, marks, attendance)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        email,
        course,
        marks,
        attendance
    ];

    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to add student"
            });

        }

        res.status(201).json({
            message: "Student added successfully!",
            studentId: result.insertId
        });

    });

});

// UPDATE STUDENT
app.put("/api/students/:id", (req, res) => {

    const { id } = req.params;

    const {
        name,
        email,
        course,
        marks,
        attendance
    } = req.body;

    const sql = `
        UPDATE students
        SET name = ?, email = ?, course = ?, marks = ?, attendance = ?
        WHERE id = ?
    `;

    const values = [
        name,
        email,
        course,
        marks,
        attendance,
        id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to update student"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully!"
        });

    });

});

// DELETE STUDENT
app.delete("/api/students/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to delete student"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully!"
        });
    });
});

// ADMIN LOGIN
app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM admins
        WHERE email = ? AND password = ?
    `;

    db.query(sql, [email, password], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Login failed"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful!",
            admin: {
                id: results[0].id,
                email: results[0].email
            }
        });
    });
});

// RESET ADMIN PASSWORD
app.put("/api/reset-password", (req, res) => {

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({
            error: "Email and new password are required"
        });
    }

    const sql = `
        UPDATE admins
        SET password = ?
        WHERE email = ?
    `;

    db.query(sql, [newPassword, email], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to reset password"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Admin email not found"
            });
        }

        res.json({
            message: "Password reset successfully!"
        });
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});