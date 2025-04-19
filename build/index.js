var __require = /* @__PURE__ */ ((x) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(x, {
  get: (a, b) => (typeof require < "u" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require < "u")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// server.js
var path = __require("path"), express = __require("express"), { createRequestHandler } = __require("@remix-run/express"), app = express(), port = process.env.PORT || 3e3;
app.disable("x-powered-by");
app.use("/build", express.static("public/build", { immutable: !0, maxAge: "1y" }));
app.use(express.static("public", { maxAge: "1h" }));
app.all(
  "*",
  createRequestHandler({
    build: __require(path.join(process.cwd(), "build")),
    mode: "development"
  })
);
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
//# sourceMappingURL=index.js.map
