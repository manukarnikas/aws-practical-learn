exports.handler = async (event) => {
    for (const record of event.Records) {
        try {
            const payload = JSON.parse(
                Buffer.from(record.kinesis.data, "base64").toString("utf8")
            );

            console.log("Partition Key:", record.kinesis.partitionKey);
            console.log("Sequence Number:", record.kinesis.sequenceNumber);
            console.log("Payload:", payload);

        } catch (err) {
            console.error(err);
            throw err;   
        }
    }
};