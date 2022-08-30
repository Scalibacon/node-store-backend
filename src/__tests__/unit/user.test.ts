require('dotenv').config();
import jwt from "jsonwebtoken";
import DBConnection from "../../database/DBConnection";
import Admin from "../../models/Admin";
import User from "../../models/User";
import adminService from "../../services/admin.service";
import userService from "../../services/user.service";
import ErrorMessage from "../../utils/ErrorMessage";

beforeAll(async () => {
  await DBConnection.create();
});

afterAll(async () => {
  await DBConnection.close();
});

describe('testing user service', () => {
  const user = new User();
  user.name = "Testinho Testículo";
  user.email = "teste@teste.com";
  user.password = "teste";

  it('should create a user', async () => {
    const result = await userService.create(user) as User;
    user.password = "teste";

    user.id = result.id;
    expect(result instanceof User).toBeTruthy();
    expect(result).toHaveProperty("id");
    expect(result.name).toEqual(user.name);
  });

  it('should log in and receive a jwt', async () => {
    const { email, password } = user;
    const result = await userService.login(email, password) as string;
    const decodedJwt = jwt.verify(result, process.env.SECRET || 'secret') as User;
    expect(decodedJwt.id).toBe(user.id);
  })

  it('shouldn\'t log in (wrong password)', async () => {
    const { email } = user;
    const result = await userService.login(email, "senhaerrada") as ErrorMessage;
    expect(result instanceof ErrorMessage).toBeTruthy();
  });

  it('shouldn\'t log in (wrong email)', async () => {
    const { password } = user;
    const result = await userService.login("emailerrado@errado.com", password) as ErrorMessage;
    expect(result instanceof ErrorMessage).toBeTruthy();
  });

  it('should find a user by id', async () => {
    const result = await userService.findById(user.id) as User;

    expect(result instanceof User).toBeTruthy();
    expect(result.name).toEqual(user.name);
    expect(result).toHaveProperty('createdAt');
  });

  it('should update a user', async () => {
    const result = await userService.update(user) as User;
    user.name = "Mememeee";

    expect(result instanceof User).toBeTruthy();
    expect(result.name).toEqual(user.name);
  });  
});

describe('testing admin service', () => {
  const superadmin = new Admin();
  superadmin.password = process.env.DEFAULT_USER_PASSWORD || "password";
  superadmin.email = process.env.DEFAULT_USER_EMAIL ?? "email";
  console.log('Showing adm e-mail', process.env.DEFAULT_USER_EMAIL);

  it('should log in with default superadmin and receive a jwt', async () => {
    const { email, password } = superadmin;
    const result = await adminService.login(email, password) as string;
    const decodedJwt = jwt.verify(result, process.env.SECRET || 'secret') as Admin;
    expect(decodedJwt).toHaveProperty("id");
    expect(decodedJwt.role).toBe(7);
  });

  it('shouldn\'t log in as admin (wrong email)', async () => {
    const { password } = superadmin;
    const result = await userService.login("emailerrado@errado.com", password) as ErrorMessage;
    expect(result instanceof ErrorMessage).toBeTruthy();
  });

  it('shouldn\'t log in as admin (wrong password)', async () => {
    const { email } = superadmin;
    const result = await userService.login(email, "senhaerrad@") as ErrorMessage;
    expect(result instanceof ErrorMessage).toBeTruthy();
  });

  it('should create a admin', async () => {
    const newAdmin = new Admin();
    newAdmin.name = "Novo Adm";
    newAdmin.email = "novoadmin@email.com";
    newAdmin.password = "novasenha";
    newAdmin.role = 1;
    newAdmin.isActive = true;
    const result = await adminService.create(newAdmin);

    expect(result instanceof Admin).toBeTruthy();
    expect(result).toHaveProperty('id');
  });
});
