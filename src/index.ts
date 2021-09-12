import 'reflect-metadata';
import connection from './database/connection';
connection.create();

import app from './app';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server connected on port ${PORT}`));