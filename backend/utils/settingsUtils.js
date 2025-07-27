// backend/utils/settingsUtils.js
// Helper functions to get and set application settings
const { Setting } = require('../config/database');

const DEFAULT_SUBSKILL_MARK_LIMIT = 10;

async function getSubSkillMarkLimit() {
  const setting = await Setting.findByPk('subSkillMarkLimit');
  return setting ? parseInt(setting.value, 10) : DEFAULT_SUBSKILL_MARK_LIMIT;
}

async function setSubSkillMarkLimit(limit) {
  await Setting.upsert({ key: 'subSkillMarkLimit', value: String(limit) });
}

// Default email templates
const DEFAULT_TEMPLATES = {
  welcome_student: {
    subject: 'Your Student Account Details',
    body: `<h1>Welcome to Levelminds!</h1>
      <p>A student profile has been created for you by the admin.</p>
      <p>Your login details are:</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Temporary Password:</strong> {{password}}</p>
      <p>Please log in <a href="{{loginLink}}">here</a> and complete your profile.</p>
      <p>For security, please change your password after logging in.</p>`
  },
  welcome_school: {
    subject: 'Your School Account Details',
    body: `<h1>Welcome to Levelminds!</h1>
      <p>A school profile has been created for your institution by the admin.</p>
      <p>Your login details are:</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Temporary Password:</strong> {{password}}</p>
      <p>Please log in <a href="{{loginLink}}">here</a> and complete your school's profile.</p>
      <p>For security, please change your password after logging in.</p>`
  },
  admin_password_reset: {
    subject: 'Your Password Has Been Changed by an Administrator',
    body: `<h1>Password Change Notification</h1>
      <p>Dear {{name}},</p>
      <p>Your password for the Levelminds platform has been reset by an administrator.</p>
      <p>Your new password is: <strong>{{password}}</strong></p>
      <p>For security reasons, we recommend logging in and changing this temporary password immediately.</p>
      <p>If you did not request this change or have any concerns, please contact support.</p>
      <p>Thank you,</p>
      <p>The Levelminds Team</p>`
  }
};

async function getEmailTemplate(key) {
  const subjectSetting = await Setting.findByPk(`email:${key}:subject`);
  const bodySetting = await Setting.findByPk(`email:${key}:body`);
  const defaults = DEFAULT_TEMPLATES[key] || { subject: '', body: '' };
  return {
    subject: subjectSetting ? subjectSetting.value : defaults.subject,
    body: bodySetting ? bodySetting.value : defaults.body
  };
}

async function setEmailTemplate(key, subject, body) {
  await Setting.upsert({ key: `email:${key}:subject`, value: subject });
  await Setting.upsert({ key: `email:${key}:body`, value: body });
}

function renderTemplate(template, data) {
  return template.replace(/{{(\w+)}}/g, (_, k) => data[k] || '');
}

module.exports = {
  getSubSkillMarkLimit,
  setSubSkillMarkLimit,
  DEFAULT_SUBSKILL_MARK_LIMIT,
  getEmailTemplate,
  setEmailTemplate,
  renderTemplate,
  DEFAULT_TEMPLATES
};
