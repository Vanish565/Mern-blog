const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();

salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json());

//connecting to database
mongoose.connect('mongodb+srv://tyronwei:Tyron2009@mern-blog.dbrumwd.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async(req,res)=>{
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password,salt)});
        res.json(userDoc);
    }
    catch(e){
        res.status(400).json(e);
    }
});

app.listen(4000);
