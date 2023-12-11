export function profile(run: () => void, callback: (timeMs: number) => void) {
  const start = performance.now();
  run();
  const end = performance.now();
  const timeMs = end - start;
  callback(timeMs);
}
