module.exports = function(messageObj, session, send, finished) {
  if (session.authenticated) {
    finished({ok: true});
  }
  else {
    finished({error: 'Unauthenticated'});
  }
};
