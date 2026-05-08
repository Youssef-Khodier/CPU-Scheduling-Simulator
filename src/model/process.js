(function () {
  class Process {
    constructor(pid, arrivalTime, burstTime, originalIndex) {
      this.pid = String(pid).trim();
      this.arrivalTime = Number(arrivalTime);
      this.burstTime = Number(burstTime);
      this.remainingTime = Number(burstTime);
      this.completionTime = null;
      this.firstResponseTime = null;
      this.originalIndex = originalIndex;
      this.turnaroundTime = null;
      this.waitingTime = null;
      this.responseTime = null;
    }

    clone() {
      return new Process(this.pid, this.arrivalTime, this.burstTime, this.originalIndex);
    }
  }

  window.ProcessModel = Process;
})();
