import "reflect-metadata";
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import "./database/connect";
import router from './routes';

const app = express();
dotenv.config();

app.use( cors() );
app.use( express.json() );
app.use( router );

app.listen(3000, () => console.log('🔥 Server started at http://localhost:3000'));