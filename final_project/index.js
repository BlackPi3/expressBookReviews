const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const JWT_SECRET = "SECRET_STAMP";

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if (!err) {
                req.username = payload.username; // Attach the username to the request object
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
