import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../src/App';
 
const app = express();
const PORT = 8080;

app.use('^/$', (req, res, next) => {
  // build html
  const context = {};
  const content = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  // insert rendered content into response
  fs.readFile(path.resolve('./build/index.html'), 'utf-8', (err, data) => {
    if (err) {
      console.log({err});
      res.status(500).send('Something went wrong');
      return;
    }

    const page = data.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
    console.log({page});
    res.send(page);  
  })
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.listen(PORT, () => {
  console.log(`SSR is listening on port ${PORT}`);
});