const kcl = require('aws-kcl');

function RecordProcessor() {
  this.shardId = null;
}

RecordProcessor.prototype = {
  initialize: function(initializeInput, completeCallback) {
    this.shardId = initializeInput.shardId;
    process.stderr.write(`[KCL-NODE] Initialized processor for shard:  ${this.shardId}\n`);
    completeCallback();
  },

  processRecords: function(processRecordsInput, completeCallback) {
    const records = processRecordsInput.records;
    
    process.stderr.write(`[KCL-NODE] Shard ${this.shardId} received ${records.length} records.\n`);

    for (let i = 0; i < records.length; i++) {
      try {
        const record = records[i];
        const data = Buffer.from(record.data, 'base64').toString('utf8');
        process.stderr.write(`[KCL-NODE] Processing sequence ${record.sequenceNumber}\n`);
      } catch (err) {
        process.stderr.write(`[ERROR] Failed to process record: ${err.message}\n`);
      }
    }


    processRecordsInput.checkpointer.checkpoint(function(err, checkpointedSequenceNumber) {
      if (err) {
        process.stderr.write(`[WARN] Checkpoint failed on shard ${this.shardId}: ${err}\n`);
      } else {
        process.stderr.write(`[KCL-NODE] Successfully checkpointed at: ${checkpointedSequenceNumber}\n`);
      }
      completeCallback();
    }.bind(this));
  },

  shutdownRequested: function(shutdownRequestedInput, completeCallback) {
    process.stderr.write(`[KCL-NODE] Shutdown requested for shard: ${this.shardId}\n`);
    shutdownRequestedInput.checkpointer.checkpoint(function(err) {
      completeCallback();
    });
  },

  shutdown: function(shutdownInput, completeCallback) {
    process.stderr.write(`[KCL-NODE] Shard ${this.shardId} shutting down. Reason: ${shutdownInput.reason}\n`);
    completeCallback();
  }
};


kcl(new RecordProcessor()).run();