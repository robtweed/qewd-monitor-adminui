export function define_initial_sidebar() {

  let component = {
    componentName: 'adminui-sidebar-brand',
    state: {
      title: 'QEWD Monitor',
      //icon: 'tachometer-alt',
      contentPage: 'dashboard',
      image: {
        src: '/adminui-qm/Qewd_symbol_only.png',
        height: '40px',
        width: '40px'
      }
    }
  };

  return {component};
};
