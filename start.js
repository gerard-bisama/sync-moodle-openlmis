const forever = require('forever-monitor');
const moment = require('moment')

  var child = new (forever.Monitor)('syncdata.js', {
    append: true,
    max:5,
    silent: false,    
    logFile:"/home/server-hit/forever_syncmoodle_openlmis.log",
    outFile: "/home/server-hit/out_syncmoodle_openlmis.log",
    errFile: "/home/server-hit/err_syncmoodle_openlmis.log",
    command: 'node --max_old_space_size=2000',
    args: []
  });

  child.on('restart', function () {
    console.log('syncdata.js has been started on port 8084');
  });

  child.on('exit', function () {
    console.log('Exchange js has stoped');
  });

  child.start();
