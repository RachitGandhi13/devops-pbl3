const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || 'v1';
const COLOR = process.env.APP_COLOR || 'none';

app.get('/', (req, res) => res.send(`Hello from Rachit Exp7 demo | version ${VERSION} | color ${COLOR}`));
app.get('/health', (req, res) => res.json({ status: 'UP' }));

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
