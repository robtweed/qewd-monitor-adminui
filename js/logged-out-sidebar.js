export function define_logged_out_sidebar() {

  let component = [
    {
      componentName: 'adminui-sidebar-divider',
    },
    {
      componentName: 'adminui-sidebar-nav-item',
      state: {
        title: 'Login',
        icon: 'power-off'
      },
      hooks: ['login']
    }
  ];

  let hooks = {
    'adminui-sidebar-nav-item': {
      login: function() {
        let fn = function() {
          console.log(111111);
          location.reload();
        };
        this.addHandler(fn, this.aTag);
      }
    }
  }

  return {component, hooks};

};
