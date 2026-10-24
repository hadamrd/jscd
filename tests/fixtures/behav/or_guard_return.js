const keys = ["k0", "", "k2"];
function wrap(k) {
  return "<" + k + ">";
}
function target(a, i) {
  if (!a || !keys[i]) return "";
  const key = wrap(keys[i]);
  return a + key + i;
}
