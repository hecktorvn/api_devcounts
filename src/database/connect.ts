import { createConnection } from "typeorm";

createConnection().then(() => console.log('📦 Seccessfully connected with database'));