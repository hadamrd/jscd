function target(n) {
  let log = "";
  let a = 1;
  let b = 2;
  let c = 0;
  for (let i = 0; i < 5; i++) {
    a = i * 10;
    if (i === n) break;
    b = a + 1;
  }
  log += a + "," + b;
  try {
    c = 5;
    if (n > 2) throw new Error("x");
    c = 7;
  } catch (e) {
    log += "!" + c;
    c = 9;
  }
  let d = 3;
  try {
    d = 4;
    if (n === 1) throw new Error("y");
  } catch (e) {
    d = 8;
  }
  if (n === 0) {
    c = 11;
  }
  return log + ":" + c + ":" + d;
}
