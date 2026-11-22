# Tiny Stack VM

A faithful interpreter for make.fun's tiny stack ISA: 32-bit wrapping integers, a 256-value stack, calls, 256 words of memory, input/output, and all ten traps with their exact exit codes. One run answers 40 programs and writes each program's output bytes and exit code.

Run: `node main.ts` (Node 22, no dependencies). It reads `/input/<id>/program.bin` + `input.bin` and writes `/output/<id>/stdout.bin` + `exit.txt`.
