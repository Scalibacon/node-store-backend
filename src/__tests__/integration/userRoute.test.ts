require('dotenv').config();
import request from 'supertest';
import app from '../../app';
import DBConnection from '../../database/DBConnection';
import Admin from '../../models/Admin';
import User from '../../models/User';

beforeAll(async () => {
  await DBConnection.create();
});

afterAll(async () => {
  await DBConnection.close();
});

describe('user route test', () => {
  const user = new User();
  user.name = "Testinho Testículo";
  user.email = "teste@teste.com";
  user.password = "teste";

  it('should create a user', async () => {
    const result = await request(app)
      .post('/user')
      .send(user)
      .expect(201);

    expect(result.body).toHaveProperty("id");
    expect(result.body.name).toEqual(user.name);
    expect(result.body.password).not.toBe(user.password);
  });

  it('should log in and receive a jwt', async () => {
    const result = await request(app)
      .post('/user/login')
      .send({ email: user.email, password: user.password })
      .expect(201);

    expect(typeof result.body === "string").toBeTruthy();
  });

  it('shouldn\'t log in (invalid email)', async () => {
    const result = await request(app)
      .post('/user/login')
      .send({ email: "emailmeme", password: user.password })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t log in (invalid password)', async () => {
    const result = await request(app)
      .post('/user/login')
      .send({ email: user.email, password: "" })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t log in (injection password)', async () => {
    const result = await request(app)
      .post('/user/login')
      .send({ email: user.email, password: "') OR 0 = 0; --" })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t log in (wrong email)', async () => {
    const result = await request(app)
      .post('/user/login')
      .send({ email: "emailmeme@meme.com", password: user.password })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t log in (wrong password)', async () => {
    const result = await request(app)
      .post('/user/login')
      .send({ email: user.email, password: "senhaerrada" })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });
});

describe('admin route test', () => {
  const admin = new Admin();
  admin.email = process.env.DEFAULT_USER_EMAIL || 'email';
  admin.password = process.env.DEFAULT_USER_PASSWORD || 'password';

  it('should log in and receive a jwt', async () => {
    const result = await request(app)
      .post('/admin/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);

    expect(typeof result.body === "string").toBeTruthy();
  });

  it('shouldn\'t log in (invalid email)', async () => {
    const result = await request(app)
      .post('/user/login')
      .send({ email: "emailmeme", password: admin.password })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t log in (invalid password)', async () => {
    const result = await request(app)
      .post('/admin/login')
      .send({ email: admin.email, password: "" })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t log in (injection password)', async () => {
    const result = await request(app)
      .post('/admin/login')
      .send({ email: admin.email, password: "') OR 0 = 0; --" })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t log in (wrong email)', async () => {
    const result = await request(app)
      .post('/admin/login')
      .send({ email: "emailmeme@meme.com", password: admin.password })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t log in (wrong password)', async () => {
    const result = await request(app)
      .post('/admin/login')
      .send({ email: admin.email, password: "senhaerrada" })
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });
});