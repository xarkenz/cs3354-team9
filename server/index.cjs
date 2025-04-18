// This and package.json changes based initially on templates in
// https://expressjs.com/ and
// https://blog.codeminer42.com/making-a-full-stack-app-with-vue-vite-and-express-that-supports-hot-reload/
const express = require('express')
const app = express()
const port = process.env.BACKEND_PORT || 3000

// app.use(function(req, res, next) { //https://enable-cors.org/server_expressjs.html
//   res.header("Access-Control-Allow-Origin", "*"); // CORS will work from all websites
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/api/hello', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})