module.exports = function(messageObj, send) {
  var stats = this.getStats();
  messageObj.info = {
    pid: process.pid,
    startTime: new Date(this.startTime).toLocaleString(),
    upTime: stats.uptime,
    memory: stats.memory
  };
};