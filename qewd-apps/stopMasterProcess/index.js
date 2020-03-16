module.exports = function(messageObj, session, send, finished) {
  if (session.authenticated) {
    send({masterProcessStopping: true});
    finished({ok: true});
  }
  else {
    finished({error: 'Unauthenticated'});
  }
};