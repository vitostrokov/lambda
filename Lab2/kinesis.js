exports.handler = async(event) => {
    let net_profit = 0;
    event.Records.forEach((record) => {
        let payload = new Buffer(record.kinesis.data, 'base64');
        console.log('Decode payload:', payload);
        let line = payload.split(',');
        if (line.length < 3) {return null;}
        net_profit += line[2] - line[3];
    });
    return {'net_profit': net_profit}

};