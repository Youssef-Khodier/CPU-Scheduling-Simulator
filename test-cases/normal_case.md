# Normal Case

## Input Table

| Process ID | Arrival Time | Burst Time |
| --- | ---: | ---: |
| P1 | 0 | 7 |
| P2 | 2 | 4 |
| P3 | 4 | 1 |
| P4 | 5 | 4 |

## Quantum

Round Robin Quantum: `2`

## Expected Behavior

- Round Robin (RR) cycles through ready processes using a quantum of 2.
- Processes that arrive during another process's time slice are added to the ready queue before the running process is re-added.
- SJF Non-Preemptive runs a selected process to completion.
- SJF Preemptive (SRTF) checks shortest remaining time every time unit and preempts when a shorter job arrives.
- All three algorithms produce complete Gantt charts, process metrics, and averages.

## Expected Round Robin (RR) Gantt Chart

| Segment | Start | End |
| --- | ---: | ---: |
| P1 | 0 | 2 |
| P2 | 2 | 4 |
| P1 | 4 | 6 |
| P3 | 6 | 7 |
| P2 | 7 | 9 |
| P4 | 9 | 11 |
| P1 | 11 | 13 |
| P4 | 13 | 15 |
| P1 | 15 | 16 |

## Expected SJF Non-Preemptive Gantt Chart

| Segment | Start | End |
| --- | ---: | ---: |
| P1 | 0 | 7 |
| P3 | 7 | 8 |
| P2 | 8 | 12 |
| P4 | 12 | 16 |

## Expected SJF Preemptive (SRTF) Gantt Chart

| Segment | Start | End |
| --- | ---: | ---: |
| P1 | 0 | 2 |
| P2 | 2 | 4 |
| P3 | 4 | 5 |
| P2 | 5 | 7 |
| P4 | 7 | 11 |
| P1 | 11 | 16 |

## Expected SJF Non-Preemptive Metrics

| Process ID | CT | TAT | WT | RT |
| --- | ---: | ---: | ---: | ---: |
| P1 | 7 | 7 | 0 | 0 |
| P2 | 12 | 10 | 6 | 6 |
| P3 | 8 | 4 | 3 | 3 |
| P4 | 16 | 11 | 7 | 7 |

## Expected SJF Non-Preemptive Averages

- Average WT = 4.00
- Average TAT = 8.00
- Average RT = 4.00

## Expected SJF Preemptive (SRTF) Metrics

| Process ID | CT | TAT | WT | RT |
| --- | ---: | ---: | ---: | ---: |
| P1 | 16 | 16 | 9 | 0 |
| P2 | 7 | 5 | 1 | 0 |
| P3 | 5 | 1 | 0 | 0 |
| P4 | 11 | 6 | 2 | 2 |

## Expected SJF Preemptive (SRTF) Averages

- Average WT = 3.00
- Average TAT = 7.00
- Average RT = 0.50

## Notes

This scenario proves the basic workflow with multiple arrival times and different burst times. It is also available from the built-in Quick Test Cases section.
