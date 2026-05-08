(function () {
  class SchedulingResult {
    constructor(algorithmName, processes, ganttSegments, averages, algorithmDescription) {
      this.algorithmName = algorithmName;
      this.processes = processes;
      this.ganttSegments = ganttSegments;
      this.averageWaitingTime = averages.averageWaitingTime;
      this.averageTurnaroundTime = averages.averageTurnaroundTime;
      this.averageResponseTime = averages.averageResponseTime;
      this.algorithmDescription = algorithmDescription || "";
    }
  }

  window.SchedulingResult = SchedulingResult;
})();
