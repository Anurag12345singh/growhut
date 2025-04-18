const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const {v4:uuid4}= require("uuid");

const app = express();
const port = 3000;
app.use(express.json());
const readUsers =()=>{
      const data = fs.readFileSync("users.json","utf8");
      return JSON.parse(data);
      
};

const writeUser = (users) =>{
    fs.writeFileSync("users.json",JSON.stringify(users,null,2));

};

app.post("/register",async(req,res)=>{
      const {username,email,password}=req.body;
      if(!username || !email || !password){
            return res.status(400).json({message:"all filed requre"});
      }
      const emailRegex = `/^[^\s@]+@[^\^s@]+\[^\s@]+$`;
      if(!emailRegex.test(email)){
            return res.status(400).json({message:"invalid email"})
      }
      if(!password.length<6){
            return res.status(400).json({message:"password must be 6 character"})
      }

      const users = readUsers();
      const emailExists = users.some(user=>user.email === email);
      if(emailExists){
            return res.status(409).json({message:"email alerdy registerd"})
      }
      const hashedPassword = await bcrypt.hash(password,10);
      const newUser= {
            id:uuid4(),
            username,
            email,
            password:hashedPassword
      }
      users.push(newUser);
      writeUser(users);

      res.status(201).json({
            message:"user registerd successfully",
            userId:newUser.id
      });

});

app.listen(port,()=>{
      console.log("server is running 3000 port")
})