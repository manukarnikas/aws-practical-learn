// consumer is node code run in ec2 to better understand kinesis

const {
  KinesisClient,
  GetShardIteratorCommand,
  GetRecordsCommand
} = require("@aws-sdk/client-kinesis");


const client = new KinesisClient({
  region: "ap-south-1"
});


const STREAM_NAME = "orders-stream";
const SHARD_ID = "shardId-000000000001";  // each consumer should process one shard


async function startConsumer(){

  const iteratorResponse = await client.send(
    new GetShardIteratorCommand({
      StreamName: STREAM_NAME,
      ShardId: SHARD_ID,
      ShardIteratorType: "TRIM_HORIZON"    // shardIteratorType LATEST reads from latest records
    })
  );

  let shardIterator = iteratorResponse.ShardIterator;

  while(true){
    console.log('Fetching records...');
    const response = await client.send(
      new GetRecordsCommand({
        ShardIterator: shardIterator,
        Limit: 10
      })
    );

    if(response.Records.length){
        console.log('Fetched Records',response.Records.length);
    }
    
   for(const [index,record] of response.Records.entries()){
      const message = JSON.parse(Buffer.from(record.Data).toString());
      console.log(`Record: ${index} Message: ${JSON.stringify(message)}  Sequence: ${record.SequenceNumber}`);
    }

    shardIterator = response.NextShardIterator;

    await new Promise(
      resolve => setTimeout(resolve,5000)
    );
  }

}

startConsumer();

