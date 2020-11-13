/*

 ------------------------------------------------------------------------------------
 | qewd-monitor-adminui: AdminUI/WebComponent-based QEWD Monitor Tool               |
 |                                                                                  |
 | Copyright (c) 2020 M/Gateway Developments Ltd,                                   |
 | Redhill, Surrey UK.                                                              |
 | All rights reserved.                                                             |
 |                                                                                  |
 | http://www.mgateway.com                                                          |
 | Email: rtweed@mgateway.com                                                       |
 |                                                                                  |
 |                                                                                  |
 | Licensed under the Apache License, Version 2.0 (the "License");                  |
 | you may not use this file except in compliance with the License.                 |
 | You may obtain a copy of the License at                                          |
 |                                                                                  |
 |     http://www.apache.org/licenses/LICENSE-2.0                                   |
 |                                                                                  |
 | Unless required by applicable law or agreed to in writing, software              |
 | distributed under the License is distributed on an "AS IS" BASIS,                |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.         |
 | See the License for the specific language governing permissions and              |
 |  limitations under the License.                                                  |
 ------------------------------------------------------------------------------------

  13 November 2020

*/

module.exports = function(messageObj, session, send, finished) {
  if (session.authenticated) {
    let max = 1000;
    if (!messageObj.documentName) {
      // return directory listing
      let dir = this.db.global_directory();
      let results = [];
      let _this = this;
      dir.forEach(function(docName) {
        let name = docName.split('^')[1];
        let doc = _this.db.use(name);
        let noOfChildren = doc.countChildren(max);
        if (noOfChildren > max) noOfChildren = '>' + max.toString();
        results.push({
          documentName: name,
          noOfChildren: noOfChildren
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
          noOfChildren = child.countChildren(max);
          if (noOfChildren > max) noOfChildren = '>' + max.toString();
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
