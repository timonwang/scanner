var consts = require("./const.js");
var cp = require("child_process");
var tasks = [];
var taskIndex = 0;
var taskRunning = 0;

process.on("message", function(msg) {
	if(msg && msg.type) {
		checkNetWork(msg);
	}
});
function checkNetWork(task) {
	if(task.type) {
		switch(task.type) {
			case consts.TASK_START:
				if(task.data) {
					startTask(task.data);
					console.log("Start task, parse the target, start each host one by one.");
				} else {
					console.log("Task param error, no target data specified.");
				}
				break;
			case consts.TASK_STOP:
				console.log("Stop task, and do the clean job");
				process.send({
					type : consts.TASK_FINISHED
				});
				break;
			default:
				break;
		}
	} else {
		console.log("Receive chuncked data.", task);
	}
}

function startTask(data) {
	var target = data.target || "";
	if(target) {
		// First implment is with process, it's conmulication modle is simple, consider use process pool or other modle for preformance reseaon.
		var hostStrs = getHostStrs(target);
		for(var i = hostStrs.length - 1; i >= 0; i--) {
			forkNewHost(hostStrs[i]);
		}
	}
}

function getHostStrs(target) {
	var result = [];
	target = target.replace(/[^\d\.-\/\;]/ig, '');
	var hosts = target.split(";");
	if(hosts.length > 1) {
		for(var i = hosts.length - 1; i >= 0; i--) {
			if(hosts[i].match(/(\d{1,3}\.){3}(\d{1,3})/ig)) {
				result.push(hosts[i]);
			} else if(hosts[i].indexOf('/') != -1) {
			} else if(hosts[i].indexOf('-') != -1) {
			}
		}
	} else {
		result.push(hosts);
	}
	return result;
}

function forkNewHost(host) {
	var task = cp.fork(__dirname + "/host.js", [host, taskIndex]);
	taskRunning++;
	tasks[taskIndex++] = task;
	task.on('message', taskMesage);
}

function taskMesage(msg, handle) {
	if(msg && msg.type) {
		switch(msg.type) {
			case consts.HOST_CTL:
				if(msg.data.type == consts.HOST_FINISHED) {
					console.log('Process: [' + msg.data.value + '] is finished its work.');
					taskRunning--;
					if(taskRunning == 0) {
						taskEnd();
					}
				}
				break;
			case consts.HOST_DATA:
				break;
			default:
				break;
		}
	}
}

function taskEnd() {
	process.send({
		type : consts.TASK_FINISHED
	});
}