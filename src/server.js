import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import diagnose from "./api/diagnose";
import {renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";
import App from "./App";
import React from "react";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
    return assets[entrypoint]
        ? assets[entrypoint].css
            ? assets[entrypoint].css
                .map((asset) => `<link rel="stylesheet" href="${asset}">`)
                .join('')
            : ''
        : '';
};

// eslint-disable-next-line no-shadow
const jsScriptTagsFromAssets = (assets, entrypoint, ...extra) =>
    assets[entrypoint]
        ? assets[entrypoint].js
            ? assets[entrypoint].js
                .map((asset) => `<script src="${asset}" ${extra.join(' ')}></script>`)
                .join('')
            : ''
        : '';

const currentUrl = "https://emoident.com"
const renderApp = (req, res) => {
    const context = {};
    const markup = renderToString(
        <StaticRouter context={context} location={req.url}>
            <App />
        </StaticRouter>
    );
    const html = `<!doctype html>
  <html lang="vi">
  <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>Emoident - Thang đo cảm xúc trong văn bản</title>
          <meta name="description" content="Emoident là công cụ thang đo cảm xúc trong văn bản, giúp phân tích và hiểu độ chân thật của cảm xúc trong nội dung. Theo dõi và đánh giá mức độ cảm xúc từ tích cực đến tiêu cực.">
          <meta name="keywords" content="Emoident, thang đo cảm xúc, phân tích văn bản, đánh giá cảm xúc">
          <meta name="author" content="Nguyễn Trung Nhẫn">
      
          <meta property="og:title" content="Emoident - Thang đo cảm xúc trong văn bản">
          <meta property="og:description" content="Emoident là công cụ thang đo cảm xúc trong văn bản, giúp phân tích và hiểu độ chân thật của cảm xúc trong nội dung. Theo dõi và đánh giá mức độ cảm xúc từ tích cực đến tiêu cực.">
          <meta property="og:image" content="${currentUrl}/images/shared.png">
          <meta property="og:url" content="${currentUrl}">
          <meta property="og:locale" content="vi_VN" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Emoident - Thang đo cảm xúc trong văn bản" />
          
          <link rel="shortcut icon" href="${currentUrl}/images/favicon.ico">
          <link rel="icon" type="image/x-icon" href="/images/favicon.ico">

          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
          <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"/>
                ${cssLinksFromAssets(assets, 'client')}
  </head>
  <body>
      <div id="root">${markup}</div>
            ${jsScriptTagsFromAssets(assets, 'client', 'defer', 'crossorigin')}
            
            <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SQ7CCD560B"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-SQ7CCD560B');
</script>
  </body>
</html>`;
    return { context, html };
};



const server = express();
server
    .use(cors('*'))
    .disable('x-powered-by')
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .use(bodyParser.json({ limit: '5mb' }))
    .use(bodyParser.urlencoded({ extended: true }))
    .use('/api', diagnose)
    .get('/*',  (req, res, next) => {
        try {
            const { context, html } = renderApp(req, res);
            if (context.url) {
                res.redirect(context.url);
            } else {
                res.status(context.statusCode || 200).send(html);
            }
        } catch (error) {
            next(error);
        }
});


export default server;


