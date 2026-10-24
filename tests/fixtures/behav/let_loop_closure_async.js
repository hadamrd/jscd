// A per-iteration `let` captured by a closure, in an async function: jscd emits the
// copy-back of `i` after it has processed the loop's PopContext, and names it after the
// parameter in that slot. Known bug (2026-10-24).
async function build(name, n) {
  const f = () => name;
  let out = [];
  for (let i = 0; i < n; i++) {
    const g = () => i;
    out.push(name + g());
  }
  const z = await "";
  return out.join(",") + f() + z;
}
function target(name, n) {
  return build(name, n);
}
