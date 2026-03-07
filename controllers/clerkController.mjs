import User from '../models/User.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Class from '../models/Class.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

export const signUp = [upload.single('logo'), async (req, res) => {
  let { username, password, role } = req.body;
  
  // Map roles to valid database enum values
  if (role === 'seeker') role = 'student';
  if (role === 'provider') role = 'staff';

  try {
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ id: user._id, username, role });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
}];

export const logIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      res.status(200).json({ id: user._id, username: user.username, role: user.role, image: user.image });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('User login failed:', error);
    res.status(500).json({ error: 'User login failed' });
  }
};

export const getUser = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

// Function to create a new class
export const createClass = async (req, res) => {
  const { name } = req.body;
  try {
    const newClass = new Class({ name });
    await newClass.save();
    res.status(201).json({ id: newClass._id, name });
  } catch (error) {
    console.error('Error inserting class:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

// Function to get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// Function to create a new student
export const createStudent = async (req, res) => {
  const { username, password, fullname, mobile_number, address, class_id } = req.body;
  
  // Validate inputs
  if (!username || !password || !fullname || !mobile_number || !address || !class_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Validate mobile_number length (reg no.)
  if (mobile_number.length > 20) {
    return res.status(400).json({ error: 'Registration number must be 20 characters or less' });
  }
  
  // Validate password length
  if (password.length > 8) {
    return res.status(400).json({ error: 'Password must be 8 characters or less' });
  }
  
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Check if class exists
    const classExists = await Class.findById(class_id);
    if (!classExists) {
      return res.status(400).json({ error: 'Invalid class selected' });
    }
    
    // Create user first
    const user = new User({ username, password, role: 'student' });
    await user.save();

    // Create student with user_id
    const student = new Student({
      user_id: user._id,
      fullname,
      mobile_number,
      address,
      class_id
    });
    await student.save();
    
    res.status(201).json({ id: student._id, username, fullname, mobile_number, address, class_id });
  } catch (error) {
    console.error('Error inserting student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// Create Staff
export const createStaff = async (req, res) => {
  const { username, password, fullname, mobile_number, address, class_ids } = req.body;

  // Validate the inputs
  if (!username || !password || !fullname || !mobile_number || !address || !Array.isArray(class_ids)) {
    return res.status(400).json({ error: 'All fields are required and class_ids must be an array' });
  }

  try {
    // Create user first
    const user = new User({ username, password, role: 'staff' });
    await user.save();

    // Create staff with user_id
    const staff = new Staff({
      user_id: user._id,
      fullname,
      mobile_number,
      address,
      class_ids
    });
    await staff.save();

    res.status(201).json({ id: staff._id, username, fullname, mobile_number, address, class_ids });
  } catch (error) {
    console.error('Error inserting staff:', error);
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

// Get the student ID
export const getStudentId = async (req, res) => {
  const { username } = req.body;

  try {
    // Query to get the student ID based on the username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const student = await Student.findOne({ user_id: user._id });
    if (student) {
      res.status(200).json({ studentId: student._id });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    console.error('Error fetching student ID:', error);
    res.status(500).json({ error: 'Failed to fetch student ID' });
  }
};

