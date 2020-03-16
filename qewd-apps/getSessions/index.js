module.exports = function(messageObj, session, send, finished) {
  let activeSessions = this.sessions.active();
  let sessions = [];
  let disabled;
  activeSessions.forEach(function(ewdSession) {
    disabled = false;
    // am I this session?  If so I can't stop it from the monitor
    if (session.id && ewdSession.id.toString() === session.id.toString()) disabled = true;
    sessions.push({
      id: ewdSession.id,
      token: ewdSession.token,
      application: ewdSession.application,
      expiry: ewdSession.expiryTime,
      disabled: disabled
    });
  });
  finished({sessions: sessions});
};