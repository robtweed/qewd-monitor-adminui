module.exports = function(messageObj, session, send, finished) {
  var serverName = '';
  if (this.userDefined.config && this.userDefined.config.serverName) serverName = this.userDefined.config.serverName;
  finished({serverName: serverName});
};
