# Round Robin vs SJF Comparison Project Plan

## Project Goal

Build a pure frontend Operating Systems scheduling simulator that runs the same workload through three algorithms:

1. Round Robin (RR)
2. SJF Non-Preemptive
3. SJF Preemptive (SRTF)

The app must run directly by opening `index.html` in a modern browser. It must not require a backend, database, build tool, npm package, framework, or CDN.

## Required Outputs

- Three separate Gantt charts:
  - Round Robin (RR)
  - SJF Non-Preemptive
  - SJF Preemptive (SRTF)
- Three per-process metrics tables:
  - Process ID
  - AT
  - BT
  - CT
  - TAT
  - WT
  - RT
- Three average metric summaries:
  - Average WT
  - Average TAT
  - Average RT
- A comparison table with columns:
  - Metric
  - Round Robin (RR)
  - SJF Non-Preemptive
  - SJF Preemptive (SRTF)
  - Best Algorithm
- An automatic conclusion explaining fairness, efficiency, starvation risk, and quantum sensitivity.

## Algorithms

### Round Robin (RR)

- Use a FIFO ready queue.
- Use the selected time quantum.
- Run each process for `min(quantum, remaining time)`.
- Add newly arrived processes in arrival order before re-adding an unfinished running process.
- If the process is unfinished, add it to the end of the ready queue.
- If no process is available, display CPU Idle until the next process arrives.
- Record first CPU start time for response time.
- Record completion time when a process finishes.

### SJF Non-Preemptive

- When the CPU becomes free, consider only arrived unfinished processes.
- Select the process with the shortest burst time.
- Once a process starts, run it until completion.
- Do not interrupt the running process when a shorter process arrives later.
- If no process is available, display CPU Idle until the next process arrives.
- Tie-breaking:
  1. Smaller burst time
  2. Earlier arrival time
  3. Original input order

### SJF Preemptive (SRTF)

- At every time unit, consider all arrived unfinished processes.
- Select the process with the shortest remaining time.
- If a new process arrives with shorter remaining time, preempt the current process.
- Run one time unit at a time.
- If no process is available, display CPU Idle until the next process arrives.
- Merge consecutive Gantt segments for the same process.
- Tie-breaking:
  1. Smaller remaining time
  2. Earlier arrival time
  3. Original input order

## Metrics

- Completion Time (CT): the time when the process finishes.
- Turnaround Time (TAT): `TAT = CT - AT`.
- Waiting Time (WT): `WT = TAT - BT`.
- Response Time (RT): `RT = First_CPU_Start_Time - AT`.

Averages are calculated as metric sum divided by number of processes and displayed to 2 decimal places.

## File Structure

```text
index.html
README.md
Plan.md
src/
  css/
    style.css
  js/
    app.js
    validation.js
    metrics.js
    roundRobin.js
    sjfNonPreemptive.js
    sjfPreemptive.js
    gantt.js
    comparison.js
  model/
    process.js
    ganttSegment.js
    schedulingResult.js
test-cases/
  normal_case.md
  behavior_revealing_case.md
  invalid_input_case.md
screenshots/
assets/
```

## Test Cases

### Normal Case

Quantum = `2`

- P1 AT=0 BT=7
- P2 AT=2 BT=4
- P3 AT=4 BT=1
- P4 AT=5 BT=4

Expected SJF Non-Preemptive Gantt chart: `P1 0-7`, `P3 7-8`, `P2 8-12`, `P4 12-16`.

Expected SJF Preemptive (SRTF) Gantt chart: `P1 0-2`, `P2 2-4`, `P3 4-5`, `P2 5-7`, `P4 7-11`, `P1 11-16`.

### Behavior-Revealing Case

Quantum = `3`

- P1 AT=0 BT=12
- P2 AT=1 BT=2
- P3 AT=2 BT=2
- P4 AT=3 BT=2
- P5 AT=4 BT=2

This shows Round Robin fairness, SJF Non-Preemptive keeping the long first job, and SJF Preemptive (SRTF) preempting for short jobs.

### Invalid Input Case

The app must reject:

- Duplicate Process ID
- Burst Time = 0
- Arrival Time = -1
- Quantum = 0
- Empty Process ID
- Non-numeric Arrival Time or Burst Time

## Final Acceptance Checklist

- Round Robin (RR) still works correctly.
- SJF Non-Preemptive does not preempt.
- SJF Preemptive (SRTF) preempts when a shorter remaining job arrives.
- Three Gantt charts are displayed.
- Three metrics tables are displayed.
- Comparison table compares all three algorithms.
- Quick Test Cases work.
- README explains both SJF versions clearly.
- Test-case markdown files include both SJF versions.
- The app runs by opening `index.html`.
