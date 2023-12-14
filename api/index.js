const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const app = express();

app.use(cors());
app.use(express.json());

mongoosegoose.connect('mongodb+srv://tyronwei:Tyron2009@mern-blog.dbrumwd.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async(req,res)=>{
    const {username, password} = req.body;
    const userDoc = await User.create({username,password});
    res.json(userDoc);
});

app.listen(4000);
