import { createConnection, getConnection } from "typeorm";

const connection = {
  async create(connectionName: string = 'default' ){
    return await createConnection(connectionName);
  },

  async close(){
    await getConnection().close(); 
  }
}

export default connection;