require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const url = process.env.MONGODB_URI;

mongoose.connect(url, {useNewUrlParser: true});

const loginSchema = new mongoose.Schema({
    email: String,
    password: String,
    uid: Number
});


const Login = mongoose.model('Login', loginSchema);

app.post('/register',(req,res)=>{
    const newUser = new Login({
        email: req.body.email,
        password: req.body.password,
        uid: Math.floor(100000 + Math.random() * 900000)
    });
    Login.findOne({email: req.body.email}, (err, user)=>{
        if(err){
            console.log(err);
        }
        else if(user){
            res.json({
                message: 'User already exists'
            });
        }
        else{
            newUser.save((err, user)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.json({
                        message: 'User created',
                        user: user
                    });
                }
            });
        }
    });
});

app.post('/login',(req,res)=>{
    Login.findOne({email: req.body.email}, (err, user)=>{
        if(err){
            console.log(err);
        }
        else if(!user){
            res.json({
                message: 'User does not exist'
            });
        }
        else{
            if(user.password === req.body.password){
                res.json({
                    message: 'Login successful',
                    email: user.email,
                    uid: user.uid
                });
            }
            else{
                res.json({
                    message: 'Incorrect password'
                });
            }
        }
    });
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server started');
});
                

        

