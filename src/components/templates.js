const { getStyles, getErrorStyles } = require('./styles');

const getMainTemplate = (htmlContent) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Changelog</title>
    <style>
      ${getStyles()}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📋 Changelog</h1>
        <p>Track the latest updates and changes to our platform</p>
      </div>
      
      <div class="content">
        ${htmlContent}
      </div>
      
      <div class="footer">
        <p>Generated with ❤️ | Last updated: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
  </body>
  </html>
`;

const getErrorTemplate = () => `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Error - Changelog</title>
    <style>
      ${getErrorStyles()}
    </style>
  </head>
  <body>
    <div class="error">
      <h1>⚠️ Error</h1>
      <p>Failed to load changelog. Please try again later.</p>
    </div>
  </body>
  </html>
`;

module.exports = { getMainTemplate, getErrorTemplate }; 