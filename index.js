const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const user=require('./schema/user')
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')

const app=express();

const salt = bcrypt.genSaltSync(10);
const secret='jhuhebfcueb78687sd7c7s6t76t6';
app.use(cors({credentials:true,origin:'http://localhost:3000'} ));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://abcd:abcd@adminpage.ae8uwbt.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


 //registration
 app.post('/reg', async (req, res) => {
    const { rname, remail, rpassword } = req.body;
    try {
      const existingUser = await user.findOne({ email:remail });
  
      if (existingUser) {
        res.status(400).json('User already exists');
      } else {
        const userDet = await user.create({ name:rname, email:remail, password:bcrypt.hashSync(rpassword,salt) });
        res.json(userDet);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });


  //Login

app.post('/login', async (req, res) => {
    const {lemail, lpassword } = req.body;
    try {
      const userDet = await user.findOne({email: lemail });
  
      if (!userDet) {
        res.status(400).json('User not found');
        return;
      }
  
      const pass = bcrypt.compareSync(lpassword, userDet.password);
  
      if (pass) {
        jwt.sign({name:userDet.name, lemail, id: userDet._id}, secret, {}, (error, token) => {
          if (error) throw error;
  
          // Set the cookie in the response header
          res.cookie('token', token).json({ message: 'Cookie set successfully',id:userDet._id,name:userDet.name});
        });
      } else {
        res.status(400).json('Wrong credentials');
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });

//Logout
  app.post('/logout',(req,res)=>{
    res.cookie('token','').json('Loged Out')
  })
 
  app.listen(8000,()=>{
    console.log("app is listning at 8000")
})
