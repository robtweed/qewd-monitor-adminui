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
