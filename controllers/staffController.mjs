import path from 'path';
import multer from 'multer';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Class from '../models/Class.js';
import File from '../models/File.js';
import Complaint from '../models/Complaint.js';

// Get Classes for staff from username
export const getStaffClasses = async (req, res) => {
  const { username } = req.params;

  try {
    // Get user ID from username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get staff ID from user ID
    const staff = await Staff.findOne({ user_id: user._id });
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    // Get classes assigned to the staff member
    const classes = await Class.find({ _id: { $in: staff.class_ids } });

    res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching staff classes:', error);
    res.status(500).json({ error: 'Failed to fetch staff classes' });
  }
};

// Get Staff_id from staff from username
const getStaffIdFromUsername = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const staff = await Staff.findOne({ user_id: user._id });
  if (!staff) {
    throw new Error('Staff not found');
  }
  return staff._id;
};

// Set up Multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, `${basename}-${Date.now()}${ext}`);
    }
  })
});

export const uploadFiles = async (req, res) => {
  console.log("I'm upload");
  // Initialize multer to handle file uploads
  upload.array('files')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Extract username and class_ids from the request body
    const { username, class_ids } = req.body;

    try {
      // Fetch the staff ID based on the username
      const staffId = await getStaffIdFromUsername(username);

      // Parse class_ids
      const parsedClassIds = JSON.parse(class_ids);

      // Insert files into the database
      for (const file of req.files) {
        const filePath = `uploads/${file.filename}`;
        const fileType = path.extname(file.originalname);

        for (const classId of parsedClassIds) {
          const newFile = new File({
            staff_id: staffId,
            class_id: classId,
            file_path: filePath,
            file_type: fileType
          });
          await newFile.save();
        }
      }

      res.status(200).json({ message: 'Files uploaded successfully' });
    } catch (error) {
      console.error('Error during database insert:', error);
      res.status(500).json({ error: 'Failed to upload files' });
    }
  });
};

// To get student classid and studentid 
// API to get student details by username
export const getStudentDetails = async (req, res) => {
  const { username } = req.params;
  console.log(username);
  try {
    // Get user ID from username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get student details from user ID
    const student = await Student.findOne({ user_id: user._id });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ id: student._id, class_id: student.class_id });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
};

// Download Links For Student
export const downloadFiles = async (req, res) => {
  const { studentId } = req.body;
  console.log("I'M IN DOWNLOAD");
  console.log(studentId);
  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    // Fetch class ID for the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const classId = student.class_id;
    console.log(classId);

    // Fetch files for the class
    const files = await File.find({ class_id: classId });

    res.status(200).json({ files });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

// Create complaint by student
export const createComplaint = async (req, res) => {
  const { student_id, category, description } = req.body;

  try {
    const complaint = new Complaint({ student_id, category, description });
    await complaint.save();
    res.json({ id: complaint._id });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
};

// Get All Complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('student_id');
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

// Get complaint for specific 
export const detailCom = async (req, res) => {
  const { student_id } = req.params;
  try {
    const complaints = await Complaint.find({ student_id });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

