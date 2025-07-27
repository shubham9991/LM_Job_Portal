function normalizeCreateJobFields(req, res, next) {
  if (req.body) {
    if (req.body.applicationEndDate && !req.body.application_end_date) {
      req.body.application_end_date = req.body.applicationEndDate;
    }
    if (req.body.salaryMin && !req.body.salary_min) {
      req.body.salary_min = req.body.salaryMin;
    }
    if (req.body.salaryMax && !req.body.salary_max) {
      req.body.salary_max = req.body.salaryMax;
    }
    if (req.body.subjectsToTeach && !req.body.subjects) {
      req.body.subjects = req.body.subjectsToTeach;
    }
    if (req.body.job_level && !req.body.jobLevel) {
      req.body.jobLevel = req.body.job_level;
    }
  }
  next();
}
module.exports = { normalizeCreateJobFields };
