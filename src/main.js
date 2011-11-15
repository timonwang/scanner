var cp = require("child_process");
var consts = require("./const.js");
var task = cp.fork(__dirname + "/task.js");

task.on('message', function(msg) {
	recordTaskData(msg);
});

task.send({
	type : consts.TASK_START
});

function recordTaskData(taskData) {
	if(taskData && taskData.type) {
		task.send({
			type : consts.TASK_STOP
		});
	}
}