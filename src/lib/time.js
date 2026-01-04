export function nowMs(headers) {
  if (process.env.TEST_MODE === "1") {
    const testNow = headers.get("x-test-now-ms");
    if (testNow) {
      return Number(testNow);
    }
  }
  return Date.now();
}
