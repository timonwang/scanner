var consts = require("./const.js");
if (process.argv.length < 3 && !(typeof process.argv[3] === 'number')) {
	console.log("Args for a task is error.");
	taskEnd();
}
var target = process.argv[2];
console.log("Start to check host:[" + target + "]");

function taskEnd() {
	process.send({
		type: consts.HOST_CTL,
		data: {
			type: consts.HOST_FINISHED,
			value: process.argv[3]
		}
	});
}

var time = Math.floor(Math.random() * 20000);
setTimeout(function () {
	console.log(time);
	taskEnd();
}, time);
