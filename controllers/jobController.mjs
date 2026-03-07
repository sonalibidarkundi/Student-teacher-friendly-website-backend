import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

export const addJob = async (req, res) => {
  const { title, description, skills, username } = req.body;

  try {
    const job = new Job({ title, description, skills, username });
    await job.save();
    res.status(201).json({ id: job._id, title, description, skills, username });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Failed to add job' });
  }
};

export const addCompany = async (req, res) => {
  const { name, username } = req.body;

  try {
    const company = new Company({
      name,
      logo: '/uploads/default-logo.png',
      username
    });
    await company.save();
    res.status(201).json({ id: company._id, name, username });
  } catch (error) {
    console.error('Error adding company:', error);
    res.status(500).json({ error: 'Failed to add company' });
  }
};

export const getApplicationsByUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const jobs = await Job.find({ username });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } }).populate('jobId');

    if (applications.length > 0) {
      const result = applications.map(app => ({
        username: app.username,
        title: app.jobId.title,
        description: app.jobId.description
      }));
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'No applications found' });
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

