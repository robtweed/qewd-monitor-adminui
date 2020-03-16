export function define_login_modal(QEWD) {

  //          **** login modal ****

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
          console.log(e);
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

