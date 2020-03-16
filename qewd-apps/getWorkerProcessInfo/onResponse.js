module.exports = function(messageObj, send) {
  this.handleStats(function(messageObj) {
    let resultObj = {
      type: 'getWorkerProcessInfo',
      results: messageObj.worker,
      message: {
        ok: true
      }
    };
    send(resultObj);
  });
  return true;
};
