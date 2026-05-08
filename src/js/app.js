(function () {
  const processForm = document.getElementById("processForm");
  const pidInput = document.getElementById("pidInput");
  const arrivalInput = document.getElementById("arrivalInput");
  const burstInput = document.getElementById("burstInput");
  const quantumInput = document.getElementById("quantumInput");
  const processTableBody = document.getElementById("processTableBody");
  const messageBox = document.getElementById("messageBox");
  const rrResults = document.getElementById("rrResults");
  const sjfNonPreemptiveResults = document.getElementById("sjfNonPreemptiveResults");
  const sjfPreemptiveResults = document.getElementById("sjfPreemptiveResults");
  const comparisonResults = document.getElementById("comparisonResults");

  const processes = [];

  const samples = {
    normal: {
      quantum: 2,
      processes: [
        ["P1", 0, 7],
        ["P2", 2, 4],
        ["P3", 4, 1],
        ["P4", 5, 4],
      ],
    },
    behavior: {
      quantum: 3,
      processes: [
        ["P1", 0, 12],
        ["P2", 1, 2],
        ["P3", 2, 2],
        ["P4", 3, 2],
        ["P5", 4, 2],
      ],
    },
    invalid: {
      quantum: 0,
      processes: [
        ["", 0, 3],
        ["P1", -1, 4],
        ["P2", 2, 0],
        ["P3", 3, 5],
        ["P3", 4, 2],
      ],
    },
  };

  function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message-box ${type || "info"}`;
    messageBox.hidden = false;
  }

  function clearMessage() {
    messageBox.hidden = true;
    messageBox.textContent = "";
  }

  function resetOutputs() {
    rrResults.className = "result-placeholder";
    sjfNonPreemptiveResults.className = "result-placeholder";
    sjfPreemptiveResults.className = "result-placeholder";
    comparisonResults.className = "result-placeholder";
    rrResults.textContent = "Add processes and run the comparison to display Round Robin results.";
    sjfNonPreemptiveResults.textContent =
      "Add processes and run the comparison to display SJF Non-Preemptive results.";
    sjfPreemptiveResults.textContent =
      "Add processes and run the comparison to display SJF Preemptive (SRTF) results.";
    comparisonResults.textContent = "Run all three algorithms to compare average metrics.";
  }

  function renderProcessTable() {
    if (!processes.length) {
      processTableBody.innerHTML = '<tr><td colspan="4" class="empty-cell">No processes added yet.</td></tr>';
      return;
    }

    processTableBody.innerHTML = processes
      .map(
        (process, index) => `
          <tr>
            <td>
              <input type="checkbox" class="process-select" data-index="${index}" aria-label="Select ${window.GanttRenderer.escapeHtml(
          process.pid
        )}" />
            </td>
            <td>
              <input
                class="table-input"
                type="text"
                value="${window.GanttRenderer.escapeHtml(process.pid)}"
                data-index="${index}"
                data-field="pid"
                aria-label="Process ID for row ${index + 1}"
              />
            </td>
            <td>
              <input
                class="table-input"
                type="number"
                step="1"
                value="${window.GanttRenderer.escapeHtml(process.arrivalTime)}"
                data-index="${index}"
                data-field="arrivalTime"
                aria-label="Arrival Time for row ${index + 1}"
              />
            </td>
            <td>
              <input
                class="table-input"
                type="number"
                step="1"
                value="${window.GanttRenderer.escapeHtml(process.burstTime)}"
                data-index="${index}"
                data-field="burstTime"
                aria-label="Burst Time for row ${index + 1}"
              />
            </td>
          </tr>
        `
      )
      .join("");
  }

  function updateProcessFromTable(event) {
    const input = event.target;
    if (!input.classList.contains("table-input")) {
      return;
    }

    const index = Number(input.dataset.index);
    const field = input.dataset.field;

    if (!processes[index] || !field) {
      return;
    }

    processes[index][field] = field === "pid" ? input.value : input.value.trim();
    resetOutputs();
    clearMessage();
  }

  function addProcess(pid, arrivalTime, burstTime) {
    const validation = window.Validation.validateProcessInput(pid, arrivalTime, burstTime, processes);

    if (!validation.valid) {
      showMessage(validation.message, "error");
      return false;
    }

    const process = new window.ProcessModel(
      validation.process.pid,
      validation.process.arrivalTime,
      validation.process.burstTime,
      processes.length
    );

    processes.push(process);
    renderProcessTable();
    resetOutputs();
    clearMessage();
    return true;
  }

  function clearAllProcesses() {
    processes.splice(0, processes.length);
    processForm.reset();
    quantumInput.value = "";
    renderProcessTable();
    resetOutputs();
    clearMessage();
  }

  function loadSample(name) {
    const sample = samples[name];
    clearAllProcesses();
    sample.processes.forEach(([pid, arrivalTime, burstTime]) => {
      processes.push(new window.ProcessModel(pid, arrivalTime, burstTime, processes.length));
    });
    quantumInput.value = sample.quantum;
    renderProcessTable();
    resetOutputs();

    const notes = {
      normal: "Normal Case loaded: basic workload with different arrival and burst times.",
      behavior: "Behavior-Revealing Case loaded: demonstrates fairness vs efficiency and long-job sensitivity.",
      invalid: "Invalid Input Case loaded: click Run Comparison to verify that validation rejects invalid data.",
    };

    showMessage(notes[name], name === "invalid" ? "info" : "success");
  }

  function removeSelectedProcesses() {
    const selectedIndexes = Array.from(document.querySelectorAll(".process-select:checked"))
      .map((checkbox) => Number(checkbox.dataset.index))
      .sort((a, b) => b - a);

    if (!selectedIndexes.length) {
      showMessage("Select at least one process to remove.", "error");
      return;
    }

    selectedIndexes.forEach((index) => processes.splice(index, 1));
    processes.forEach((process, index) => {
      process.originalIndex = index;
    });
    renderProcessTable();
    resetOutputs();
    showMessage("Selected process removed.", "success");
  }

  function runComparison() {
    const validation = window.Validation.validateRun(processes, quantumInput.value);

    if (!validation.valid) {
      showMessage(validation.message, "error");
      return;
    }

    const rrResult = window.scheduleRoundRobin(processes, validation.value);
    const sjfNonPreemptiveResult = window.scheduleSJFNonPreemptive(processes);
    const sjfPreemptiveResult = window.scheduleSJFPreemptive(processes);

    rrResults.className = "";
    sjfNonPreemptiveResults.className = "";
    sjfPreemptiveResults.className = "";
    comparisonResults.className = "";
    rrResults.innerHTML = window.GanttRenderer.renderAlgorithmResult(rrResult);
    sjfNonPreemptiveResults.innerHTML = window.GanttRenderer.renderAlgorithmResult(sjfNonPreemptiveResult);
    sjfPreemptiveResults.innerHTML = window.GanttRenderer.renderAlgorithmResult(sjfPreemptiveResult);
    comparisonResults.innerHTML = window.ComparisonRenderer.renderComparison(
      rrResult,
      sjfNonPreemptiveResult,
      sjfPreemptiveResult
    );
    showMessage("Comparison completed successfully.", "success");
    activateTab("comparison");
    scrollToComparison();
  }

  function scrollToComparison() {
    const comparisonPanel = document.getElementById("comparisonPanel");
    const topOffset = 120;
    const targetTop = comparisonPanel.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }

  function activateTab(name) {
    document.querySelectorAll(".tab-button").forEach((button) => {
      const isActive = button.dataset.tab === name;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    document.getElementById(`${name}Panel`).classList.add("active");
  }

  processForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (addProcess(pidInput.value, arrivalInput.value, burstInput.value)) {
      processForm.reset();
      pidInput.focus();
    }
  });

  processTableBody.addEventListener("input", updateProcessFromTable);
  document.getElementById("removeSelectedButton").addEventListener("click", removeSelectedProcesses);
  document.getElementById("clearAllButton").addEventListener("click", clearAllProcesses);
  document.getElementById("clearAllTopButton").addEventListener("click", clearAllProcesses);
  document.getElementById("quickClearButton").addEventListener("click", clearAllProcesses);
  document.getElementById("loadNormalButton").addEventListener("click", () => loadSample("normal"));
  document.getElementById("loadBehaviorButton").addEventListener("click", () => loadSample("behavior"));
  document.getElementById("loadInvalidButton").addEventListener("click", () => loadSample("invalid"));
  document.getElementById("runButton").addEventListener("click", runComparison);

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });

  renderProcessTable();
})();
