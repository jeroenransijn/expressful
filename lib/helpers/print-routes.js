'use strict';
const Table = require('cli-table');

function printRoutes (app) {
  listRouters(app._router, 'Global Routes')
    .map(r => createTable(r.title, r.routes))
    .forEach(t => console.log(t.toString()));
}

function createTable (title, routes) {
  const table = new Table({
    head: ['Method', title],
    colWidths: [8, 50]
  });

  routes.forEach(r => {
    Object.keys(r.methods).forEach(m => {
      table.push([m.toUpperCase(), r.path]);
    });
  });

  return table;
}

function listRouters (router, title) {
  const list = [{
    title: title,
    routes: []
  }];

  router.stack.forEach(r => {
    if (r.name === 'router') return list.push(
      listRouters(r.handle, r.handle.title || 'Untitled Router Routes'));
    if (r.route) return list[0].routes.push(r.route);
  });

  return [].concat.apply([], list);
}

module.exports = printRoutes;
