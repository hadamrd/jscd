const out = [];
const send = (a, b) => out.push(a + ":" + b);
function target(n) {
  out.length = 0;
  if (n > 0) {
    send("ok", n + " merged for " + n + ".");
  } else {
    send("err", "nothing for " + n + ".");
  }
  return out.join("|");
}
