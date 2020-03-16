module.exports = function(messageObj, session, send, finished) {
  if (session.authenticated) {
    if (!messageObj.documentName) {
      // return directory listing
      let dir = this.db.global_directory();
      let results = [];
      let _this = this;
      dir.forEach(function(docName) {
        let name = docName.split('^')[1];
        let doc = _this.db.use(name);
        console.log(1111);
        console.log(doc);
        results.push({
          documentName: name,
          noOfChildren: doc.countChildren()
        });
      });


      finished({results: results});
    }
    else {
      let doc = this.db.use(messageObj.documentName, messageObj.path);
      let results = [];
      doc.forEachChild(function(ix, child) {
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
      finished({results: results});
    }
  }
  else {
    finished({error: 'Unauthenticated'});
  }
};
