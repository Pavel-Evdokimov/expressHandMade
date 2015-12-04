/*eslint-env es6*/

'use strict';
var app = require('./server.js');
app.listen(3001);
// define view folder
app.setViewFolder('app/views');
// TODO: define public folder
const contentTypeHtml = {'Content-type': 'text/html'};

app.get('/', (res) => {
  const viewName = 'index';
  const viewData = {title: 'Заголовок', body: 'Тело'};
  app.renderView(viewName, viewData, {part1: '<h1>test<h1>'}).
    then((value) => {
      res.writeHead(200, contentTypeHtml);
      res.end(value);
    }).
    catch((reason) => {
      console.error(reason);
      app.get500(res);
    });
});

app.get('/about', (res) => {
  const viewName = 'index';
  const viewData = {title: 'About', body: 'About'};
  app.renderView(viewName, viewData).
    then((value) => {
      res.writeHead(200, contentTypeHtml);
      res.end(value);
    }).
    catch((reason) => {
      console.error(reason);
      app.get500(res);
    });
});
// TODO: handle post request
app.get('/file', (res) => {
  
});
