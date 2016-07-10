# Expressful
> Express.js with a bit of convention, convenience and opinion

**Currently in development and untested**

```
$ npm install expressful --save
```

## Quick start

Expressful sets up your express app with common modules.

```javascript
const app = require('expressful')();
app.start();
```

Your app would probably look somewhat like this.

```javascript
const expressful = require('expressful');

// setup your express app, sets static directory to `public`
const app = expressful();

// matches routes to views inside of `/views/pages/${page}`
app.servePages();

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
|-- /views/
|   └-- /pages/
|       |-- /${page}.html
|       └-- /homepage.html # rendered with nunjucks
```

### app = expressful();

1. sets up static directory for `/public`
2. sets up all the modules listed above
3. mutes favicon request by default
4. sets up `nunjucks` with `Remarkable` and `highlight.js`

```javascript
const expressful = require('expressful');
const app = expressful();
```

### app.start();

1. sets up `errorhandler` on development
2. proxy for `app.listen`

```javascript
const app = require('expressful')();
app.start(); // <----
```

### app.servePages();

1. sets up routes for `/:page` and `/` (where :page defaults to `homepage`)
2. if `/views/pages/${page}.html` exists continue, otherwise call `next()`
3. content = merge `/content/global.cson` with `/content/${page}.cson` if they exist
4. res.render(`/views/pages/${page}.html`, `content`);

```javascript
// ./app.js
const app = require('expressful')();
app.servePages(); // <----
app.start();
```

```CSON
# ./content/global.cson

brandName: "Expressful"
```

```CSON
# ./content/homepage.cson

title: "Homepage"
markdown:
	intro: '''
	# Welcome

	Lorem ipsum *markdown*
	'''
```

```html
<!-- ./views/pages/homepage.html -->
<h1>{{ brandName }} - {{ title }}</h1>
<article>
	{{ markdown.intro | markdown | safe }}
</article>
<footer>{{ year }} &copy; Expressful by Jeroen Ransijn</footer>
```

**Note:** `year`, `month` and `day` are always available.


### Nunjucks templating

Expressful uses the `nunjucks` templating engine by default. It's setup with `Remarkable` and `highlight.js` which is helpful if you are using the content system.


## Configuration

Although Expressful is about convention. There is some configuration available:

```javascript
const expressful = require('expressful');

// Values are defaults
const app = expressful({
	publicFolderName: 'public', // 'public' is the default static folder
	faviconPath: 'public/favicon.ico', // path to favicon
	muteFavicon: true, // make it easy to get started without a favicon
	useNunjucks: true // nunjucks is the default templating engine
});
```

## Author & License

Created by **Jeroen Ransijn** under the **MIT license**.
