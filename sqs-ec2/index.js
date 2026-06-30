const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
   ChangeMessageVisibilityCommand
} = require("@aws-sdk/client-sqs");
const dotenv = require('dotenv');

dotenv.config();

const REGION = process.env.REGION || '';
const QUEUE_URL = process.env.QUEUE_URL || '';

const sqs = new SQSClient({ region: REGION });

async function pollQueue() {
  while (true) {
    try {
      const response = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: QUEUE_URL,
          MaxNumberOfMessages: 1,
          WaitTimeSeconds: 20, 
        })
      );

      if (!response.Messages || response.Messages.length === 0) {
        console.log("No messages...");
        continue;
      }

      for (const message of response.Messages) {
        console.log("Received:");
        console.log(message.MessageId);

        //  // Extend visibility timeout to 120 seconds
        // await sqs.send(
        //   new ChangeMessageVisibilityCommand({
        //     QueueUrl: QUEUE_URL,
        //     ReceiptHandle: message.ReceiptHandle,
        //     VisibilityTimeout: 120,
        //   })
        // );

        // console.log("Visibility timeout extended.");

        // // Simulate long processing
        // await new Promise((resolve) => setTimeout(resolve, 60000));


        console.log("Processing complete.");

        await sqs.send(
          new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          })
        );

        console.log(`Deleted message: ${message.MessageId}`);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

pollQueue();