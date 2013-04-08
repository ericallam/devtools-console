This is an extraction of the inspector front-end code for Chrome DevTools. Code
has been changed to only run the console and instead of evaluating code in a special 'Backend' provided
by the Chrome browser, it runs commands from the console in a sandboxed js evironment (see runtime_stub.js).

To run this, you'll need node.js and coffeescript installed.  To get coffeescript, run `npm install coffee-script -g` and then
run `npm install`. Now you can run the server with `coffee app.coffee`, and open up the console in localhost:8080.  When you visit '/' it will
load the `console.html` file, which includes all the css and javascript.  The `overrides.js` file is used to customize the inspector app to only do the console
and to use the Runtime stub.