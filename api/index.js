const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs = require('fs');

salt = bcrypt.genSaltSync(10);
//jwt 
const secret = 'goabsfljafjkbxsvbisboewbdo';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
//uploading all static uploads
app.use('/uploads',express.static(__dirname + '/uploads'));

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

app.post('/post', uploadMiddleware.single('file'), async (req,res)=>{
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const extension = parts[parts.length - 1];
    const newPath = path+'.'+extension;
    fs.renameSync(path, newPath);
    // verifying author
    const {token} = req.cookies;
    jwt.verify(token,secret, {}, async (err,info)=>{
        if(err) throw err;
        //grabbing the content
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
    });    
        res.json(postDoc);   
    });

});

app.get('/post', async (req,res)=>{
    res.json(
        await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20));
});

app.get('/post/:id', async(req,res) =>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
});

app.listen(4000);
