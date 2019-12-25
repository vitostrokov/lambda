const util = require('util');
const AWS = require('aws-sdk');

const S = new AWS.S3({
    maxRetries: 0,
    region: 'us-west-2',
});

exports.handler = async(event, context) => {
    console.log("reading options from event:\n", util.inspect(event, {depth:5}));
    var srcBucket = event.Records[0].s3.bucket.name;
    var srcKey = event.Records[0].s3.object.key;

    if (srcKey.match(/\.csv$/) === null){
        var msg = "Key " + srcKey + " in not CSV!";
        console.log(msg);
        return {message:msg};
    }
    console.log('Getting ${srcKey} from S3://${srcBucket}')

    var data = await S.getObject({
        Bucket:srcBucket,
        Key: srcKey,
    }).promise();

    var lines = data.Body.toString('utf-8').split('\n');
    var net_proft = 0;
    lines.slice(1).forEach(function (raw_line){
        var line = raw_line.split(',');
        if (line.length < 3) {return null;}
        console.log(line);
        net_proft += line[2] - line[3];
    });

    console.log(net_proft);
    // console.log(data.Body.toString('utf-8'));
    // console.log(context.getRemainingTimeInMillis());
    return {"net_profits": net_proft};
};