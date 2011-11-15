var consts = require("./const.js");

process.on("message", function(msg) {
	if(msg && msg.type) {
		checkNetWork(msg);
	}
});

function checkNetWork(task) {
	if(task.type) {
		switch(task.type) {
			case consts.TASK_START:
				console.log("Start task.");
				break;
			case consts.TASK_STOP:
				console.log("Stop task.");
				break;
			default:
				break;
		}
	} else {
		console.log("Receive chuncked data.", task);
	}
}

process.send({type: "GOING"});
