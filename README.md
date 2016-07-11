# Expressful
> Express.js with a bit of convention, convenience and opinion

**Currently in development and untested**

```
$ npm install expressful --save
```

## Quick start

Expressful sets up your express app with less boilerplate.

```javascript
const app = require('expressful')();
app.start();
```

It also gives you

```javascript
const expressful = require('expressful');

// setup your express app, sets static directory to `public`
const app = expressful();

// render ./content using expressful-content + nunjucks
app.serveContent();

// use app as a regular express app
app.post('/contact', (req, res) => res.json({ success: true }));

// proxy for app.listen
app.start();
```

## Convention

Express.js was broken down in different npm modules when transitioned from version 3 to 4. Expressful bundles the most used dependencies that used to be in version 3:

* `body-parser`
* `cookie-parser`
* `errorhandler`
* `morgan`
* `serve-favicon`
* `express-session`
* `errorhandler`

**Note:** `multer` for file uploads is left out.

## Convenience

Expressful assumes this project structure for all features to work:

```
.
|-- /public/ # static directory
|-- /content
|   |-- /${page}.(cson|json)
|   └-- /homepage.cson
|-- /views/
|   |-- /${page}.html
|   └-- /homepage.html # rendered with nunjucks
```

### app = expressful();

```javascript
const expressful = require('expressful');
const app = expressful();
```

1. sets up static directory for `/public`
2. sets up all the modules listed above
3. mutes favicon request by default
4. sets up `nunjucks` with `Remarkable` and `highlight.js`

### app.start();

```javascript
const app = require('expressful')();
app.start(); // <----
```

1. sets up `errorhandler` on development
2. proxy for `app.listen`

### app.serveContent();

Uses [expressful-content](https://github.com/jeroenransijn/expressful-content) to give you a flat file based content management system.

```javascript
// ./app.js
const app = require('expressful')();
app.serveContent(); // <----
app.start();
```

### The content folder represents your routes

* By default the route name is used for both `content` and `view`

```
GET /page
  1. ./content/page.(cson|json) = { title: 'Page' }
  2. ./views/page.html = <h1>{{ title }}</h1>
  => <h1>Page</h1>
```

* You can nest content, it will look for the view

```
GET /deep/page
  1. ./content/deep/page.(cson|json) = { title: 'Nested Page' }
  2. ./views/deep/page.html = <h1>{{ title }}</h1>
  => <h1>Nested Page</h1>
```

* Double underscores in filenames are considered (fake) slashes.
* Overwrite what view to render with the `$layout` property

```
GET /blog/2016/10/06/article-title
  1. ./content/blog/2016__10__06__article.cson
     = { $layout: 'blogpost.html', title: 'Article' }
  2. ./views/blogpost.html = <h1>{{ title }}</h1>
  => <h1>Article</h1>
```

* If there is content but no view, `next()` is called

```
GET /missing-view
  1. ./content/missing-view.cson
  2. view is missing
  => next();
```

*

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
