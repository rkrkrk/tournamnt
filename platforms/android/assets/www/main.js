var roundrobin = require('roundrobin');
console.log('Roundrobin ', roundrobin(4));

angular.module('tournament').constant('Roundrobin', roundrobin )