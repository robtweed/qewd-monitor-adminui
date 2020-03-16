export function define_about_page(QEWD) {

  let component = {
    componentName: 'adminui-content-page',
    state: {
      name: 'about'
    },
    children: [
      {
        componentName: 'adminui-content-page-header',
        state: {
          title: 'About Your QEWD Configuration'
        }
      },
      {
        componentName: 'adminui-content-card',
        state: {
          title_colour: 'info',
          name: 'about-card'
        },
        children: [
          {
            componentName: 'adminui-content-card-header',
            hooks: ['getServerName']
          },      
          {
            componentName: 'adminui-content-card-body',
            children: [
              {
                componentName: 'adminui-table',
                state: {
                  striped: true,
                  headers: ['Module', 'Version']
                },
                hooks: ['getBuildDetails']
              }
            ]
          }
        ]
      }
    ]
  };

  let hooks = {
    'adminui-content-card-header': {
      getServerName: function() {
        let header = this;
        QEWD.send({
          type: 'getServerName'
        }, function(responseObj) {
          header.setState({title: 'Server Name: ' + responseObj.message.serverName});
        });
      }
    },
    'adminui-table': {
      getBuildDetails: function() {
        let table = this;
        QEWD.send({
          type: 'getBuildDetails'
        }, function(responseObj) {
          let info = responseObj.message;
          let pcs = info.dbInterface.split('; ');
          let data = [
            [{value: 'Node.js Environment'}, {value: info.nodejsBuild}],
            [{value: 'Database Interface'}, {value: pcs[0]}],
            [{value: 'Database'}, {value: pcs[1]}],
            [{value: 'QEWD'}, {value: info.xpressBuild.no + ' (' + info.xpressBuild.date + ')'}],
            [{value: 'ewd-qoper8'}, {value: info.qoper8Build.no + ' (' + info.qoper8Build.date + ')'}],
            [{value: 'ewd-document-store'}, {value: info.docStoreBuild.no + ' (' + info.docStoreBuild.date + ')'}],
            [{value: 'ewd-qoper8-express'}, {value: info.qxBuild}]
          ];
          table.setState({data: data});
        });
      }
    }
  };

  return {component, hooks};
};

