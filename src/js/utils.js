// An array diffing fn, takes two arrays and returns
// what was added or removed.
export function arrayDiff(orig, mod, key) {
  mod = new Map(mod.map(b => [key(b), [b, true]]));

  var add = [];
  var rem = orig.filter(a => {
    var v = mod.get(key(a));
    if (v !== undefined)
      return v[1] = false;  // That's not a mistake, both set and return false.
    else
      return true;
  });
  mod.forEach((v) => v[1] ? add.push(v[0]) : null);

  return {add, rem};
}
