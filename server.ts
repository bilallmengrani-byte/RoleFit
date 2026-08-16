import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { analyzeAndTailorWithGroq } from './server/groqService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// API Endpoints
app.post('/api/analyze-and-tailor', async (req, res) => {
  try {
    const { originalCVRaw, originalCV, jobDescription } = req.body;
    const rawCvText = originalCVRaw || JSON.stringify(originalCV || {});
    const result = await analyzeAndTailorWithGroq(rawCvText, jobDescription || '');
    res.json(result);
  } catch (error: any) {
    console.error('API Error in /api/analyze-and-tailor:', error);
    res.status(500).json({ error: error?.message || 'Server error processing request with Groq' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', provider: 'groq', hasKey: Boolean(process.env.GROQ_API_KEY) });
});

// Serve Vite production build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`RoleFit Server (Powered by Groq) listening on port ${PORT}`);
});
