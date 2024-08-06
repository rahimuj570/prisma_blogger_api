import express from 'express';
import { PORT } from './secret';
import rootRouter from './routes/root';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errorMiddleware';
const app = express();
var cookieParser = require('cookie-parser')


app.use(express.json());
app.use(cookieParser())
app.use('/api',rootRouter);

export const prismaClient = new PrismaClient({
    log:["query"]
});
app.use(errorMiddleware);


app.listen(PORT,()=>{
    console.log(`listen from port: ${PORT}`);
})