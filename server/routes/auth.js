const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// In-memory user store (replace with database in production)
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required",
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        req.user = user;
        next();
    });
};

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Validation
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if user exists
        const existingUser = users.find(
            (u) => u.email === email || u.username === username
        );
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email or username already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: users.length + 1,
            name,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);

        // Generate token
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        // Find user
        const user = users.find((u) => u.username === username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
});

// Get profile
router.get("/profile", authenticateToken, (req, res) => {
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
        success: true,
        data: userWithoutPassword,
    });
});

// Update profile
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const userIndex = users.findIndex((u) => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update fields
        if (name) users[userIndex].name = name;
        if (email) users[userIndex].email = email;

        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json({
            success: true,
            message: "Profile updated successfully",
            data: userWithoutPassword,
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            success: false,
            message: "Profile update failed",
        });
    }
});

// Change password
router.put("/change-password", authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userIndex = users.findIndex((u) => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify current password
        const validPassword = await bcrypt.compare(
            currentPassword,
            users[userIndex].password
        );
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Hash and update new password
        users[userIndex].password = await bcrypt.hash(newPassword, 10);

        res.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Password change error:", error);
        res.status(500).json({
            success: false,
            message: "Password change failed",
        });
    }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
