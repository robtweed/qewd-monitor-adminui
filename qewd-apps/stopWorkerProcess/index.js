module.exports = function(messageObj, session, send, finished) {
  if (session.authenticated) {
    finished({pid: messageObj.pid});
  }
  else {
    finished({error: 'unauthenticated'});
  }
};
