function target(n) {
  let a = 1;
  let b = 0;
  L1: {
    a = 2;
    if (n > 1) break L1;
    a = 3;
    if (n === 1) {
      b = 4;
      break L1;
    }
    b = a * 2;
  }
  return a + ":" + b;
}
