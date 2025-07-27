const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, initializeDatabase } = require('../server');
const { User, CoreSkill, Category } = require('../config/database');
const { hashPassword } = require('../utils/passwordUtils');

describe('Admin API endpoints', () => {
  let token;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'testsecret';
    await initializeDatabase();
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: await hashPassword('password'),
      role: 'admin'
    });
    token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await CoreSkill.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  test('create and delete core skill', async () => {
    const createRes = await request(app)
      .post('/api/admin/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'SkillTest', subskills: ['A','B'] })
      .expect(201);
    const skillId = createRes.body.data.skill.id;

    await request(app)
      .delete(`/api/admin/skills/${skillId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  test('create and delete category', async () => {
    const createRes = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'CatTest', skills: [] })
      .expect(201);
    const catId = createRes.body.data.category.id;

    await request(app)
      .delete(`/api/admin/categories/${catId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  test('update subskill mark limit', async () => {
    await request(app)
      .patch('/api/admin/settings/subskill-limit')
      .set('Authorization', `Bearer ${token}`)
      .send({ limit: 15 })
      .expect(200);
  });
});
