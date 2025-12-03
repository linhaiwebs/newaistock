import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import stockRoutes from './routes/stock.js';
import diagnosisRoutes from './routes/diagnosis.js';
import trackingRoutes from './routes/tracking.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import redirectRoutes from './routes/redirect.js';
import templateRoutes from './routes/templates.js';
import complianceRoutes from './routes/compliance.js';
import domainRoutes from './routes/domains.js';
import { injectSeoMetadata } from './middleware/seoInjector.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', true);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip}`);
  next();
});

app.use('/api/stock', stockRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/redirect', redirectRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/domains', domainRoutes);

app.use(complianceRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: PORT,
    nodeEnv: process.env.NODE_ENV
  });
});

const staticPath = path.join(__dirname, '..', 'client');
app.use(injectSeoMetadata);
app.use(express.static(staticPath));

app.use((req, res, next) => {
  const complianceFiles = ['/robots.txt', '/ads.txt', '/sitemap.xml', '/security.txt', '/humans.txt', '/.well-known/security.txt'];
  if (!req.path.startsWith('/api') && !req.path.startsWith('/health') && !complianceFiles.includes(req.path)) {
    res.sendFile(path.join(staticPath, 'index.html'));
  } else {
    next();
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Static files: ${staticPath}`);
});
