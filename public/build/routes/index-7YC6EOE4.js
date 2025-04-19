import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  createHotContext
} from "/build/_shared/chunk-4JQWUYWG.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/index.tsx
var import_react = __toESM(require_react());
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/index.tsx"
  );
  import.meta.hot.lastModified = "1745056738852.5686";
}
function Index() {
  _s();
  const [input, setInput] = (0, import_react.useState)("");
  const [entries, setEntries] = (0, import_react.useState)(() => {
    try {
      const stored = localStorage.getItem("entries");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = input.split(",").map((i) => i.trim()).filter(Boolean);
    if (!items.length)
      return;
    setLoading(true);
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items
      })
    });
    const data = await res.json();
    const newEntry = {
      items,
      result: data.result
    };
    setEntries([newEntry, ...entries]);
    setInput("");
    setLoading(false);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-xl mx-auto", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold mb-4", children: "MacroMate" }, void 0, false, {
      fileName: "app/routes/index.tsx",
      lineNumber: 62,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { onSubmit: handleSubmit, className: "mb-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "e.g., 100g chicken, 1 cup rice", className: "border p-2 w-full" }, void 0, false, {
        fileName: "app/routes/index.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: loading, className: "mt-2 px-4 py-2 bg-blue-500 text-white rounded", children: loading ? "Calculating..." : "Calculate" }, void 0, false, {
        fileName: "app/routes/index.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/index.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: entries.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4 p-4 border rounded bg-white", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "italic", children: entry.items.join(", ") }, void 0, false, {
        fileName: "app/routes/index.tsx",
        lineNumber: 71,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("pre", { className: "whitespace-pre-wrap mt-2", children: entry.result }, void 0, false, {
        fileName: "app/routes/index.tsx",
        lineNumber: 72,
        columnNumber: 13
      }, this)
    ] }, idx, true, {
      fileName: "app/routes/index.tsx",
      lineNumber: 70,
      columnNumber: 38
    }, this)) }, void 0, false, {
      fileName: "app/routes/index.tsx",
      lineNumber: 69,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/index.tsx",
    lineNumber: 61,
    columnNumber: 10
  }, this);
}
_s(Index, "8y4Ghvxvxt4SnVSAaJGDy8OD61w=");
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
//# sourceMappingURL=/build/routes/index-7YC6EOE4.js.map
