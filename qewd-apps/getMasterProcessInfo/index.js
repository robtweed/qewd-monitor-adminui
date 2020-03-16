module.exports = function(messageObj, session, send, finished) {
  console.log(11111111111);
  if (session.authenticated) {
    console.log(222222);
    finished({ok: true});
  }
  else {
    finished({error: 'Unauthenticated'});
  }
};