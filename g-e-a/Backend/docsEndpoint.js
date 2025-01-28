const express = require("express");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require("cors");
const docsModel = require('./Models/user');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/gea");

// docs endpoint
app.get('/documents', (req, res) => {
    docsModel.findOne({ Documents: "Offer Letter" })  
        .then(docs => {
            if (docs) {
                // Send back all docs and srcs arrays
                res.json({ docs: docs.Docs1, srcs: docs.sourcePP1 });
            } else {
                res.json({ message: "No documents found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "An error occurred" });
        });
});

