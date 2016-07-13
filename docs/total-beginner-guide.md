## Total beginner steps to run an Expressful app

(1) [Install node.js](https://nodejs.org/en/download/)

(2) Create the following project structure

```
.
|-- app.js
└-- package.json
```

(3) Put this in your `package.json`

```json
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
