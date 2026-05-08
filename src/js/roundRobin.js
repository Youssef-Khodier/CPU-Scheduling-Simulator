(function () {
  function addSegment(segments, pid, start, end) {
    if (start === end) {
      return;
    }

    const last = segments[segments.length - 1];
    if (last && last.pid === pid && last.end === start) {
      last.end = end;
      return;
    }

    segments.push(new window.GanttSegment(pid, start, end));
  }

  function scheduleRoundRobin(inputProcesses, quantum) {
    const processes = inputProcesses
      .map((process) => process.clone())
      .sort((a, b) => a.arrivalTime - b.arrivalTime || a.originalIndex - b.originalIndex);
    const readyQueue = [];
    const segments = [];
    let time = 0;
    let nextArrivalIndex = 0;
    let completedCount = 0;

    function enqueueArrivalsUpTo(currentTime) {
      while (nextArrivalIndex < processes.length && processes[nextArrivalIndex].arrivalTime <= currentTime) {
        readyQueue.push(processes[nextArrivalIndex]);
        nextArrivalIndex += 1;
      }
    }

    enqueueArrivalsUpTo(time);

    while (completedCount < processes.length) {
      if (readyQueue.length === 0) {
        const nextProcess = processes[nextArrivalIndex];
        if (nextProcess && time < nextProcess.arrivalTime) {
          addSegment(segments, "Idle", time, nextProcess.arrivalTime);
          time = nextProcess.arrivalTime;
        }
        enqueueArrivalsUpTo(time);
        continue;
      }

      const current = readyQueue.shift();
      if (current.firstResponseTime === null) {
        current.firstResponseTime = time;
      }

      const start = time;
      const runDuration = Math.min(quantum, current.remainingTime);
      time += runDuration;
      current.remainingTime -= runDuration;
      addSegment(segments, current.pid, start, time);

      enqueueArrivalsUpTo(time);

      if (current.remainingTime > 0) {
        readyQueue.push(current);
      } else {
        current.completionTime = time;
        completedCount += 1;
      }
    }

    const metrics = window.SchedulingMetrics.calculateMetrics(processes);
    return new window.SchedulingResult(
      "Round Robin (RR)",
      metrics.processes,
      segments,
      metrics.averages,
      "Uses a FIFO ready queue and the selected time quantum to give each ready process repeated CPU access."
    );
  }

  window.scheduleRoundRobin = scheduleRoundRobin;
})();
