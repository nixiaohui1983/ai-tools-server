import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
import authRoutes from './routes/auth';
import toolRoutes from './routes/tools';
import taskRoutes from './routes/tasks';
import workflowRoutes from './routes/workflows';
import articleRoutes from './routes/articles';
import userRoutes from './routes/users';
import decisionRoutes from './routes/decision';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tools', toolRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/decision', decisionRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/v1`);
});

export default app;
