(function () {
  class GanttSegment {
    constructor(pid, start, end) {
      this.pid = pid;
      this.start = start;
      this.end = end;
    }

    get duration() {
      return this.end - this.start;
    }
  }

  window.GanttSegment = GanttSegment;
})();
