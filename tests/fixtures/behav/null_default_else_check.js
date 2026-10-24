const check = s => s.length > 3;
const today = () => "2026-10-24";
function target(a) {
  if (a == null) {
    a = today();
  } else if (!check(a)) {
    return "bad";
  }
  return "ok:" + a;
}
