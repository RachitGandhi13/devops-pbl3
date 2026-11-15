const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());                      // secure HTTP headers

const API_KEY = process.env.API_KEY;    // injected from a Kubernetes Secret, never hard-coded

const patients = [
  { id: 1, name: 'Patient A', age: 45, condition: 'Hypertension', phone: '98XXXXXX21' },
  { id: 2, name: 'Patient B', age: 32, condition: 'Diabetes Type 2', phone: '97XXXXXX54' }
];

function requireApiKey(req, res, next) {
  if (!API_KEY || req.get('x-api-key') !== API_KEY) {
    console.log(`[AUDIT] ${new Date().toISOString()} DENIED ${req.method} ${req.path} from ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log(`[AUDIT] ${new Date().toISOString()} ALLOWED ${req.method} ${req.path} from ${req.ip}`);
  next();
}

app.get('/health', (req, res) => res.json({ status: 'UP' }));
app.get('/patients', requireApiKey, (req, res) => res.json(patients));

app.listen(3000, () => console.log('Healthcare API on port 3000'));
