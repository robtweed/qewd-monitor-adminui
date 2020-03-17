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

export function define_jsdb_page(QEWD, webComponents) {

  let component = {
    componentName: 'adminui-content-page',
    state: {
      name: 'jsdb'
    },
    children: [
      {
        componentName: 'adminui-content-page-header',
        state: {
          title: 'QEWD JSdb Explorer'
        }
      },
      {
        componentName: 'adminui-content-card',
        state: {
          title_colour: 'info',
          name: 'jsdb-card'
        },
        children: [
          {
            componentName: 'adminui-content-card-header',
            children: [
              {
                componentName: 'adminui-content-card-button-title',
                state: {
                  title: 'Persistent JSON Documents',
                  title_colour: 'info',
                  icon: 'redo',
                  buttonColour: 'success'
                },
                hooks: ['refresh']
              }
            ]
          },
          {
            componentName: 'adminui-content-card-body',
            children: [
              {
                componentName: 'adminui-jsdb-viewer',
                hooks: ['jsdbInitialise']
              }
            ]
          }
        ]
      }
    ]
  };

  let hooks = {
    'adminui-content-card-button-title': {
      refresh: function() {
        let _this = this;
        let fn = function() {
          let viewer = document.getElementsByTagName('adminui-jsdb-viewer')[0];
          let body = viewer.getParentComponent({match: 'adminui-content-card-body'});
          viewer.remove();
          let newViewer = {
            componentName: 'adminui-jsdb-viewer',
            hooks: ['jsdbInitialise']
          };
          webComponents.loadGroup(newViewer, body, _this.context);
        };
        this.addHandler(fn, this.button);
      }
    },
    'adminui-jsdb-viewer': {
      jsdbInitialise: function() {
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
          type: 'getJSdbData',
        }, function(responseObj) {
          viewer.setState({
            initial: {
              data: responseObj.message.results,
              getJSdbData: getJSdbData
            }
          });
        });
      }
    }
  };

  return {component, hooks};
};
