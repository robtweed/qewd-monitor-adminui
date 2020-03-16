module.exports = function(messageObj, session, send, finished) {
  if (session.authenticated) {
    finished({poolSize: messageObj.poolSize});
  }
  else {
    finished({error: 'Unauthenticated'});
  }
};