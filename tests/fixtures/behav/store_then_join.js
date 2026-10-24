let calls = 0;
function f(x) {
  calls += 1;
  return x * 2;
}
function lastInBranch(o, c) {
  if (c) {
    o.x = f(1);
  } else {
    o[c + "y"] = f(2);
  }
}
function viaTernary(o, c) {
  c ? (o.p = f(3)) : (o.q = f(4));
}
function chained(o, k) {
  o.a = o[k] = f(5);
  return o.a;
}
function target(c) {
  calls = 0;
  const o = {};
  lastInBranch(o, c);
  viaTernary(o, c);
  const r = chained(o, "b");
  return r + "|" + calls + "|" + JSON.stringify(o);
}
