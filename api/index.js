const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

salt = bcrypt.genSaltSync(10);
//jwt 
const secret = 'goabsfljafjkbxsvbisboewbdo';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

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

app.post('/login', async(req,res)=>{
    const {username,password} = req.body;
    //grabbing the user
    const userDoc = await User.findOne({username});
    // comparing request password to database
    // passOk(boolean)
    const passOK = bcrypt.compareSync(password,userDoc.password)
    if (passOK)
    {
        //logged in
        jwt.sign({username, id:userDoc._id}, secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
        });
        //res.json()
    }
    else{
        res.status(400).json('wrong credentials');
    }
});
app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token,secret, {}, (err,info)=>{
        if(err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res)=>{
    //sending token as an empty string
    res.cookie('token', '').json('ok');
});

app.post('/post', (req,res)=>{

});

app.listen(4000);
