import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ConstructAnalyzer } from '@cdklabs/cdk-construct-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(join(__dirname, '../public')));

app.get('/api/analyze/:packageName', async (req, res) => {
  try {
    const { packageName } = req.params;
    const analyzer = new ConstructAnalyzer();
    const result = await analyzer.analyzePackage(packageName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to analyze package', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}?package=aws-cdk`);
});
