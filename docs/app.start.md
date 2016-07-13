# app.start();

Starts your node server.
The last thing you call after all of your app logic if any.

```javascript
const app = require('expressful')();

// All of your other code...

app.start(); // <----
```

1. sets up `errorhandler` on development
2. prints out a table of all the routes you use in your app
3. proxy for `app.listen` on port 3000
