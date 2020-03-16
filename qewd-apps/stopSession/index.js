module.exports = function(messageObj, session, send, finished) {
  let ewdSession = this.sessions.byToken(messageObj.params.token);
  if (ewdSession) ewdSession.delete();
  finished({ok: true});
};
