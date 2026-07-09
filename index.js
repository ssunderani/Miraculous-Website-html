const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  let url = req.url || '/';
  // Strip query parameters
  url = url.split('?')[0];
  
  if (url === '/') {
    url = '/index.html';
  }

  // Resolve path: handle both root-level execution and dist-level bundle execution
  const safeUrl = path.normalize(url).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safeUrl);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'dist', safeUrl);
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Fallback to index.html if the resource is missing
      if (url !== '/index.html') {
        let indexFallbackPath = path.join(__dirname, 'index.html');
        if (!fs.existsSync(indexFallbackPath)) {
          indexFallbackPath = path.join(__dirname, 'dist', 'index.html');
        }
        
        fs.readFile(indexFallbackPath, (fallbackErr, fallbackContent) => {
          if (fallbackErr) {
            res.status(404).send('File not found: ' + url);
          } else {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(fallbackContent);
          }
        });
      } else {
        res.status(404).send('File not found: ' + url);
      }
    } else {
      // Content-type headers mapping
      const ext = path.extname(filePath).toLowerCase();
      let contentType = 'text/plain';
      
      if (ext === '.html') contentType = 'text/html';
      else if (ext === '.css') contentType = 'text/css';
      else if (ext === '.js') contentType = 'application/javascript';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.ico') contentType = 'image/x-icon';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.status(200).send(content);
    }
  });
};
