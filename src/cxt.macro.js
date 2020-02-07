const { createMacro } = require("babel-plugin-macros");
const { default: generate } = require("@babel/generator");

const l = console.log;

function _setCxt(k, data) {
  const r = { key: k, value: data[k] };
  if (Array.isArray(data) || typeof data === "string") {
    r.index = k;
  }
  return r;
}

module.exports = createMacro(function myMacro({ references, state, babel }) {
  const { types: t, traverse, parse } = babel;
  const { default: fr = [], ...cxt } = references;

  traverse(state.file.ast, {
    Program(path) {
      path.unshiftContainer("body", parse(`${_setCxt}`).program.body[0]);
    }
  });

  fr.forEach(path => {
    let conx = "$_";
    path.parentPath.findParent(p => {
      if (
        fr.some(
          ep =>
            ep !== path && ep.parentPath.parentPath.node.start === p.node.start
        )
      ) {
        conx += "_";
      }
      return false;
    });

    path.__cxt = conx;
  });
  fr.forEach(path => {
    const parentPath = path.findParent(p => p.isCallExpression());
    if (parentPath) {
      const argPaths = parentPath.get("arguments");
      if (argPaths && argPaths.length === 1) {
        const firstArgPath = argPaths[0]; // 只要第一个参数

        const data = generate(firstArgPath.node).code;

        // if or while 这不会报错
        const statementPath = parentPath.parentPath;
        const statementAst = statementPath.node;
        const blockAst = statementAst.consequent;

        const code = `
        for (let k in ${data}) {
          let ${path.__cxt} = _setCxt(k, ${data});
        }
        `;
        const ast = parse(code);
        if (blockAst && blockAst.body && blockAst.body.length) {
          const forAst = ast.program.body[0];
          const forBlockAst = forAst.body;
          forBlockAst.body = forBlockAst.body.concat(blockAst.body);
        }
        statementPath.replaceWith(ast.program);
      }
    }
  });
});
