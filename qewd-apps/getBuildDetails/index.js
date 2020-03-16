module.exports = function(messageObj, session, send, finished) {
      if (session.authenticated) {
        var webServer = this.userDefined.config.webServer || 'Express.js'
        webServer = (webServer === 'koa' ? 'Koa.js' : 'Express.js');
        if (!this.userDefined.config.webSockets) {
          this.userDefined.config.webSockets = {module: 'socket.io'};
        }
        var webSockets = this.userDefined.config.webSockets.module;
        if (this.userDefined.config.webSockets.engine) {
          var engine = (this.userDefined.config.webSockets.engine === 'uws' ? 'uWebSockets' : 'ws');
          webSockets = webSockets + ' (' + engine + ')';
        }
        var buildDetails = {
          nodejsBuild: process.version + ' / ' + webServer + ' / ' + webSockets,
          dbInterface: this.db.version(),
          qoper8Build: this.build,
          docStoreBuild: this.documentStore.build,
          xpressBuild: this.xpress.build
        };
        if (this.userDefined.config && this.userDefined.config.qxBuild) {
          buildDetails.qxBuild = this.userDefined.config.qxBuild;
        }
        finished(buildDetails);
      }
      else {
        finished({error: 'Unauthenticated'});
      }
};