# Round Robin vs SJF Comparison Project

## Overview

This project is a pure frontend CPU scheduling simulator. It compares three scheduling outputs using the same workload:

1. Round Robin (RR)
2. SJF Non-Preemptive
3. SJF Preemptive (SRTF)

Because the project title mentions SJF and the project notes mention preemptive SJF, this implementation includes both SJF versions. This makes the comparison clearer and demonstrates the difference between non-preemptive shortest job selection and preemptive shortest remaining time selection.

## Algorithms

### Round Robin (RR)

Round Robin uses a FIFO ready queue and a selected time quantum. Each ready process runs for `min(quantum, remaining time)`. If it does not finish, it is added to the end of the ready queue after newly arrived processes are queued. Idle time is displayed when no process is ready.

### SJF Non-Preemptive

SJF Non-Preemptive selects the arrived process with the shortest burst time only when the CPU becomes free. Once a process starts, it runs until completion. Ties are resolved by smaller burst time, earlier arrival time, then original input order.

### SJF Preemptive (SRTF)

SJF Preemptive (SRTF) checks the ready processes at every time unit and selects the process with the shortest remaining time. If a shorter job arrives, the current job can be preempted. Ties are resolved by smaller remaining time, earlier arrival time, then original input order.

## Metrics

- CT, Completion Time: the time when a process finishes.
- TAT, Turnaround Time: `TAT = CT - AT`.
- WT, Waiting Time: `WT = TAT - BT`.
- RT, Response Time: `RT = First CPU Start Time - AT`.

The UI also shows Average WT, Average TAT, and Average RT rounded to 2 decimal places.

## Features

- Add, edit, remove, and clear processes.
- Validate duplicate IDs, empty IDs, negative arrivals, zero burst time, non-numeric values, and invalid quantum values.
- Load Normal, Behavior-Revealing, and Invalid Input quick test cases.
- Display three separate Gantt charts with process ID, start time, and end time.
- Display three metrics tables with CT, TAT, WT, and RT.
- Compare all three algorithms in one table and highlight the best average metric.
- Generate an automatic conclusion about fairness, efficiency, starvation risk, and quantum effects.

## Project Structure

```text
project-root/
  index.html
  README.md
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
  assets/
  screenshots/
  test-cases/
    normal_case.md
    behavior_revealing_case.md
    invalid_input_case.md
```

## How to Run

Open `index.html` directly in a modern web browser. No installation or backend server is required.

## Test Cases

### Normal Case

Round Robin Quantum: `2`

| Process ID | Arrival Time | Burst Time |
| --- | ---: | ---: |
| P1 | 0 | 7 |
| P2 | 2 | 4 |
| P3 | 4 | 1 |
| P4 | 5 | 4 |

Expected SJF Non-Preemptive Gantt chart: `P1 0-7`, `P3 7-8`, `P2 8-12`, `P4 12-16`.

Expected SJF Preemptive (SRTF) Gantt chart: `P1 0-2`, `P2 2-4`, `P3 4-5`, `P2 5-7`, `P4 7-11`, `P1 11-16`.

### Behavior-Revealing Case

Round Robin Quantum: `3`

| Process ID | Arrival Time | Burst Time |
| --- | ---: | ---: |
| P1 | 0 | 12 |
| P2 | 1 | 2 |
| P3 | 2 | 2 |
| P4 | 3 | 2 |
| P5 | 4 | 2 |

This case shows Round Robin fairness, SJF Non-Preemptive keeping the first long job until completion, and SJF Preemptive (SRTF) preempting that long job when shorter jobs arrive.

### Invalid Input Case

The app rejects duplicate process IDs, burst time `0`, arrival time `-1`, quantum `0`, empty process IDs, and non-numeric arrival or burst values before running any algorithm.

## Screenshots

Add screenshots of the three Gantt charts, metrics tables, and comparison section in the `screenshots/` folder after running the app.

## Team Members

- Team Member 1:
- Team Member 2:
- Team Member 3:
- Team Member 4:

## Assumptions and Limitations

- Arrival time, burst time, and quantum are whole numbers.
- Process IDs are compared case-insensitively for duplicate validation.
- A lower average WT, TAT, or RT is considered better.
- Context switch overhead is not included in metric calculations.
- SJF Preemptive (SRTF) may delay long jobs and has starvation risk.
- Round Robin performance depends strongly on the selected quantum.
- This is a static browser app with no backend storage, so inputs are not saved after refresh.
