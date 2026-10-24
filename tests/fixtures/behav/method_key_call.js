let calls = 0;
let order = "";
function key(i) {
  calls += 1;
  return i ? "split" : "indexOf";
}
function g(x) {
  order += x;
  return x;
}
function methodWithCallKey(s, n) {
  calls = 0;
  const r = s[key(n)]("-");
  return calls + "|" + String(r);
}
function callsInOrder() {
  order = "";
  const first = g("a");
  return g("b") + first + order;
}
function target(s, n) {
  return methodWithCallKey(s, n) + "|" + callsInOrder();
}
