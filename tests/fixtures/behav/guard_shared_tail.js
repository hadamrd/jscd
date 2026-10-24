function target(arr, names) {
  let mask = 0;
  if (names.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      const k = names.indexOf(arr[i]);
      if (k !== -1) mask |= 2 ** k;
    }
  }
  return mask.toString();
}
