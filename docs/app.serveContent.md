# app.serveContent();

Creates routes for your app based on your `content` directory.
[Learn how content routes work](docs/content-routes.md)

```javascript
// ./app.js
const app = require('expressful')();
app.serveContent(); // <----
app.start();
```
