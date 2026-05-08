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

  function pickProcess(processes, time, completedProcesses) {
    return processes
      .filter((process) => process.arrivalTime <= time && !completedProcesses.has(process))
      .sort(
        (a, b) =>
          a.burstTime - b.burstTime ||
          a.arrivalTime - b.arrivalTime ||
          a.originalIndex - b.originalIndex
      )[0];
  }

  function scheduleSJFNonPreemptive(inputProcesses) {
    const processes = inputProcesses
      .map((process) => process.clone())
      .sort((a, b) => a.arrivalTime - b.arrivalTime || a.originalIndex - b.originalIndex);
    const segments = [];
    const completedProcesses = new Set();
    let time = 0;

    while (completedProcesses.size < processes.length) {
      const current = pickProcess(processes, time, completedProcesses);

      if (!current) {
        const nextArrival = Math.min(
          ...processes.filter((process) => !completedProcesses.has(process)).map((process) => process.arrivalTime)
        );
        if (time < nextArrival) {
          addSegment(segments, "Idle", time, nextArrival);
        }
        time = nextArrival;
        continue;
      }

      const start = time;
      const end = start + current.burstTime;
      current.firstResponseTime = start;
      current.remainingTime = 0;
      current.completionTime = end;
      time = end;
      addSegment(segments, current.pid, start, time);
      completedProcesses.add(current);
    }

    const metrics = window.SchedulingMetrics.calculateMetrics(processes);
    return new window.SchedulingResult(
      "SJF Non-Preemptive",
      metrics.processes,
      segments,
      metrics.averages,
      "Selects the shortest arrived process only when the CPU becomes free, then runs that process until completion."
    );
  }

  window.scheduleSJFNonPreemptive = scheduleSJFNonPreemptive;
  window.scheduleSJF = scheduleSJFNonPreemptive;
})();
