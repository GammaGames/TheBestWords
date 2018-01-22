const express = require('express');
const config = require('config');
const cron = require('node-cron');
const Aws = require("./app/aws");

const app = express();
app.use('/api', express.static('public/api.html'));
app.use('/health', require('express-healthcheck')());
const port = 8081;
global.redditAuth = config.get('reddit');
global.twitterAuth = config.get('twitter');
global.awsAuth = config.get('aws');
const aws = new Aws();

app.listen(port, () => {
    console.log("We are live on http://127.0.0.1:" + port);
});

require('./app/routes')(app);

cron.schedule('*/15 5-20 * * *', function(){
    aws.syncCache();
});

aws.syncCache();
