(function () {
  function parseInteger(value, fieldName) {
    if (value === "" || value === null || value === undefined) {
      return { valid: false, message: `${fieldName} is required.` };
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue) || !Number.isInteger(numberValue)) {
      return { valid: false, message: `${fieldName} must be a whole number.` };
    }

    return { valid: true, value: numberValue };
  }

  function validateProcessInput(pid, arrivalTime, burstTime, existingProcesses, ignoredIndex) {
    const trimmedPid = String(pid || "").trim();

    if (!trimmedPid) {
      return { valid: false, message: "Process ID cannot be empty." };
    }

    const parsedArrival = parseInteger(arrivalTime, "Arrival Time");
    if (!parsedArrival.valid) {
      return parsedArrival;
    }

    if (parsedArrival.value < 0) {
      return { valid: false, message: "Arrival Time cannot be negative." };
    }

    const parsedBurst = parseInteger(burstTime, "Burst Time");
    if (!parsedBurst.valid) {
      return parsedBurst;
    }

    if (parsedBurst.value <= 0) {
      return { valid: false, message: "Burst Time must be greater than 0." };
    }

    const duplicate = existingProcesses.some(
      (process, index) => index !== ignoredIndex && process.pid.toLowerCase() === trimmedPid.toLowerCase()
    );

    if (duplicate) {
      return { valid: false, message: `Process ID "${trimmedPid}" already exists.` };
    }

    return {
      valid: true,
      process: {
        pid: trimmedPid,
        arrivalTime: parsedArrival.value,
        burstTime: parsedBurst.value,
      },
    };
  }

  function validateQuantum(value) {
    const parsedQuantum = parseInteger(value, "Round Robin Quantum");

    if (!parsedQuantum.valid) {
      return parsedQuantum;
    }

    if (parsedQuantum.value <= 0) {
      return { valid: false, message: "Round Robin Quantum must be greater than 0." };
    }

    return { valid: true, value: parsedQuantum.value };
  }

  function validateRun(processes, quantumValue) {
    const messages = [];
    const processIdRows = new Map();

    if (!processes.length) {
      return { valid: false, message: "Add at least one process before running the comparison." };
    }

    processes.forEach((process, index) => {
      const validation = validateProcessInput(process.pid, process.arrivalTime, process.burstTime, []);
      if (!validation.valid) {
        messages.push(`Row ${index + 1}: ${validation.message}`);
        return;
      }

      const normalizedPid = validation.process.pid.toLowerCase();
      if (!processIdRows.has(normalizedPid)) {
        processIdRows.set(normalizedPid, { pid: validation.process.pid, rows: [] });
      }
      processIdRows.get(normalizedPid).rows.push(index + 1);
    });

    processIdRows.forEach((entry) => {
      if (entry.rows.length > 1) {
        messages.push(`Duplicate Process ID "${entry.pid}" appears in rows ${entry.rows.join(", ")}.`);
      }
    });

    const quantumValidation = validateQuantum(quantumValue);
    if (!quantumValidation.valid) {
      messages.push(quantumValidation.message);
    }

    if (messages.length) {
      return { valid: false, message: messages.join("\n") };
    }

    return quantumValidation;
  }

  window.Validation = {
    validateProcessInput,
    validateQuantum,
    validateRun,
  };
})();
