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

  11 May 2020

*/

module.exports = function(messageObj, session, send, finished) {
  let activeSessions = this.sessions.active();
  let sessions = [];
  let disabled;
  activeSessions.forEach(function(ewdSession) {
    disabled = false;
    // am I this session?  If so I can't stop it from the monitor
    if (session.id && ewdSession.id.toString() === session.id.toString()) disabled = true;
    sessions.push({
      id: ewdSession.id,
      token: ewdSession.token,
      application: ewdSession.application,
      documentName: ewdSession.documentName,
      expiry: ewdSession.expiryTime,
      disabled: disabled
    });
  });
  finished({sessions: sessions});
};