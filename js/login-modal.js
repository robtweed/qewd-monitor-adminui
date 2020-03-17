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

export function define_login_modal(QEWD) {

  let component = {
    componentName: 'adminui-modal-root',
    state: {
      name: 'modal-login',
      static: true
    },
    children: [
      {
        componentName: 'adminui-modal-header',
        state: {
          title: 'Login'
        }
      },
      {
        componentName: 'adminui-modal-body',
        children: [
          {
            componentName: 'adminui-form',
            state: {
              name: 'loginForm',
              cls: 'user'
            },
            children: [
              {
                componentName: 'adminui-form-field',
                state: {
                  type: 'password',
                  label: 'QEWD Management Password:',
                  placeholder: false,
                  name: 'password',
                  focus: true
                }
              }
            ]
          }
        ]
      },
      {
        componentName: 'adminui-modal-footer',
        children: [
          {
            componentName: 'adminui-button',
            state: {
              text: 'Login',
              colour: 'success',
              cls: 'btn-block'
            },
            hooks: ['login']
          }
        ]
      }
    ]
  };

  let hooks = {
    'adminui-button': {
      login: function() {
        let modal = this.getParentComponent({match: 'adminui-modal-root'});
        let _this = this;

        let kpfn =  function(e){
          if(e.which == 13) {
            e.preventDefault();
            // click the button to submit the form
            _this.rootElement.focus();
            _this.rootElement.click();
          }
        };

        modal.addHandler(kpfn, 'keypress');

        let fn = function() {
          let form = _this.getComponentByName('adminui-form', 'loginForm');
          QEWD.send({
            type: 'login',
            params: form.fieldValues
          }, function(responseObj) {
            if (responseObj.message.error) {
              toastr.error('Invalid login attempt');
            }
            else {
              let modal = _this.getComponentByName('adminui-modal-root', 'modal-login');
              modal.hide();
              modal.remove();
              _this.context.loadMainView();
            }
          });
        };
        this.addHandler(fn);
      }
    }
  };

  return {component, hooks};

};
