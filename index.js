const express = require("express");
const mongoose = require("mongoose");
const parser = require("body-parser");

const User = require("./models/user.js");
const Reminder = require("./models/reminder.js");
const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(parser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/reminder_list", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/user/:userid", (req, res) => {
    User.findById(req.params.userid).then((foundUser) => {
        if (foundUser) {
            foundUser.populate("reminders").execPopulate((err, user) => {
                res.render("data", {userId: user._id, reminders: user.reminders});
            });
        }
        else {
            console.log("error");
            res.redirect("/");
        }
    })
});



app.post("/newuser", (req, res) => {
    let recieveduserDetails = new User();

    recieveduserDetails = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
    }

    User.create(recieveduserDetails).then((newUser) => {
        res.redirect(`/user/${newUser._id}`);
    });
});

app.post("/login", (req, res) => {
    User.findOne({email: req.body.email}).then((foundUser) => {
        if (foundUser.password === req.body.password) {
            console.log("logged in");
            res.redirect(`/user/${foundUser._id}`)
        } else {
            console.log("invalid login");
        }
    }); 
})

app.listen(8080, () => {
    console.log("Server Started");
})




//------------------------------------------------------------------------------------//


//admin 

const Admin = require("./models/admin.js");

// admin route page
app.get("/admin", (req, res) => {
    res.render("admin");
})

app.get("/admin/:adminid", (req, res) => {
    Reminder.find({}).then((foundReminders, err) => {
        if (!err) {
            res.render("admindata", {reminders: foundReminders});
        }
    });
    
})

app.post("/newadmin", (req, res) => {
    let recieveduserDetails = new Admin();

    recieveduserDetails = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
    }

    Admin.create(recieveduserDetails).then((newadmin) => {
        res.redirect(`/admin/${newadmin._id}`);
    });
});

app.post("/adminlogin", (req, res) => {
    Admin.findOne({email: req.body.email}).then((foundadmin) => {
        if (foundadmin.password === req.body.password) {
            console.log("logged in");
            res.redirect("/admin/" + foundadmin._id);
        } else {
            console.log("invalid login");
        }
    });
});

app.post("/:userid/addreminder", (req, res) => {
    User.findById(req.params.userid).then((foundUser, err) => {
        if (foundUser) {
            let newReminder = req.body;
            newReminder.ownership = foundUser._id;
            newReminder.toEmail = foundUser.email;
            Reminder.create(newReminder).then((createdReminder) => {
                foundUser.reminders.push(createdReminder._id);
                foundUser.save();
                console.log(createdReminder, foundUser);
            })
        } else {
            console.log(err);
        }
    })
    res.redirect("back");
})

app.post("/newreminder", (req, res) => {
    console.log(req.body);
});

app.post("/:reminderid/delete", (req, res) => {
    Reminder.findByIdAndDelete(req.params.reminderid).then((deletedReminder, err) => {
        if (err) console.log(err);
        else res.redirect("back");
    })
});

app.get("/getreminders", (req, res) => {
    Reminder.find({}).then((foundReminders) => {
        if (foundReminders) res.send(foundReminders);
        else console.log("err");
    });
});