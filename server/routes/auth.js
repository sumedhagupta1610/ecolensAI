
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const router = express.Router();


// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {

    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: "Please fill in all the fields."
        });
    }

    try {

        const checkQuery = "SELECT * FROM users WHERE email = ?";

        db.query(checkQuery, [email], async (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: "An account already exists with this email."
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `
                INSERT INTO users (full_name, email, password)
                VALUES (?, ?, ?)
            `;

            db.query(
                insertQuery,
                [full_name, email, hashedPassword],
                (err, result) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            message: "Unable to create account."
                        });
                    }

                    const token = jwt.sign(
                        {
                            id: result.insertId,
                            email: email
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "1d" }
                    );

                    return res.status(201).json({
                        message: "Account created successfully.",
                        token: token,
                        user: {
                            id: result.insertId,
                            full_name: full_name,
                            email: email
                        }
                    });

                }
            );

        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error."
        });
    }

});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter email and password."
        });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error."
            });
        }

        // Check if user is registered
        if (results.length === 0) {
            return res.status(404).json({
                message: "User not registered. Please sign up first."
            });
        }

        const user = results[0];

        try {

            // Verify password
            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    message: "Incorrect email or password."
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                message: "Login successful.",
                token: token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Login failed."
            });
        }

    });

});


// =========================
// EXPORT ROUTER
// =========================

module.exports = router;
