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

  function pickProcess(processes, time) {
    return processes
      .filter((process) => process.arrivalTime <= time && process.remainingTime > 0)
      .sort(
        (a, b) =>
          a.remainingTime - b.remainingTime ||
          a.arrivalTime - b.arrivalTime ||
          a.originalIndex - b.originalIndex
      )[0];
  }

  function findNextArrival(processes, time) {
    const futureArrivals = processes
      .filter((process) => process.arrivalTime > time && process.remainingTime > 0)
      .map((process) => process.arrivalTime);

    return futureArrivals.length ? Math.min(...futureArrivals) : time;
  }

  function scheduleSJFPreemptive(inputProcesses) {
    const processes = inputProcesses
      .map((process) => process.clone())
      .sort((a, b) => a.arrivalTime - b.arrivalTime || a.originalIndex - b.originalIndex);
    const segments = [];
    let time = 0;
    let completedCount = 0;

    while (completedCount < processes.length) {
      const current = pickProcess(processes, time);

      if (!current) {
        const nextArrival = findNextArrival(processes, time);
        if (time < nextArrival) {
          addSegment(segments, "Idle", time, nextArrival);
          time = nextArrival;
        } else {
          time += 1;
        }
        continue;
      }

      if (current.firstResponseTime === null) {
        current.firstResponseTime = time;
      }

      const start = time;
      time += 1;
      current.remainingTime -= 1;
      addSegment(segments, current.pid, start, time);

      if (current.remainingTime === 0) {
        current.completionTime = time;
        completedCount += 1;
      }
    }

    const metrics = window.SchedulingMetrics.calculateMetrics(processes);
    return new window.SchedulingResult(
      "SJF Preemptive (SRTF)",
      metrics.processes,
      segments,
      metrics.averages,
      "Always selects the arrived unfinished process with the shortest remaining time and may preempt the running process."
    );
  }

  window.scheduleSJFPreemptive = scheduleSJFPreemptive;
  window.scheduleSRTF = scheduleSJFPreemptive;
})();
