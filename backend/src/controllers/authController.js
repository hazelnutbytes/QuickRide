const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Driver = require("../models/Driver");
const { auth } = require("../config/firebase");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            role,
            vehicle,
            vehicleNumber,
            licenseNumber
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const firebaseUser =
            await auth.createUser({
                email,
                password,
                displayName: name
            });

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || "rider",
            firebaseUid: firebaseUser.uid
        });

        if (user.role === "driver") {
            if (
                !vehicle ||
                !vehicleNumber ||
                !licenseNumber
            ) {
                await User.findByIdAndDelete(user._id);

                return res.status(400).json({
                    message:
                        "Vehicle, vehicle number and license number are required for drivers"
                });
            }

            await Driver.create({
                user: user._id,
                vehicle,
                vehicleNumber,
                licenseNumber
            });
        }

        const token = generateToken(user);

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};