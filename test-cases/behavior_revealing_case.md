# Behavior-Revealing Case

## Input Table

| Process ID | Arrival Time | Burst Time |
| --- | ---: | ---: |
| P1 | 0 | 12 |
| P2 | 1 | 2 |
| P3 | 2 | 2 |
| P4 | 3 | 2 |
| P5 | 4 | 2 |

## Quantum

Round Robin Quantum: `3`

## Purpose

This case reveals the difference between Round Robin fairness, SJF Non-Preemptive behavior when a long job starts first, and SJF Preemptive (SRTF) efficiency for short jobs.

## Expected Behavior

- SJF Non-Preemptive lets P1 continue because it starts at time 0.
- SJF Preemptive (SRTF) preempts P1 when shorter jobs arrive.
- Round Robin (RR) keeps giving P1 repeated access using the quantum.
- The comparison conclusion should mention fairness, efficiency, long-job delay or starvation risk, and quantum sensitivity.

## Expected Round Robin (RR) Gantt Chart

| Segment | Start | End |
| --- | ---: | ---: |
| P1 | 0 | 3 |
| P2 | 3 | 5 |
| P3 | 5 | 7 |
| P4 | 7 | 9 |
| P1 | 9 | 12 |
| P5 | 12 | 14 |
| P1 | 14 | 20 |

## Expected SJF Non-Preemptive Gantt Chart

| Segment | Start | End |
| --- | ---: | ---: |
| P1 | 0 | 12 |
| P2 | 12 | 14 |
| P3 | 14 | 16 |
| P4 | 16 | 18 |
| P5 | 18 | 20 |

## Expected SJF Preemptive (SRTF) Gantt Chart

| Segment | Start | End |
| --- | ---: | ---: |
| P1 | 0 | 1 |
| P2 | 1 | 3 |
| P3 | 3 | 5 |
| P4 | 5 | 7 |
| P5 | 7 | 9 |
| P1 | 9 | 20 |

## Notes

This scenario is available from the built-in Quick Test Cases section.
