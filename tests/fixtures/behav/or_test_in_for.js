function target(names, name) {
  const out = [];
  const arr = names.map((n, i) => ({ name: n, id: i, kids: i % 2 ? null : [i] }));
  for (let i = 0; i < arr.length; i++) {
    const p = arr[i];
    if (p.name == name || p.name == name + ".exe") {
      if (p.kids != null) {
        out.push(p.id);
      }
    }
  }
  return out.join(",");
}
