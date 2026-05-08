(function () {
  function calculateMetrics(processes) {
    const completed = processes.map((process) => {
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      process.responseTime = process.firstResponseTime - process.arrivalTime;
      return process;
    });

    const totals = completed.reduce(
      (accumulator, process) => {
        accumulator.waiting += process.waitingTime;
        accumulator.turnaround += process.turnaroundTime;
        accumulator.response += process.responseTime;
        return accumulator;
      },
      { waiting: 0, turnaround: 0, response: 0 }
    );

    const count = completed.length || 1;

    return {
      processes: completed.sort((a, b) => a.originalIndex - b.originalIndex),
      averages: {
        averageWaitingTime: totals.waiting / count,
        averageTurnaroundTime: totals.turnaround / count,
        averageResponseTime: totals.response / count,
      },
    };
  }

  function formatNumber(value) {
    return Number(value).toFixed(2);
  }

  window.SchedulingMetrics = {
    calculateMetrics,
    formatNumber,
  };
})();
