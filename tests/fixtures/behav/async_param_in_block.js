const helper = s => "<" + s + ">";
async function build(name, n) {
  const f = () => name;
  let out = [];
  if (n > 0) {
    let k = n * 10;
    const g = () => k;
    out.push(helper(name) + g());
  }
  const z = await "";
  return out.join(",") + f() + z;
}
function target(name, n) {
  return build(name, n);
}
