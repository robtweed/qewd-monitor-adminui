module.exports = function(messageObj, session, send, finished) {
  let rec = session.data.$('count');
  let ix = rec.increment();
  session.data.$(['log', ix]).value = Date.now();
  if (session.authenticated) {
    let ewdSession = this.sessions.byToken(messageObj.params.token);
    if (ewdSession) {
      let results = [];
      ewdSession.data.forEachChild(function(ix, child) {
        let value;
        let noOfChildren;
        if (child.hasValue) {
          value = child.value;
        }
        else {
          noOfChildren = child.countChildren();
        }
        results.push({
          name: ix,
          path: child.path,
          value: value,
          noOfChildren: noOfChildren
        });
      });
      finished({
        id: ewdSession.id,
        results: results
      });
    }
    else {
      finished({error: 'No such Session'});
    }
  }
  else {
    finished({error: 'Unauthenticated'});
  }
};
