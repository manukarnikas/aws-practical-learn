// producer is node code run in ec2 or local

const { KinesisClient, PutRecordCommand } = require("@aws-sdk/client-kinesis");

const client = new KinesisClient({
  region: "ap-south-1"
});

async function sendOrder() {

  const order = {
    orderId: Date.now(),
    userId: "user-123",
    amount: Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString()
  };


  const command = new PutRecordCommand({
    StreamName: "orders-stream",

    Data: Buffer.from(JSON.stringify(order)),

    // decides which shard this record goes into
    PartitionKey: order.userId
  });


  const response = await client.send(command);

  console.log("Sent:");
  console.log(order);

  console.log("Shard:", response.ShardId);
  console.log("Sequence:", response.SequenceNumber);
}


sendOrder();
