const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors())
app.get('/', (req, res, next) => {
    res.status(200).send('this is index');
})
const routerNameList = fs.readdirSync('./router', 'utf8').map(val => val.toLowerCase()).filter(val => /^.*\.route\.js$/.test(val))
routerNameList.forEach(val => {
    const route = require(`./router/${val}`)
    const api = `/api/v1/${val.split('.').shift()}`
    console.log(api);
    app.use(api, route)
})

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server listening on port ', PORT);
})