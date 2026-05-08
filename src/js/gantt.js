(function () {
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderGanttChart(segments) {
    if (!segments.length) {
      return '<p class="empty-state">No Gantt chart data available.</p>';
    }

    const palette = ["#2364d2", "#0f9f8f", "#d45d3c", "#7b55d4", "#cc8a12", "#24804d"];
    const gridTemplate = segments.map((segment) => `${segment.duration}fr`).join(" ");
    const processColors = new Map();

    const segmentHtml = segments
      .map((segment) => {
        const idleClass = segment.pid === "Idle" ? " gantt-block-idle" : "";
        if (segment.pid !== "Idle" && !processColors.has(segment.pid)) {
          processColors.set(segment.pid, palette[processColors.size % palette.length]);
        }
        const colorStyle = segment.pid === "Idle" ? "" : `background: ${processColors.get(segment.pid)};`;

        return `
          <div class="gantt-block${idleClass}" style="${colorStyle}">
            <strong>${escapeHtml(segment.pid)}</strong>
            <span>${segment.start} - ${segment.end}</span>
          </div>
        `;
      })
      .join("");

    const axisHtml = segments
      .map(
        (segment, index) => `
          <div class="gantt-axis-cell">
            ${index === 0 ? `<span class="gantt-time-start">${segment.start}</span>` : ""}
            <span class="gantt-time-end">${segment.end}</span>
          </div>
        `
      )
      .join("");

    return `
      <div class="gantt-chart" aria-label="Gantt chart">
        <div class="gantt-inner">
          <div class="gantt-track" style="grid-template-columns: ${gridTemplate};">${segmentHtml}</div>
          <div class="gantt-axis" style="grid-template-columns: ${gridTemplate};">${axisHtml}</div>
        </div>
      </div>
    `;
  }

  function renderMetricsTable(result) {
    const rows = result.processes
      .map(
        (process) => `
          <tr>
            <td>${escapeHtml(process.pid)}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
            <td>${process.completionTime}</td>
            <td>${process.turnaroundTime}</td>
            <td>${process.waitingTime}</td>
            <td>${process.responseTime}</td>
          </tr>
        `
      )
      .join("");

    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Process ID</th>
              <th>AT</th>
              <th>BT</th>
              <th>CT</th>
              <th>TAT</th>
              <th>WT</th>
              <th>RT</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  function renderAverages(result) {
    return `
      <div class="averages-grid">
        <div class="metric-card">
          <span>Average WT</span>
          <strong>${window.SchedulingMetrics.formatNumber(result.averageWaitingTime)}</strong>
        </div>
        <div class="metric-card">
          <span>Average TAT</span>
          <strong>${window.SchedulingMetrics.formatNumber(result.averageTurnaroundTime)}</strong>
        </div>
        <div class="metric-card">
          <span>Average RT</span>
          <strong>${window.SchedulingMetrics.formatNumber(result.averageResponseTime)}</strong>
        </div>
      </div>
    `;
  }

  function renderAlgorithmResult(result) {
    return `
      <div class="result-stack">
        ${
          result.algorithmDescription
            ? `<p class="algorithm-description">${escapeHtml(result.algorithmDescription)}</p>`
            : ""
        }
        <section>
          <h3>Gantt Chart</h3>
          ${renderGanttChart(result.ganttSegments)}
        </section>
        <section>
          <h3>Per-Process Metrics</h3>
          ${renderMetricsTable(result)}
        </section>
        <section>
          <h3>Averages</h3>
          ${renderAverages(result)}
        </section>
      </div>
    `;
  }

  window.GanttRenderer = {
    escapeHtml,
    renderAlgorithmResult,
    renderGanttChart,
  };
})();
