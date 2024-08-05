import express, { Request, Response } from 'express';
import { PORT } from './secret';
import rootRouter from './routes/root';
const app = express();


app.use('/api',rootRouter);

app.listen(PORT,()=>{
    console.log(`listen from port: ${PORT}`);
})