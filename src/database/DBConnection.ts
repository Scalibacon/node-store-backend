import { Connection, createConnection, getConnection } from "typeorm";

class DBConnection {
  static connection: Connection;

  static async create(){
    const env = process.env.NODE_ENV || 'default';
    DBConnection.connection = await createConnection(env);
  }

  static async close(){
    await DBConnection.connection.close(); 
  }
}

export default DBConnection;