const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Fallback all routes to index.html (SPA style routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  Mahua Group Portal is running successfully!`);
    console.log(`  Access the site: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
