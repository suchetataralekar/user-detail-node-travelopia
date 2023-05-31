const express = require("express");
const cors = require("cors");

const app = express();

// Suppressing cors for port 3000
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Get user by id
app.get("/api/user/:id", async (req, res) => {
    try {
        const ref = db.collection("user_details").doc(req.params.id);
        const userData = await ref.get();
        res.send(userData.data());
    } catch (err) {
        res.send(err);
    }
});

// Create user
app.post("/api/user", async (req, res) => {
    const {
        id = "",
        name = "",
        email = "",
        country = "India",
        travellerCount = 0,
        totalBudget = 0,
    } = req.body;
    try {
        const user = {
            id,
            name,
            email,
            country,
            travellerCount,
            totalBudget,
        };
        const response = await db.collection("user_details").doc(id).set(user);
        res.send(response);
    } catch (err) {
        res.send(err);
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("listening on port", PORT);
});
