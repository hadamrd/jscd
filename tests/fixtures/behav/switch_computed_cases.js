let calls = 0;
function key(s) {
  calls += 1;
  return s;
}
function target(p) {
  calls = 0;
  let r = "x";
  switch (p) {
    case key("a"):
      r += "A";
      break;
    case key("b"):
      r += "B";
      break;
    case key("c"):
      r += "C";
      break;
    default:
      r += "D";
  }
  return r + calls;
}
