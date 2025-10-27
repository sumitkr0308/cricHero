const express=require("express");
const cors=require('cors');
const path = require("path");
const db=require('./utils/db');
const cricRoutes=require('./routes/cricRoutes');
const cricController=require("./controllers/cricControllers")

// models
require("./models/cric");

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "view")));


app.use('/api/cricketers',cricRoutes);

db.sync().then(()=>{

    app.listen(4000,()=>{
    console.log("Server is running");
})

}).catch((err)=>{
    console.log(err)
});