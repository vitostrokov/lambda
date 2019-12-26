var AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();
var table = process.env.TABLE;

exports.handler = (event, context, callback) => {
    // TODO implement
    console.log(JSON.stringify(event, null, 2));
    
    event.Records.forEach((record) =>{
        if (record.eventName !== "INSERT") {return null;}
        
        var net = record.dynamodb.NewImage.gross.N - record.dynamodb.NewImage.costs.N;
        var timestamp = (new Date()).toISOString();
        console.log('DynamoDB record recievedm adding timestamp:${timestamp} and net:${net}')
        
        docClient.put({
            TableName: table,
            Item: {
                "tx_id": record.dynamodb.Keys.tx_id.S,
                "costs": record.dynamodb.NewImage.costs.N,
                "gross": record.dynamodb.NewImage.gross.N,
                "net": net,
                "timestamp": (new Date()).toISOString(),
            
            }
        }, function(err, data){
            if (err) console.log(err);
            else console.log("dynamoDB write success: ", data);
        });
    });
    callback(null, {});
};