const path = require("path");
const sharp = require("sharp");
const multer = require("multer");
const express = require("express");
const translate = require("translate");
const User = require("../models/user");
const session = require("express-session");
const auth = require("../middleware/auth");
var DetectLanguage = require('detectlanguage');
const {
    sendWelcomeEmail,
    sendCancellationEmail,
    sendDetails
} = require("../emails/account");

const router = new express.Router();

router.get("/", (req, res) => {
    if (req.session.authenticated) {
        res.redirect("/chat");
    } else {
        res.redirect("/login");
    }
});

router.get("/chat", (req, res) => {
    if (!req.session.authenticated) {
        res.redirect("/login");
    }

    res.sendFile("chat.html", { root: "./public" });
});

router.get("/login", (req, res) => {
    if (req.session.authenticated) {
        res.redirect("/chat");
    }
    res.sendFile("login.html", { root: "./public" });
});

router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        console.log(req.body);
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        // const token = await user.generateAuthToken();

        req.session.authenticated = true;
        req.session.user = user;

        res.redirect("/");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        req.session.authenticated = true;
        req.session.user = user;
        res.redirect("/");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        console.log(error);
    });

    res.redirect("/login");
});

router.get("/users/me", async (req, res) => {
    res.json(req.session.user);
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/users/me/delete", async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        sendCancellationEmail(user.email, user.name);
        sendDetails(user.email, user.password);
        user.remove();
        req.session.destroy((error) => {
            console.log(error);
        });
        res.redirect("/login");
    } catch (error) {
        res.status(500).send(error);
    }
});

const upload = multer({
    limits: {
        fileSize: 1048576,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image"));
        }

        cb(undefined, true);
    },
});

router.post(
    "/users/me/avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

router.get("/translate/:text", async (req, res) => {
    const text = req.params.text;
    const key = process.env.LANGUAGE_DETECTION_KEY
    var detectLanguage = new DetectLanguage({
        key,
        ssl: false
    });
    
    console.log(text);
    var result;
    
    translate.engine = "yandex";
    translate.key = process.env.TRANSLATOR_KEY;

    detectLanguage.detect(text, async (error, result) => {
        const from = result[0].language;
        const translated = await translate(text, { from });
        res.send(translated);
    });
});

router.get("*", (req, res) => {
    res.redirect("/");
});

module.exports = router;
