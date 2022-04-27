const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let user = {
    email: "ahmedshaharin7589@gmail.com",
    id: "sarpaine",
    password: "oldpass",
};

const JWT_SECRET = "boom shaka laka boom";

app.get("/", (req, res) => {
    res.send("hello world!");
});

app.get("/forget-password", (req, res) => {
    res.render("forget_password");
});
app.post("/forget-password", (req, res) => {
    const { email } = req.body;
    if (email != user.email) {
        res.send("user not found!");
        return;
    }
    const secret = JWT_SECRET + user.password;
    const payload = {
        email: user.email,
        id: user.id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "10s" });
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`;
    console.log(link);

    //send password reset email link
    res.send("Password reset link has been sent to your email");
});
app.get("/reset-password/:id/:token", (req, res) => {
    const { id, token } = req.params;

    //check if id exists in database
    if (id != user.id) {
        res.send("invalid id");
        return;
    }

    //we have a valid id and a valid user with this id
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        res.render("reset_password", { emai: user.email });
    } catch (err) {
        res.send(err.message);
    }
    res.send(req.params);
    // res.render("reset_password");
});
app.post("/reset-password/:id/:token", (req, res) => {
    const { id, token } = req.params;
    const { newpassword, newpassword2 } = req.body;

    //check if id exists in database
    if (id != user.id) {
        res.send("invalid id");
        return;
    }

    //we have a valid id and a valid user with this id
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);

        //validate newpassword and newpassword2 should match
        //we can simply find the user with the payload email and id and simplye update the password
        user.password = newpassword;
        res.send(user);
    } catch (err) {
        res.send(err.message);
    }
});

app.listen(3000, () => {
    console.log("server started on port 3000!");
});
