var cp = require("child_process");
var consts = require("./const.js");
var task = cp.fork(__dirname + "/task.js");

task.on('message', function (msg) {
	recordTaskData(msg);
});

task.send({
	type: consts.TASK_START,
	data: {
		target: "10.101.0.1;10.101.0.2;++", //Scan target
		params: {} // The task params
	}
});

function recordTaskData(taskData) {
	if (taskData && taskData.type) {
		switch (taskData.type) {
			case consts.TASK_FINISHED:
				task.kill();
				break;
			default:
				console.log("Issue command from child.");
				break;
		}
	}
}