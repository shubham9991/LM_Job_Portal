const { Job, School, User, Category, Application } = require('../config/database');
const moment = require('moment');
const path = require('path');

const STATIC_FILES_BASE_URL = process.env.STATIC_FILES_BASE_URL;

// @desc    Get public details of a job
// @route   GET /api/jobs/:id
// @access  Public
const getJobDetailsPublic = async (req, res, next) => {
  const { id } = req.params;

  try {
    const job = await Job.findByPk(id, {
      include: [
        {
          model: School,
          attributes: ['id', 'logoUrl', 'bio', 'websiteLink', 'address', 'city', 'state', 'pincode'],
          include: [{ model: User, attributes: ['name'] }]
        },
        { model: Category, as: 'jobType', attributes: ['name'] }
      ]
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const pendingReviews = await Application.count({ where: { jobId: id, status: 'applied' } });

    const schoolAddress = `${job.School.address}, ${job.School.city}, ${job.School.state}, ${job.School.pincode}`;

    const formattedJobDetails = {
      id: job.id,
      title: job.title,
      location: job.location,
      type: job.jobType ? job.jobType.name : null,
      postedDate: moment(job.createdAt).format('Do MMMM YYYY'),
      endDate: moment(job.applicationEndDate).format('Do MMMM YYYY'),
      jobLevel: job.jobLevel || 'N/A',
      salary: job.minSalaryLPA + (job.maxSalaryLPA ? `-${job.maxSalaryLPA}` : '') + ' LPA',
      institution: job.School.User.name,
      overview: job.jobDescription,
      responsibilities: job.keyResponsibilities.split('\n').filter(Boolean),
      education: job.requirements.split('\n').filter(Boolean),
      skills: job.requirements.split('\n').filter(Boolean),
      about: job.School.bio,
      aboutLink: job.School.websiteLink,
      logo: job.School.logoUrl ? `${STATIC_FILES_BASE_URL}/profiles/${path.basename(job.School.logoUrl)}` : null,
      schoolAddress,
      pendingReviews
    };

    res.status(200).json({
      success: true,
      message: 'Job details fetched successfully.',
      data: { job: formattedJobDetails }
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    next(error);
  }
};

module.exports = { getJobDetailsPublic };
