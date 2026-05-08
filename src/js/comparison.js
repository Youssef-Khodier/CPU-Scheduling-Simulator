(function () {
  function metricWinners(results, metricKey) {
    const bestValue = Math.min(...results.map((result) => result[metricKey]));
    return results
      .filter((result) => result[metricKey] === bestValue)
      .map((result) => result.algorithmName);
  }

  function formatWinner(winners) {
    return winners.length > 1 ? `Tie: ${winners.join(", ")}` : winners[0];
  }

  function winnerClass(winners, target) {
    return winners.includes(target) ? "better-cell" : "";
  }

  function buildConclusion(results) {
    const waitWinner = formatWinner(metricWinners(results, "averageWaitingTime"));
    const turnaroundWinner = formatWinner(metricWinners(results, "averageTurnaroundTime"));
    const responseWinner = formatWinner(metricWinners(results, "averageResponseTime"));

    return `
      <div class="conclusion">
        <p>
          Lowest Average WT: ${waitWinner}. Lowest Average TAT: ${turnaroundWinner}. Lowest Average RT:
          ${responseWinner}.
        </p>
        <p>
          Round Robin (RR) is generally fair because it gives repeated CPU access using the time quantum.
          SJF Non-Preemptive can reduce waiting time, but it does not interrupt a running long job.
          SJF Preemptive (SRTF) can improve waiting and turnaround time for short jobs because it can
          preempt long jobs, but long jobs may be delayed and starvation is possible. Round Robin
          performance depends strongly on the selected quantum.
        </p>
      </div>
    `;
  }

  function renderComparison(rrResult, sjfNonPreemptiveResult, sjfPreemptiveResult) {
    const results = [rrResult, sjfNonPreemptiveResult, sjfPreemptiveResult];
    const rows = [
      {
        label: "Average Waiting Time",
        metricKey: "averageWaitingTime",
      },
      {
        label: "Average Turnaround Time",
        metricKey: "averageTurnaroundTime",
      },
      {
        label: "Average Response Time",
        metricKey: "averageResponseTime",
      },
    ];

    const tableRows = rows
      .map((row) => {
        const winners = metricWinners(results, row.metricKey);

        return `
          <tr>
            <td>${row.label}</td>
            <td class="${winnerClass(winners, rrResult.algorithmName)}">${window.SchedulingMetrics.formatNumber(
          rrResult[row.metricKey]
        )}</td>
            <td class="${winnerClass(winners, sjfNonPreemptiveResult.algorithmName)}">${window.SchedulingMetrics.formatNumber(
          sjfNonPreemptiveResult[row.metricKey]
        )}</td>
            <td class="${winnerClass(winners, sjfPreemptiveResult.algorithmName)}">${window.SchedulingMetrics.formatNumber(
          sjfPreemptiveResult[row.metricKey]
        )}</td>
            <td>${formatWinner(winners)}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <div class="result-stack">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Round Robin (RR)</th>
                <th>SJF Non-Preemptive</th>
                <th>SJF Preemptive (SRTF)</th>
                <th>Best Algorithm</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
        ${buildConclusion(results)}
      </div>
    `;
  }

  window.ComparisonRenderer = {
    renderComparison,
  };
})();
