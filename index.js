const { SourceMapSource } = require("webpack-sources");
const traverse = require("@babel/traverse").default;
const parser = require("@babel/parser");
const types = require("@babel/types");
const generate = require("@babel/generator").default;

class LogFunctionCallsPlugin {
  options;
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    const self = this;
    const { Compilation } = compiler.webpack;
    compiler.hooks.compilation.tap("LogFunctionCallsPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "FunctionLoggerPlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          Object.entries(assets).forEach(([filename, source]) => {
            const ast = parser.parse(source.source(), {
              // 根据源码内容添加 sourceType 和 plugins
              sourceType: "module",
              plugins: ["jsx", "typescript"],
            });
            // Track functions that need logging
            const functionsToLog = new Set();
            traverse(ast, {
              Function(path) {
                // 在对应 AST 节点上进行操作和修改
                const comments = path.node.leadingComments || [];
                if (
                  comments.some((comment) => {
                    return comment.value.includes("@log");
                  })
                ) {
                  functionsToLog.add(path.node);
                }
              },
            });
            // Second pass: inject logging code
            traverse(ast, {
              Function(path) {
                if (!functionsToLog.has(path.node)) return;

                // Get function name or use 'anonymous' as fallback
                const functionName = types.stringLiteral(
                  path.node.id ? path.node.id.name : "anonymous"
                );
                const params = path.node.params;

                // Create logging statement
                const logStatement = types.expressionStatement(
                  types.callExpression(
                    types.memberExpression(
                      types.identifier("console"),
                      types.identifier("log")
                    ),
                    [
                      types.stringLiteral(
                        `${self.options.logPrefix} Function `
                      ),
                      functionName,
                      types.stringLiteral(" called with:"),
                      ...params.map((param) => types.identifier(param.name)),
                    ]
                  )
                );

                // Insert at the beginning of the function body
                if (path.node.body.type === "BlockStatement") {
                  path.node.body.body.unshift(logStatement);
                }
              },
            });

            // Generate the transformed code
            const output = generate(ast, { sourceMaps: true }, source);
            const { code, map } = output;

            // Update the asset with transformed code
            compilation.updateAsset(filename, (oldSource) => {
              return new SourceMapSource(
                code,
                filename,
                map,
                oldSource.source(),
                oldSource.map(),
                true
              );
            });
          });
        }
      );
    });
  }
}

module.exports = LogFunctionCallsPlugin;
