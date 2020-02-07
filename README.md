## babel-macro-cxt 模拟perl的$\_, $\_\_, $\_\_\_ 上下文变量

- [@babel/types](https://babeljs.io/docs/en/babel-types)
- [astexplorer](https://astexplorer.net/)


## input
```js
import fr, { $_, $__, $___ } from "./my.macro";

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
```

## output
```js
function _setCxt(k, data) {
  const r = {
    key: k,
    value: data[k]
  };

  if (Array.isArray(data) || typeof data === "string") {
    r.index = k;
  }

  return r;
}

const arr = [{
  x: 3
}, {
  x: 10
}];

for (let k in arr) {
  let $_ = _setCxt(k, arr);

  for (let k in $_.value) {
    let $__ = _setCxt(k, $_.value);

    console.log($__.value);

    for (let k in [1]) {
      let $___ = _setCxt(k, [1]);
    }
  }

  for (let k in {}) {
    let $__ = _setCxt(k, {});

    for (let k in {}) {
      let $___ = _setCxt(k, {});
    }
  }
}

const obj = {
  name: "ajanuw",
  age: 12
};

for (let k in obj) {
  let $_ = _setCxt(k, obj);

  console.log($_.key, $_.value);
}
```

## run
```shell
λ npm run test
3
10
name ajanuw
age 12
```