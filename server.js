/*eslint-env es6*/
'use strict';

const http = require('http');
const url = require('url');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const server = http.createServer();
server.on('request', (req, res) => {
  // Parse request url to object with query object, pathname string
  const requestPath = parseUrl(req.url);
  // Get controller by route
  const controller = findRoute(requestPath.pathname);
  // Execute controller
  console.log(req);
  controller(res);
});

// Routes. Key - is a path, value - is a function handleing response
const routes = new Map();
const viewFolder = '';
/**
 * return 404 page to writable streame htt.ServerResponse
 * @param  {http.ServerResponse} res
 */
function get404(res) {
  // TODO: create setup 404 page in application
  res.writeHead(404, {'Content-type': 'text/plain'});
  res.end('nothing was found');
}

function get500(res) {
  return ((res) => {
    res.writeHead(500, {'Content-type': 'text/plain'});
    res.end('Internal Server Error');
  })(res);
}

/**
 * find route in Application.routes map.
 * Have to use in server.on request method.
 * @param  {string} descriptionPath Key value of routes map
 * @return {function}                 function to handle http request
 */
function findRoute(descriptionPath) {
  if (routes.has(descriptionPath)) {
    return routes.get(descriptionPath)
  } else {
    return get404;
  }
}

/**
 * Take a URL string, and return an object
 * @param  {string} requestUrl [description]
 * @return {object}
 *
 */
/* object example
  {
    query: {
      param: "value"
    },
    pathname: '/test1/test2'
  }
 */
function parseUrl(requestUrl) {
  return url.parse(requestUrl, true);
}
/**
 * render view. Get view from view folder, render it with json data.
 * @param  {[type]} viewName [description]
 * @param  {[type]} viewData [description]
 * @return {Promise}         Return promise with rendered value. then((value)=>{})
 * if error occure, catch((value)=>{});
 */
function renderView(viewName, viewData, partialsView) {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(path.join(this.viewFolder, viewName), 'utf8', (err, data) => {
      if (err) {
        reject(err.message);
      } else {
        if (!viewData) {
          viewData = {};
        }
        if (!partialsView) {
          partialsView = {};
        }
        resolve(mustache.render(data, viewData, partialsView));
      }
    });
  });
  return promise;
}

/**
 * Export object
 * @type {Object}
 */
// TODO: create prototype based object and constructor or class
const Application = {
  name: 'Test application',
  viewName: '',
  listen: function(port) {
    server.listen(port);
  },
  get: function(descriptionPath, controller) {
    routes.set(descriptionPath, controller);
  },
  get404,
  get500,
  renderView,
  setViewFolder: function(viewFolder) {
    // TODO: Check if folder exist and available, check path
    if (viewFolder) {
      this.viewFolder = path.join(__dirname, viewFolder);
    }
  }
};

module.exports = Application;
