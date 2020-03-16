module.exports = function(message) {
  this.setWorkerPoolSize(message.poolSize);
  return {
    ok: true
  };
};