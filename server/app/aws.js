var s3 = require('s3');
var moment = require('moment');

var method = Aws.prototype;

function Aws() {
    this.client = s3.createClient({
        s3Options: {
            accessKeyId: global.awsAuth.accessKeyId,
            secretAccessKey: global.awsAuth.secretAccessKey,
            region: 'us-east-1'
        },
    });
}

method.syncCache = function(callback) {
    var that = this;
    this.startTime = moment();
    console.log("Cache sync: " + this.startTime.format("MM-DD-YYYY H:m:s"));
    this.client.downloadDir({
        localDir: "cache/",
        s3Params: {
            Bucket: "thebestwords.io",
            Prefix: "cache/"
        }
    }).on("end", () => {
        console.log(moment().diff(that.startTime) / 1000 + ' seconds');
        if(typeof callback != 'undefined') {
            callback();
        }
    }).on("error", function(error) {
        console.log("error? maybe?");
        if(typeof callback != 'undefined') {
            callback();
        }
    });
}

module.exports = Aws;
