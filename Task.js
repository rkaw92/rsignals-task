if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([ 'rsignals' ], function(rsignals) {
	return function Task(taskFunction) {
		if (!(this instanceof Task)) {
			return new Task(taskFunction);
		}
		
		function runTask(parameters) {
			try {
				var taskResult = taskFunction(parameters);
				//TODO: Might want to replace the below check with a proper Promise.isPromiseLike (or when.isPromiseLike?) call.
				//TODO: Should we be using .done() instead of then() for performance and semantic correctness?
				if (taskResult && typeof(taskResult) === 'object' && typeof(taskResult.then) === 'function') {
					taskResult.then(runTask.finished, runTask.failed);
				}
				else {
					runTask.finished(taskResult);
				}
			}
			catch(taskExecutionError) {
				runTask.failed(taskExecutionError);
			}
		};
		
		runTask.finished = rsignals.Signal('finished');
		runTask.failed = rsignals.Signal('failed');
		
		return runTask;
	};
});
