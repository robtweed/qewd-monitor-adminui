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

  17 March 2020

*/

export function define_sessions_page(QEWD, webComponents) {

  let component = {
    componentName: 'adminui-content-page',
    state: {
      name: 'sessions'
    },
    children: [
      {
        componentName: 'adminui-content-page-header',
        state: {
          title: 'QEWD Sessions'
        }
      },
      {
        componentName: 'adminui-row',
        children: [
          {
            componentName: 'adminui-content-card',
            state: {
              name: 'sessions-card'
            },
            children: [
              {
                componentName: 'adminui-content-card-header',
                state: {
                  title: 'Currently Active QEWD Sessions',
                  title_colour: 'info'
                }
              },
              {
                componentName: 'adminui-content-card-body',
                children: [
                  {
                    componentName: 'adminui-table',
                    state: {
                      headers: ['Id', 'Application', 'Expiry', 'View', 'Stop'],
                    },
                    hooks: ['getSessions']
                  }
                ]
              }
            ]
          },
          {
            componentName: 'adminui-content-card',
            state: {
              name: 'session-details-card',
              hide: true
            },
            children: [
              {
                componentName: 'adminui-content-card-header',
                state: {
                  title: 'QEWD Session Data',
                  title_colour: 'info'
                }
              },
              {
                componentName: 'adminui-content-card-body',
                state: {
                  name: 'qewd-session-data'
                }
              }
            ]
          }
        ]
      }
    ]
  };

  let stopSessionBtn = {
    componentName: 'adminui-button',
    state: {
      icon: 'power-off',
      colour: 'danger'
    },
    hooks: ['stopSession']
  };

  let showSessionBtn = {
    componentName: 'adminui-button',
    state: {
      icon: 'list',
      colour: 'info'
    },
    hooks: ['getSessionInfo']
  };


  let hooks = {
    'adminui-button': {
      stopSession: function() {
        let _this = this;
        let id = this.parentNode.id.split('qewd-del-')[1];
        let table = this.getParentComponent({match: 'adminui-table'});
        let fn = function() {
          QEWD.send({
            type: 'stopSession',
            params: {
              token: id
            }
          }, function(responseObj) {
            if (!responseObj.message.error) {
              table.getSessions();
            }
          });
        };
        this.addHandler(fn, this.rootElement);
      },
      getSessionInfo: function() {
        let _this = this;
        let id = this.parentNode.id.split('qewd-show-')[1];
        let cardBody = this.getComponentByName('adminui-content-card-body', 'qewd-session-data');

        let fn = function() {
          let viewer = cardBody.querySelector('adminui-jsdb-viewer');
          let card = cardBody.getParentComponent({match: 'adminui-content-card'});
          card.show();
          if (viewer) {
            viewer.remove();
          }
          let newViewer = {
            componentName: 'adminui-jsdb-viewer',
            state: {
              // set state for hook!
              sessionId: id,
              contentCard: card
            },
            hooks: ['initialise']
          };
          webComponents.loadGroup(newViewer, cardBody, _this.context);
        }
        this.addHandler(fn, this.rootElement);
      }
    },
    'adminui-table': {
      getSessions: function() {
        let table = this;
        table.getSessions = function() {
          QEWD.send({
            type: 'getSessions'
          }, function(responseObj) {
            let data = [];
            responseObj.message.sessions.forEach(function(session) {
              let row = [
                {value: session.id},
                {value: session.application},
                {value: new Date(session.expiry * 1000).toLocaleString()},
                {value: ''},
                {value: ''},
              ];
              data.push(row);
            });
            table.setState({data: data});

            // add buttons to cells 3 and 4

            table.cell.forEach(function(row, index) {
              let td = row[3];
              td.id = 'qewd-show-' + responseObj.message.sessions[index].token;
              webComponents.loadGroup(showSessionBtn, td, table.context);
              if (!responseObj.message.sessions[index].disabled) {
                // cant delete own session!
                td = row[4];
                td.id = 'qewd-del-' + responseObj.message.sessions[index].token;
                webComponents.loadGroup(stopSessionBtn, td, table.context);
              }
            });
          });
        };
        table.getSessions();
      }
    },
    'adminui-jsdb-viewer': {
      initialise: function(state) {
        let viewer = this;
        let getJSdbData = function(documentName, path, callback) {
          QEWD.send({
            type: 'getJSdbData',
            documentName: documentName,
            path: path
          }, function(responseObj) {
            callback(responseObj);
          });
        };

        QEWD.send({
          type: 'getSessionData',
          params: {
            token: state.sessionId
          }
        }, function(responseObj) {
          if (!responseObj.message.error) {
            state.contentCard.header.setState({title: 'QEWD Session ' + responseObj.message.id});
            viewer.setState({
              initial: {
                topOfDocument: false,
                documentName: 'qs',
                data: responseObj.message.results,
                getJSdbData: getJSdbData
              }
            });
          }
        });
      }
    }
  };

  return {component, hooks};

};
