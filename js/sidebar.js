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
      componentName: 'adminui-sidebar-nav-item',
      state: {
        title: 'QEWD JSdb Inspector',
        icon: 'sitemap',
        contentPage: 'd3'
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
