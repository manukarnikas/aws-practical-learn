exports.handler = async (event) => {
    console.log("Received records:", event.Records.length);


    return {
        statusCode: 200,
        body: `Successfully processed ${event.Records.length} messages`
    };
};


// partial failed records

// exports.handler = async (event) => {
//     console.log("===>Received records:", event.Records.length);

//     const batchFailure = [];

//     for(const record of event.Records){
//         batchFailure.push({
//             itemIdentifier: record.messageId
//           })
//     }

//     console.log("===>Failed records:", batchFailure);

//     return {
//         batchItemFailures: batchFailure
//       };
// };