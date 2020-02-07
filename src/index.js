import fr, { $_, $__, $___ } from "./cxt.macro";

const arr = [{ x: 3 }, { x: 10 }];

if (fr(arr)) {
  if (fr($_.value)) {
    console.log($__.value);
    if (fr([1])) {
    }
  }

  if (fr({})) {
    if (fr({})) {
    }
  }
}

const obj = {
  name: "ajanuw",
  age: 12
};

if (fr(obj)) {
  console.log($_.key, $_.value);
}
