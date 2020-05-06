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

import {node_inspector_assembly} from '../../components/d3/components/d3-node-inspector.js';


export function define_d3_page(webComponents, QEWD) {

  let component = {
    componentName: 'adminui-content-page',
    state: {
      name: 'd3'
    },
    children: [
      {
        componentName: 'adminui-content-page-header',
        state: {
          title: 'Node Editor'
        }
      },
      {
        componentName: 'adminui-content-card',
        state: {
          name: 'editor-selector-card',
          width: '20%'
        },
        children: [
          {
            componentName: 'adminui-content-card-header',
            children: [
              {
                componentName: 'adminui-content-card-button-title',
                state: {
                  title: 'Select a Document',
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
                componentName: 'adminui-form',
                state: {
                  name: 'selectDocumentForm',
                  cls: 'user'
                },
                children: [
                  {
                    componentName: 'adminui-form-select',
                    state: {
                      label: false,
                      name: 'documentName',
                      focus: true
                    },
                    hooks: ['getDocuments'],
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        componentName: 'adminui-content-card',
        state: {
          name: 'd3-card'
        },
        children: [
          {
            componentName: 'adminui-content-card-header',
            state: {
              title: 'Node Editor Card',
              title_colour: 'warning'
            }
          },
          {
            componentName: 'adminui-content-card-body',
            state: {
              name: 'nodeInspector'
            },
            hooks: ['loadNodeInspector']
          }
        ]
      }
    ]
  };

  let hooks = {};

  hooks['adminui-content-card-button-title'] = {
    refresh: function() {
      let _this = this;
      let fn = function() {
        let select = _this.getComponentByName('adminui-form-select', 'documentName');
        select.getOptions();
      };
      this.addHandler(fn, this.button);
    }
  };

  hooks['adminui-content-card-body'] = {
    loadNodeInspector: function() {
      let state = {
        allowEdits: true
      };
      webComponents.addComponent('nodeInspector', node_inspector_assembly(QEWD, state));
      this.loadGroup(webComponents.components.nodeInspector, this.childrenTarget, this.context);
    }
  };

  hooks['adminui-form-select'] = {
    getDocuments: async function() {
      let _this = this;

      let fn = async function(e) {
        let documentName = _this.form.getFieldValue(_this.name);
        if (documentName === '!') return;
        //console.log(documentName);

        let card = _this.getComponentByName('adminui-content-card-body', 'nodeInspector');
        let d3_node = card.querySelector('d3-root');
        let d3_root = d3_node.shadowRoot.querySelector('d3-vertical-hierarchy-root');
        d3_root.clearDown();
        d3_root.getTopNode(documentName);
      };

      this.addHandler(fn, this.selectTag, 'change');

      this.getOptions = async function() {

        let responseObj = await QEWD.reply({
          type: 'getDocumentNames'
        });
        if (responseObj.message.error) {
          toastr.error(responseObj.message.error);
        }
        else {
          let options = [];
          responseObj.message.documentNames.forEach(function(name) {
            options.push({
              text: name,
              value: name
            });
          });
          options.unshift({
            text: 'Select a Document',
            value: '!'
          });
          _this.setState({options: options});
        }
      };

      this.getOptions();
    }
  };

  return {component, hooks};
};
