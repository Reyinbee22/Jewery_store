const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User Not Found!!,Please SignUp' });
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
      res.status(401).json({ message: 'Invalid password' });
    }

    const payload = {id: user._id}
    const token = jwt.sign(payload,"mysecret", { expiresIn: '1h' });
    res.json({ token, message:"Loggin successfull" }); 
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };