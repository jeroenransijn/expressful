# Expressful
> Express.js with a bit of convention and convenience. Optimized for branding websites.

**Currently in development**

```
$ npm install expressful --save
```

## Quick start

Expressful sets up your express app with less boilerplate.
`app` is still an Express.js app you know and love.

```javascript
// app.js
require('expressful')();
app.start();
```

Expressful gives you some powerful functions that cut down boilerplate.

```javascript
// app.js
const expressful = require('expressful');

// creates your express app with common dependencies and nunjucks templating
// also sets static directory to `public`
const app = expressful();

// turns your content directory into routes and matches its to views
app.serveContent();

// proxy for app.listen and helpful dev stuff
app.start();
```

## Goals of Expressful

* Removes setup time
* Easy for beginners
* Focus on content and HTML + CSS
* Favors convention over configuration

## Optimized for branding websites

The goal of Expressful is to give you a convenient starting point for **branding websites**.

### What is a branding website?

Think about the 3 different types of web services you can make:

* **Branding websites**: semi static content, focused on brand design, mainly HTML & CSS
* **Single page apps**: static and dynamic content, complex UI with heavy JavaScript
* **API**: only dynamic content, serves JSON/XML only

Expressful is optimized for just **branding websites**.
Express.js on the other hand is unopinionated for all 3 types.

### Websites you can make with Expressful

* **App landing pages**
* **Small business websites**
* **Portfolio's**

## Total beginner steps to run an Expressful app

(1) [Install node.js](https://nodejs.org/en/download/)

(2) Create the following project structure

```
.
|-- app.js
└-- package.json
```

(3) Put this in your `package.json`

```
{
  {
  "dependencies": {
    "expressful": "^0.2.0"
  }
}
```

(4) Open terminal, `cd` to your directory and type

```
$ npm install
```

(5) Put this in your `app.js`

```javascript
const expressful = require('expressful');
const app = expressful();
app.start();
```

(6) Open terminal, `cd` to your directory and type

```
$ node app.js
```

(7) Open your browser on [http://localhost:3000/](http://localhost:3000/)

(8) Learn more about Expressful

## A simple project structure

Expressful is focused on **content**, **HTML** and **CSS**.
Most of your projects will look somewhat like this:

```
.
|-- /node_modules/        # contains dependencies such as expressful
|-- /public/              # contains assets such as images
|-- /content              # contains json and cson files
|   |-- /${page}.json     
|   └-- /homepage.cson
|-- /views/               # contains html files
|   |-- /${page}.html
|   └-- /homepage.html
|-- /app.js               # starting point of your node app
└-- /package.json         # information about your app and dependencies
```

### app = expressful(); explained

The same as an Express.js app with some additional features.

```javascript
const expressful = require('expressful');
const app = expressful();
```

1. sets up static directory for `/public`
2. mutes favicon request by default
3. sets up `nunjucks` templating (with `Remarkable` and `highlight.js`)
4. sets up the following modules
  * `body-parser`
  * `cookie-parser`
  * `errorhandler`
  * `morgan`
  * `serve-favicon`
  * `express-session`
  * `errorhandler`

**Note:** `multer` for file uploads is left out.

### Expressful sets up Express.js how you want it

Express.js was broken down in different modules when it transitioned from version 3 to 4. Expressful bundles the most used dependencies that used to be in version 3 of Express.js.

### app.start(); explained

```javascript
const app = require('expressful')();
app.start(); // <----
```

1. sets up `errorhandler` on development
2. prints out a table of all the routes you use in your app
3. proxy for `app.listen` on port 3000

### app.serveContent(); explained

The `serveContent` function sets up your routes according to your `content` directory.

```javascript
// ./app.js
const app = require('expressful')();
app.serveContent(); // <----
app.start();
```

Expressful uses [expressful-content](https://github.com/jeroenransijn/expressful-content) under the hood to give your content files superpowers.

### The content folder represents your routes

![Basic Routes inforgraphic](docs/basic-routes.png)

* By default the route name is used for both `content` and `view`

```
GET /page MATCHES

  CONTENT FILE: ./content/page.json

    { title: 'Page' }

  LAYOUT FILE: ./views/page.html

    <h1>{{ title }}</h1>

OUTPUT => <h1>Page</h1>
```

* You can have routes with slashes. It will look for nested content.

```
GET /deep/page MATCHES

  CONTENT FILE: ./content/deep/page.json

    { title: 'Nested Page' }

  LAYOUT FILE: ./views/deep/page.html WHICH CONTAINS

    <h1>{{ title }}</h1>

OUTPUTS => <h1>Nested Page</h1>
```

* Double underscores in filenames are considered (fake) slashes.
* Overwrite what view to render with the `$layout` property

```
GET /blog/2016/10/06/article-title MATCHES

  CONTENT FILE: ./content/blog/2016__10__06__article.cson

    { $layout: 'blogpost.html', title: 'Article' }

  LAYOUT FILE: ./views/blogpost.html

    <h1>{{ title }}</h1>

=> <h1>Article</h1>
```

* If there is content but no view, `next()` is called

### Basic homepage example with `__extend` content mixin

Assume the following project structure

```
.
|-- /content/
|   └-- /homepage.cson
|-- /views/
|   └-- /homepage.html
```

```cson
# ./content/homepage.cson

__extend: '_global.cson'
title: 'Homepage'
```

```cson
# ./content/_global.cson

brandName: 'Expressful'
```

**Filenames that start with an underscore (_) will not be routed**

```html
<!-- ./views/homepage.html -->
<h1>{{ brandName }} - {{ title }}</h1>
```

`GET /` renders:

```html
<h1>Expressful - Homepage</h1>
```

**by default / routes to homepage**

### Blog example with `$layout` and `__list` content mixin

Assume the following project structure

```
.
|-- /content/
|   |   /blog.cson
|   └-- /blog/
|       |-- 2016__10__06__first-article.cson
|       └-- 2016__10__07__second-article.cson
|-- /views/
|   |   /blog.html
|   └-- /blogpost.html
```

#### Articles use `$layout` to set the layout

```
# ./content/blog/2016__10__06__first-article.cson
$layout: 'blogpost.html'
title: 'First'
```

```
# ./content/blog/2016__10__07__second-article.cson
$layout: 'blogpost.html'
title: 'Second'
```

```html
<!-- ./views/blogpost.html -->
<h1>{{ title }}</h1>
```

`GET /blog/2016/10/07/second-article` renders:

```html
<h1>Second</h1>
```

#### The overview itself uses `__list`

`__list` is a mixin that is somehwat harder to use.
It lists a directory and replaces the key `__list` by whatever is given in the `as` property.

[See an example about how `__list` works](https://github.com/jeroenransijn/expressful-content)

```blog.cson
title: 'Blog'
__list:
  directory: './blog',
  as: 'posts'
```

```blog.html
{% for post in posts %}
<h1>post.title</h1>
{% endfor %}
```

`GET /blog` renders:

```html
<!-- TODO: figure out if this is actually the order -->
<h1>First</h1>
<h1>Second</h1>
```

### Nunjucks templating

Expressful uses the `nunjucks` templating engine by default. It's setup with `Remarkable` and `highlight.js` which is helpful if you are using the content system.


## Configuration

Although Expressful is about convention. There is some configuration available:

```javascript
const expressful = require('expressful');

// Values are defaults
const app = expressful({
  publicDirectory: 'public', // 'public' is the default static folder
  viewsDirectory: 'views', // don't change this for no reason, used for testing mainly
  faviconPath: 'public/favicon.ico', // path to favicon
  muteFavicon: true, // make it easy to get started without a favicon
  useNunjucks: true // nunjucks is the default templating engine
});
```

## Author & License

Created by **Jeroen Ransijn** under the **MIT license**.
