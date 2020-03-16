module.exports = function(messageObj, send) {
  console.log(111111);
  this.stopWorker(messageObj.pid);
};