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

export function define_processes_page(QEWD, webComponents) {

  let component = {
    componentName: 'adminui-content-page',
    state: {
      name: 'processes'
    },
    children: [
      {
        componentName: 'adminui-content-page-header',
        state: {
          title: 'QEWD Processes'
        }
      },
      {
        componentName: 'adminui-row',
        children: [
          {
            componentName: 'adminui-content-card',
            children: [
              {
                componentName: 'adminui-content-card-header',
                children: [
                  {
                    componentName: 'adminui-content-card-button-title',
                    state: {
                      title: 'Master Process',
                      title_colour: 'info',
                      icon: 'power-off',
                      buttonColour: 'danger',
                      tooltip: 'Shutdown QEWD'
                    },
                    hooks: ['shutdown']
                  }
                ]
              },
              {
                componentName: 'adminui-content-card-body',
                children: [
                  {
                    componentName: 'adminui-table',
                    hooks: ['getMasterProcessDetails']
                  }
                ]
              }
            ]
          },
          {
            componentName: 'adminui-content-card',
            state: {
              name: 'worker-process-card'
            },
            children: [
              {
                componentName: 'adminui-content-card-header',
                state: {
                  title: 'Worker Processes',
                  title_colour: 'info'
                }
              },
              {
                componentName: 'adminui-content-card-body',
                children: [
                  {
                    componentName: 'adminui-form',
                    children: [
                      {
                        componentName: 'adminui-row',
                        children: [
                          {
                            componentName: 'adminui-col',
                            state: {
                              text: 'Worker Pool Size: ',
                              cls: 'text-gray-900'
                            }
                          },
                          {
                            componentName: 'adminui-col',
                            children: [
                              {
                                componentName: 'adminui-form-input-spinner',
                                state: {
                                  name: 'poolsize',
                                  value: 5,
                                  min: 1,
                                  max: 20,
                                  step: 1,
                                  label: false            
                                },
                                hooks: ['setPoolSize']
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    componentName: 'adminui-div'
                  },
                  {
                    componentName: 'adminui-table',
                    state: {
                      headers: ['PID', 'Requests', 'Available', 'Memory', 'Stop'],
                    },
                    hooks: ['getWorkerProcessDetails']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  let stopWorkerBtn = {
    componentName: 'adminui-button',
    state: {
      icon: 'power-off',
      colour: 'danger'
    },
    hooks: ['stopWorker']
  };

  let hooks = {
    'adminui-form-input-spinner': {
      setPoolSize: function() {
        let _this = this;
        let fn = function() {
          QEWD.send({
            type: 'setPoolSize',
            poolSize: _this.inputTag.value
          }, function(responseObj) {
          });
        };
        this.addHandler(fn, this.inputTag, 'change');
      }
    },
    'adminui-button': {
      stopWorker: function() {
        let _this = this;
        let pid = this.parentNode.id.split('-')[1];
        let table = this.getParentComponent({match: 'adminui-table'});
        let fn = function() {
          QEWD.send({
            type: 'stopWorkerProcess',
            pid: pid
          }, function(responseObj) {
            table.getDetails();
          });
        };
        this.addHandler(fn, this.rootElement);
      }
    },
    'adminui-content-card-button-title': {
      shutdown: function() {
         let _this = this;
        let fn = function() {
          QEWD.send({
            type: 'stopMasterProcess'
          }, function(responseObj) {
            if (responseObj.message.masterProcessStopping) {
              toastr.error('QEWD has been shut down');
              $('#' + _this.button.id).tooltip('dispose');
              _this.context.loadLoggedOutView();
            }
          });
        };
        this.addHandler(fn, this.button);
      }
    },
    'adminui-table': {
      getMasterProcessDetails: function() {
        let table = this;
        table.getDetails = function() {
          QEWD.send({
            type: 'getMasterProcessInfo'
          }, function(responseObj) {
            let info = responseObj.message.info;
            let data = [
              [{value: 'Process Id (pid):'}, {value: info.pid}],
              [{value: 'Started:'}, {value: info.startTime}],
              [{value: 'Up Time:'}, {value: info.upTime}],
              [{value: 'Memory', colspan: 2, cls: 'font-weight-bold text-warning'}],
              [{value: 'rss:'}, {value: info.memory.rss}],
              [{value: 'heapTotal:'}, {value: info.memory.heapTotal}],
              [{value: 'heapUsed'}, {value: info.memory.heapUsed}]
            ];
            table.setState({data: data});
          });
        }
        table.timer = setInterval(function() {
          table.getDetails();
        }, 30000);
        let stopTimer = function() {
          console.log('stopping getDetails timer in processes component');
          clearInterval(table.timer);
        };
        // make sure the timer is cleared if the component is unloaded
        table.registerUnloadMethod(stopTimer);
        table.getDetails();
      },
      getWorkerProcessDetails: function() {
        let table = this;
        let loaded = false;
        table.getDetails = function() {
          QEWD.send({
            type: 'getWorkerProcessInfo'
          }, function(responseObj) {
              let data = [];
              responseObj.results.forEach(function(result) {
                  let memory = '<span class="text-xs text-gray-900">';
                  memory = memory + 'rss: ' + result.memory.rss + '<br>';
                  memory = memory + 'heapTotal: ' + result.memory.heapTotal + '<br>';
                  memory = memory + 'heapUsed: ' + result.memory.heapUsed;
                  memory = memory + '</span>'; 
                  let row = [
                    {value: result.pid},
                    {value: result.noOfMessages},
                    {value: result.available},
                    {html: memory},
                    {value: ''},
                  ];
                  data.push(row);
              });
              table.setState({data: data});
              table.cell.forEach(function(row, index) {
                let td = row[4];
                td.id = 'pid-' + responseObj.results[index].pid;
                webComponents.loadGroup(stopWorkerBtn, td, table.context);
              });
            
          });
        };
        table.timer = setInterval(function() {
          table.getDetails();
        }, 20000);
        let stopTimer = function() {
          console.log('stopping getDetails timer in processes component');
          clearInterval(table.timer);
        };
        // make sure the timer is cleared if the component is unloaded
        table.registerUnloadMethod(stopTimer);
        table.getDetails();
      }
    }
  };

  return {component, hooks};

};
