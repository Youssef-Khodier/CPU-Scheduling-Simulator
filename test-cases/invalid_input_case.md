# Invalid Input Case

## Input Table

| Process ID | Arrival Time | Burst Time | Purpose |
| --- | ---: | ---: | --- |
| blank | 0 | 3 | Empty Process ID |
| P1 | -1 | 4 | Negative Arrival Time |
| P2 | 2 | 0 | Burst Time = 0 |
| P3 | 3 | 5 | Duplicate Process ID |
| P3 | 4 | 2 | Duplicate Process ID |

## Quantum

Round Robin Quantum: `0`

## Expected Behavior

- The app rejects empty process IDs.
- The app rejects duplicate process IDs.
- The app rejects non-numeric or missing arrival time, burst time, or quantum values.
- The app rejects negative arrival times.
- The app rejects burst times less than or equal to 0.
- The app rejects quantum values less than or equal to 0.
- The app displays a clear visible error message without using a browser alert.

## Notes

This scenario proves that input validation prevents invalid workloads before Round Robin (RR), SJF Non-Preemptive, or SJF Preemptive (SRTF) runs. It is also available from the built-in Quick Test Cases section.
