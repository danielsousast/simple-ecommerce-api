import cors from 'cors';

export function setupCors(app: import("express").Express): void {
  const allowedOrigins = ['http://localhost:3000'];
  app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  }));
}