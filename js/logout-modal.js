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

export function define_logout_modal(QEWD) {

  let component = {
    componentName: 'adminui-modal-root',
    state: {
      name: 'modal-logout'
    },
    children: [
      {
        componentName: 'adminui-modal-header',
        state: {
          title: 'Logout'
        },
        children: [
          {
            componentName: 'adminui-modal-close-button',
          }
        ]
      },
      {
        componentName: 'adminui-modal-body',
        state: {
          text: 'Are you sure you want to logout?'
        }
      },
      {
        componentName: 'adminui-modal-footer',
        children: [
          {
            componentName: 'adminui-modal-cancel-button',
          },
          {
            componentName: 'adminui-button',
            state: {
              text: 'Logout',
              colour: 'danger',
              cls: 'btn-block'
            },
            hooks: ['logout']
          }
        ]
      }
    ]
  };

  QEWD.on('socketDisconnected', function() {
    toastr.warning('WebSocket disconnected');
  });

  let hooks = {
    'adminui-button': {
      logout: function() {
        let fn = function() { 
          QEWD.send({
            type: 'logout'
          }, function(responseObj) {
            toastr.warning('You have successfully logged out');
            QEWD.disconnectSocket();
            setTimeout(function() {
              location.reload();
            }, 3000);
          });
        };
        this.addHandler(fn);
      }
    }
  };

  return {component, hooks};
}
