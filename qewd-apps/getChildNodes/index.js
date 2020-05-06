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

  6 May 2020

*/

module.exports = function(messageObj, session, send, finished) {

  if (!session.authenticated) {
    return finished({error: 'Unauthenticated'});
  }

  if (!messageObj.params) {
    return finished({error: 'Invalid request'});
  }

  let documentName = messageObj.params.documentName;
  if (!documentName || documentName === '') {
    return finished({error: 'Invalid request'});
  }

  let path = messageObj.params.path;
  if (!path || !Array.isArray(path)) {
    return finished({error: 'Invalid request'});
  }

  let idCounter = messageObj.params.idCounter;
  if (!idCounter || idCounter === '') {
    return finished({error: 'Invalid request'});
  }

  let parentId = messageObj.params.parentId;
  if (!parentId || parentId === '') {
    return finished({error: 'Invalid request'});
  }

  let doc = this.db.use(documentName, ...path);

  let nodes = [];
  let max = 8;
  let count = 0;
  let node;

  if (messageObj.params.moreSiblings) {
    idCounter++;
    node = {
      id: idCounter,
      documentName: documentName,
      path: path,
      morePreviousSiblings: true,
      seed: messageObj.params.seed,
      parent: parentId,
      subscript: '<== Previous sibling nodes'
    };
    nodes.push(node);

    doc.forEachChild({range: {from: messageObj.params.seed}}, function(index, child) {
      idCounter++;
      count++;
      if (count > max) {
        node = {
          id: idCounter,
          documentName: documentName,
          path: path,
          moreSiblings: true,
          seed: index,
          parent: parentId,
          subscript: 'More sibling nodes ==>'
        };
        nodes.push(node);
        return true;
      }
      node = {
        id: idCounter,
        documentName: documentName,
        path: child.path,
        parent: parentId,
        subscript: index,
        leafNode: !child.hasChildren,
        value: child.value
      };
      nodes.push(node);
    });

    return finished({
      nodes: nodes,
      idCounter: idCounter
    });
  }

  if (messageObj.params.morePreviousSiblings) {

    let child = doc.$(messageObj.params.seed);

    // check if there's a next sibling for the seed node

    let nextSibling = child.nextSibling;
    if (nextSibling) {
      idCounter++;
      node = {
        id: idCounter,
        documentName: documentName,
        path: path,
        moreSiblings: true,
        seed: nextSibling.name,
        parent: parentId,
        subscript: 'More sibling nodes ==>'
      };
      nodes.push(node);
    }

    idCounter++;
    node = {
      id: idCounter,
      documentName: documentName,
      path: child.path,
      parent: parentId,
      subscript: messageObj.params.seed,
      leafNode: !child.hasChildren,
      value: child.value
    };
    nodes.unshift(node);

    let ok = true;
    do {
      child = child.previousSibling;
      if (!child) {
        ok = false;
      }
      else {
        count++;
        idCounter++;
        if (count > max) {
          node = {
            id: idCounter,
            documentName: documentName,
            path: path,
            morePreviousSiblings: true,
            seed: child.name,
            parent: parentId,
            subscript: '<== Previous sibling nodes'
          };
          nodes.unshift(node);
          ok = false;
        }
        else {
          node = {
            id: idCounter,
            documentName: documentName,
            path: child.path,
            parent: parentId,
            subscript: child.name,
            leafNode: !child.hasChildren,
            value: child.value
          };
          nodes.unshift(node);
        }
      }
    }
    while (ok);

    return finished({
      nodes: nodes,
      idCounter: idCounter
    });
  }

  doc.forEachChild(function(index, child) {
    idCounter++;
    count++;

    if (count > max) {
      node = {
        id: idCounter,
        documentName: documentName,
        path: path,
        moreSiblings: true,
        seed: index,
        parent: parentId,
        subscript: 'More sibling nodes ==>'
      };
      nodes.push(node);
      return true; // stop the forEachChild loop
    }
    node = {
      documentName: documentName,
      path: child.path,
      subscript: index,
      leafNode: !child.hasChildren,
      parent: parentId,
      value: child.value,
      id: idCounter
    };
    nodes.push(node);
  });

  finished({
    nodes: nodes,
    idCounter: idCounter
  });

};
