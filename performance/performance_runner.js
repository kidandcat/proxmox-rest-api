const spawn = require('child_process').spawn;

const SIMULTANEOUS = process.argv[2] || 1;



for (let i = 0; i < SIMULTANEOUS; i++) {
    var child = spawn('./node_modules/.bin/mocha', [
        '--reporter',
        'spec',
        '--timeout',
        '1000000',
        'performance/performance.js'
    ]);

    child.stdout.on('data', function(chunk) {
        console.log(chunk.toString('utf8'));
    });
}
