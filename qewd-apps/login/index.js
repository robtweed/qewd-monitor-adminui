module.exports = function(messageObj, session, send, finished) {

  if (messageObj.params.password !== this.userDefined.config.managementPassword) {
    return finished({error: 'Invalid login attempt'});
  }
  session.authenticated = true;
  session.timeout = 3600;
  finished({ok: true});

};
