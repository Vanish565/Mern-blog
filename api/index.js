const express = require('express');
const app = express();

app.fetch('/', (req,res)=>{
    res.json('test ok');
});
app.listen(4000);
