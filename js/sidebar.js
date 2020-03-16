export function define_sidebar() {

  let component = [
    {
      componentName: 'adminui-sidebar-divider',
      state: {
        isTop: true
      }
    },
    {
      componentName: 'adminui-sidebar-nav-item',
      state: {
        title: 'About',
        icon: 'info',
        contentPage: 'about',
        active: true
      }
    },
    {
      componentName: 'adminui-sidebar-divider'
    },
    {
      componentName: 'adminui-sidebar-nav-item',
      state: {
        title: 'Processes',
        icon: 'microchip',
        contentPage: 'processes'
      }
    },
    {
      componentName: 'adminui-sidebar-divider'
    },
    {
      componentName: 'adminui-sidebar-nav-item',
      state: {
        title: 'QEWD JSdb',
        icon: 'sitemap',
        contentPage: 'jsdb'
      }
    },
    {
      componentName: 'adminui-sidebar-divider'
    },
    {
      componentName: 'adminui-sidebar-nav-item',
      state: {
        title: 'QEWD Sessions',
        icon: 'user-cog',
        contentPage: 'sessions'
      }
    },
    {
      componentName: 'adminui-sidebar-divider',
    },
    {
      componentName: 'adminui-sidebar-nav-item',
      state: {
        title: 'Logout',
        icon: 'power-off',
        use_modal: 'modal-logout'
      }
    },
    {
      componentName: 'adminui-sidebar-divider',
    },
    {
      componentName: 'adminui-sidebar-toggler',
    }
  ];

  return {component};

};
