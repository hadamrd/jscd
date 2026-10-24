function makeTarget() {
  const isValid = s => s.length > 3;
  const fallback = () => "today";
  return function inner(a) {
    let early = "-";
    if (a === "zz") {
      try {
        early = late;
      } catch (e) {
        early = "tdz";
      }
    }
    let late = "x";
    const mark = () => late + early + "!";
    if (!isValid(a)) return "bad" + mark();
    return "ok:" + fallback() + mark();
  };
}
var target = makeTarget();
