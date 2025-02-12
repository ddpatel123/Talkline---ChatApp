import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';   
import { connectDB } from './lib/db.js';
import cors from 'cors';
import path from 'path'
import { io, app, server } from './lib/socket.js';

dotenv.config();
// const app = express();    after socket I will import it from socket

// console.log(process.env.PORT);

const PORT = process.env.PORT;

const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

if (process.env.NODE_ENV === 'production') {                                        // this is for deploy
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client',"dist", 'index.html'));
    })
}



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})

