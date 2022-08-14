require('dotenv').config();
import 'reflect-metadata';
import DBConnection from './database/DBConnection';
DBConnection.create();

import app from './app';
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Server connected on port ${PORT}`));