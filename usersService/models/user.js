const express = require('express');
const path = require('path');
const pino = require('pino');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./usersDB');
// Note: You will need to import your Cost model or a way to calculate totals
// across services for the /api/users/:id endpoint.

const app = express();
app.use(express.json());

const logger = pino();
const PORT = process.env.portUsers || 3001;

// Middleware for logging every request
app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url }, 'HTTP Request received');
    // Log to database logic should be implemented here or via a Pino transport
    next();
});

// POST /api/add - Adding a new user
app.post('/api/add', async (req, res) => {
    const { id, first_name, last_name, birthday } = req.body;
    //creating a new user
    try {
        const newUser = new User({ id, first_name, last_name, birthday });
        await newUser.save();
        //if successfull return a json with the new user details
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ id: 400, message: error.message });
    }
});

// GET /api/users/:id - Get details of a specific user with total costs
app.get('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ id: 404, message: "User not found" });
        }

        // Total calculation logic (needs connection to costs collection)
        const totalCosts = 0; // Placeholder: Sum costs for this userId from costs collection

        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: totalCosts
        });
    } catch (error) {
        res.status(500).json({ id: 500, message: error.message });
    }
});

// GET /api/users - List of users
app.get('/api/users', async (req, res) => {
    try {
        //finds all users in the collection 
        const users = await User.find({}, '-_id -__v');
        res.json(users);
        //if an error happens
    } catch (error) {
        res.status(500).json({ id: 500, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`User Microservice running on port ${PORT}`);
});