const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Port on which the server will run
const PORT = process.argv[2] || 1700;

// Maps file extension to MIME types which
// helps the browser to understand what to
// do with the file
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'application/vnd.ms-fontobject',
  '.ttf': 'application/font-sfnt'
};

http.createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  let dirPath;
  try {
    dirPath = query.path;
  } catch (e) {
    console.error(e);
  }
  const mainDirectory = process.argv[3] || dirPath;

  if (!mainDirectory) {
    res.statusCode = 404;
    res.end(`You must provide an absolute directory path to look for files. \nUse "${req.url}?path=YOUR_PATH"`);
    return;
  }

  if (['GET', 'POST'].indexOf(req.method) > -1) {
    const parsedUrl = url.parse(req.url);
    if (parsedUrl.pathname === '/') {
      let filesLink = '<ul>';
      res.setHeader('Content-type', 'text/html');
      const filesList = fs.readdirSync(mainDirectory);
      filesList.forEach(element => {
        if (fs.statSync(mainDirectory + '/' + element).isFile()) {
          filesLink += `<br/><li><a href='./${element}'>
                    ${element}
                </a></li>`;
        }
      });

      filesLink += '</ul>';
      res.end('<h1>List of files:</h1> ' + filesLink);
    }
    const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');

    let pathname = path.join(mainDirectory, sanitizePath);
    if (!fs.existsSync(pathname)) {
      // If the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
    } else {
      // Read file from file system limit to
      // the current directory only.
      fs.readFile(pathname, function (err, data) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error in getting the file.`);
        } else {
          // Based on the URL path, extract the file extension
          const ext = path.parse(pathname).ext;

          headers['Content-type'] = mimeType[ext] || 'application/json';
          res.writeHead(200, headers);
          res.end(data);
        }
      });
    }
    return;
  }

  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);

}).listen(PORT);

console.log(`Server listening on port ${PORT}`);
