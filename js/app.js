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

// Change the paths below if needed

import {webComponents} from '../../mg-webComponents.js';
import {QEWD} from '../../qewd-client.js';

// import the individual component configuration files
//   they can be maintained independently as a result

import {define_login_modal} from './login-modal.js';
import {define_logout_modal} from './logout-modal.js';
import {define_initial_sidebar} from './initial-sidebar.js';
import {define_footer} from './footer.js';
import {define_topbar} from './topbar.js';

import {define_sidebar} from './sidebar.js';
import {define_about_page} from './about.js';
import {define_processes_page} from './processes.js';
import {define_jsdb_page} from './jsdb.js';
import {define_sessions_page} from './sessions.js';

import {define_logged_out_sidebar} from './logged-out-sidebar.js';

document.addEventListener('DOMContentLoaded', function() {

  QEWD.on('ewd-registered', function() {

    QEWD.log = true;

    webComponents.addComponent('login_modal', define_login_modal(QEWD));
    webComponents.addComponent('logout_modal', define_logout_modal(QEWD));
    webComponents.addComponent('initial_sidebar', define_initial_sidebar());
    webComponents.addComponent('footer', define_footer(QEWD));
    webComponents.addComponent('topbar', define_topbar());

    webComponents.addComponent('sidebar', define_sidebar());
    webComponents.addComponent('about', define_about_page(QEWD));
    webComponents.addComponent('processes', define_processes_page(QEWD, webComponents));
    webComponents.addComponent('jsdb', define_jsdb_page(QEWD, webComponents));
    webComponents.addComponent('sessions', define_sessions_page(QEWD, webComponents));

    webComponents.addComponent('logged_out_sidebar', define_logged_out_sidebar());

    // create the context for running the web components

    let context = {
      paths: {
        adminui: './components/adminui/components/'
      },
      resourcePath: '/components/adminui/',
      hooks: webComponents.hooks,
      readyEvent: new Event('ready')
    };

    // this mainview function will be used by the login hook - it will pick it up
    // from the context object

    function loadMainView() {
      let body = document.getElementsByTagName('body')[0];
      let root = webComponents.getComponentByName('adminui-root', 'root');
      let components = webComponents.components;
      webComponents.loadGroup(components.sidebar, root.sidebarTarget, context);
      webComponents.loadGroup(components.about, root.contentTarget, context);
      webComponents.loadGroup(components.logout_modal, body, context);
    }
    context.loadMainView = loadMainView;

    function loadLoggedOutView() {
      let root = webComponents.getComponentByName('adminui-root', 'root');
      let children = [...root.sidebarTarget.childNodes];
      children.forEach(function(child) {
        if (child.nodeType === 1 && child.tagName.includes('-')) {
          if (child.tagName !== 'ADMINUI-SIDEBAR-BRAND') {
            child.remove();
          }
        }
      });
      children = [...root.contentTarget.childNodes];
      children.forEach(function(child) {
        if (child.nodeType === 1 && child.tagName.includes('-')) {
          child.remove();
        }
      });
      webComponents.loadGroup(webComponents.components.logged_out_sidebar, root.sidebarTarget, context);
    }
    context.loadLoggedOutView = loadLoggedOutView;

    //webComponents.setLog(true);

    // register the content page configurations, ready for lazy loading on demand
    //  this makes them accessible via the contentPage state values (see sidebar component)

    webComponents.register('about', webComponents.components.about);
    webComponents.register('processes', webComponents.components.processes);
    webComponents.register('jsdb', webComponents.components.jsdb);
    webComponents.register('sessions', webComponents.components.sessions);

    // set up the initial display prior to login

    let body = document.getElementsByTagName('body')[0];

    // The handler below is needed to ensure that all the JS resources are loaded before attempting
    // to show the modal, since this depends on jQuery being ready

    // The ready event is dispatched by the admin-root component
    //  It is available to the admin-root component via the context object which
    //  includes the ready event object

    document.addEventListener('ready', function() {
      let modal = webComponents.getComponentByName('adminui-modal-root', 'modal-login');
      modal.show();
    });
    
    // now load up the initial view

    webComponents.load('adminui-root', body, context, function(root) {
      let components = webComponents.components;
      //root.setState({sidebar_colour: 'info'});
      webComponents.loadGroup(components.initial_sidebar, root.sidebarTarget, context);
      webComponents.loadGroup(components.login_modal, body, context);
      webComponents.loadGroup(components.footer, root.footerTarget, context);
      webComponents.loadGroup(components.topbar, root.topbarTarget, context);
    });

  });

  QEWD.start({
    application: 'qewd-monitor-adminui'
  });

});
