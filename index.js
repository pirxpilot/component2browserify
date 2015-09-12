#!/usr/bin/env node

var fs = require('fs');

var component = JSON.parse(fs.readFileSync('./component.json'));

var package = {
  "name": "",
  "private": true,
  "version": "",
  "description": "",
  "scripts": {
    "test": "make check"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/${org_name}.git"
  },
  "keywords": [
    "browser"
  ],
  "dependencies": {},
  "browser": {},
  "author": "Damian Krzeminski <pirxpilot@code42day.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/${org_name}/issues"
  }
};


[
  'version',
  'description'
].forEach(function(p) {
  package[p] = component[p];
});

if (component.repo) {
  package.name = component.repo.split('/', 2).join('-');
  package.repository.url = package.repository.url.replace('${org_name}', component.repo);
  package.bugs.url = package.bugs.url.replace('${org_name}', component.repo);
  delete package.private;
} else {
  package.name = component.name;
  delete package.repository;
  delete package.bugs;
}

if (component.keywords) {
  Array.prototype.push.apply(package.keywords, component.keywords);
}

if (component.dependencies) {
  Object.keys(component.dependencies).forEach(function(dep) {
    var npmdep = dep.split('/');
    var browserdep = npmdep[1];
    var version = component.dependencies[dep];

    if (version[0] !== '*') {
      version = '^' + version;
    }

    npmdep = npmdep.join('-');

    package.dependencies[npmdep] = version;
    package.browser[browserdep] = npmdep;
  });
}

fs.writeFileSync('package.json', JSON.stringify(package, null, 2));
