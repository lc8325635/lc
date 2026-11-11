import {
  __export
} from "./U4FYQBOV.js";

// js/util/string.js
var string_exports = {};
__export(string_exports, {
  extractWords: () => extractWords,
  parseInt: () => parseInt2,
  sha256: () => sha256,
  split: () => split,
  splitLines: () => splitLines,
  splitWs: () => splitWs,
  template: () => template
});
function split(text, delimiter) {
  if (typeof text !== "string") return text;
  const notEmpty = function(x3) {
    return x3 !== "";
  };
  return text.split(delimiter).filter(notEmpty);
}
function splitWs(text) {
  return split(text, /\s+/);
}
function extractWords(text, minLength = 3) {
  const results = text.match(/\p{L}+/gu) || [];
  return results.filter((word) => word.length >= minLength);
}
function splitLines(text) {
  const lines = text.split("\n");
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start] === "") start += 1;
  while (end > start && lines[end - 1] === "") end -= 1;
  return lines.slice(start, end);
}
function template(text, env) {
  return text.replace(/\{(\w+)\}/g, function(match, key) {
    return env[key] ?? match;
  });
}
function parseInt2(text, radix) {
  return window.parseInt(text, radix);
}
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b3) => b3.toString(16).padStart(2, "0")).join("");
}

// js/util/url.js
var url_exports = {};
__export(url_exports, {
  getCurrentDir: () => getCurrentDir,
  getDirPath: () => getDirPath,
  getPath: () => getPath,
  getPathComponents: () => getPathComponents,
  getRoot: () => getRoot,
  gotoPage: () => gotoPage,
  parse: () => parse,
  qualifyPath: () => qualifyPath,
  reload: () => reload,
  resolve: () => resolve
});

// js/util/config.js
var config_exports = {};
__export(config_exports, {
  buildConfig: () => buildConfig
});
import { buildConfig } from "/lc/js/build-config.js";

// js/util/url.js
var entrypoints = null;
function parse(url) {
  try {
    return new URL(`${url}`);
  } catch (e3) {
    return null;
  }
}
function getRoot() {
  const location = new URL(window.location);
  const origin = location.origin;
  return new URL(`${buildConfig.rootURL}/`, origin).toString();
}
function getCurrentDir() {
  let location = window.location.toString();
  const end = location.lastIndexOf("/");
  return location.substring(0, end + 1);
}
function initialiseEntryPoints(url) {
  const root = getRoot();
  const entrypoints2 = {};
  for (const [relpathBefore, relpathAfter] of Object.entries(buildConfig.entrypoints)) {
    const absPathBefore = new URL(relpathBefore, root).toString();
    const absPathAfter = new URL(relpathAfter, root).toString();
    entrypoints2[absPathBefore] = absPathAfter;
  }
  return entrypoints2;
}
function resolve(relpath) {
  if (relpath.includes("://")) return relpath;
  if (relpath.startsWith("/rpc")) return relpath;
  if (relpath.startsWith("/videos")) return relpath;
  let absPath = null;
  if (relpath.startsWith("/")) {
    absPath = new URL(relpath.substring(1), getRoot()).toString();
  } else {
    absPath = new URL(relpath, getCurrentDir()).toString();
  }
  if (!entrypoints) entrypoints = initialiseEntryPoints();
  const entrypoint = entrypoints[absPath];
  return entrypoint ? entrypoint : absPath;
}
function getPathComponents(path = void 0) {
  if (!path) path = window.location.pathname;
  const indexFilename = "index.html";
  const components = split(path, "/");
  if (components.length === 0) {
    components.push(indexFilename);
  } else {
    const filename = components[components.length - 1];
    if (!filename.includes(".")) components.push(indexFilename);
  }
  return components;
}
function getPath(path = void 0) {
  return getPathComponents(path).join("/");
}
function getDirPath(path) {
  const components = getPathComponents(path = void 0);
  return components.slice(0, components.length - 1).join("/");
}
function qualifyPath(path) {
  if (!path.startsWith("/")) {
    const dirPath = getDirPath();
    path = `/${dirPath}/${path}`;
  }
  return path;
}
function gotoPage(href) {
  window.location.assign(resolve(href));
}
function reload(getParams) {
  const url = new URL(window.location);
  for (const [key, value] of Object.entries(getParams)) {
    url.searchParams.set(key, value);
  }
  window.location.href = url.toString();
}

// libs/bundle/preact.js
var preact_exports = {};
__export(preact_exports, {
  Component: () => C,
  Fragment: () => S,
  cloneElement: () => W,
  createContext: () => X,
  createElement: () => k,
  createRef: () => M,
  h: () => k,
  hydrate: () => U,
  isValidElement: () => t,
  options: () => l,
  render: () => R,
  toChildArray: () => F
});
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var a;
var s;
var h;
var p;
var v;
var y;
var d = {};
var w = [];
var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var g = Array.isArray;
function m(n22, l23) {
  for (var u23 in l23) n22[u23] = l23[u23];
  return n22;
}
function b(n22) {
  n22 && n22.parentNode && n22.parentNode.removeChild(n22);
}
function k(l23, u23, t23) {
  var i23, r23, o22, e23 = {};
  for (o22 in u23) "key" == o22 ? i23 = u23[o22] : "ref" == o22 ? r23 = u23[o22] : e23[o22] = u23[o22];
  if (arguments.length > 2 && (e23.children = arguments.length > 3 ? n.call(arguments, 2) : t23), "function" == typeof l23 && null != l23.defaultProps) for (o22 in l23.defaultProps) void 0 === e23[o22] && (e23[o22] = l23.defaultProps[o22]);
  return x(l23, e23, i23, r23, null);
}
function x(n22, t23, i23, r23, o22) {
  var e23 = { type: n22, props: t23, key: i23, ref: r23, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o22 ? ++u : o22, __i: -1, __u: 0 };
  return null == o22 && null != l.vnode && l.vnode(e23), e23;
}
function M() {
  return { current: null };
}
function S(n22) {
  return n22.children;
}
function C(n22, l23) {
  this.props = n22, this.context = l23;
}
function $(n22, l23) {
  if (null == l23) return n22.__ ? $(n22.__, n22.__i + 1) : null;
  for (var u23; l23 < n22.__k.length; l23++) if (null != (u23 = n22.__k[l23]) && null != u23.__e) return u23.__e;
  return "function" == typeof n22.type ? $(n22) : null;
}
function I(n22) {
  if (n22.__P && n22.__d) {
    var u23 = n22.__v, t23 = u23.__e, i23 = [], r23 = [], o22 = m({}, u23);
    o22.__v = u23.__v + 1, l.vnode && l.vnode(o22), q(n22.__P, o22, u23, n22.__n, n22.__P.namespaceURI, 32 & u23.__u ? [t23] : null, i23, null == t23 ? $(u23) : t23, !!(32 & u23.__u), r23), o22.__v = u23.__v, o22.__.__k[o22.__i] = o22, D(i23, o22, r23), u23.__e = u23.__ = null, o22.__e != t23 && P(o22);
  }
}
function P(n22) {
  if (null != (n22 = n22.__) && null != n22.__c) return n22.__e = n22.__c.base = null, n22.__k.some(function(l23) {
    if (null != l23 && null != l23.__e) return n22.__e = n22.__c.base = l23.__e;
  }), P(n22);
}
function A(n22) {
  (!n22.__d && (n22.__d = true) && i.push(n22) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
}
function H() {
  try {
    for (var n22, l23 = 1; i.length; ) i.length > l23 && i.sort(e), n22 = i.shift(), l23 = i.length, I(n22);
  } finally {
    i.length = H.__r = 0;
  }
}
function L(n22, l23, u23, t23, i23, r23, o22, e23, f23, c23, a23) {
  var s22, h23, p23, v23, y22, _22, g22 = t23 && t23.__k || w, m23 = l23.length;
  for (f23 = T(u23, l23, g22, f23, m23), s22 = 0; s22 < m23; s22++) null != (p23 = u23.__k[s22]) && (h23 = -1 != p23.__i && g22[p23.__i] || d, p23.__i = s22, _22 = q(n22, p23, h23, i23, r23, o22, e23, f23, c23, a23), v23 = p23.__e, p23.ref && h23.ref != p23.ref && (h23.ref && J(h23.ref, null, p23), a23.push(p23.ref, p23.__c || v23, p23)), null == y22 && null != v23 && (y22 = v23), 4 & p23.__u ? (f23 = j(p23, f23, n22), h23.__e && (h23.__e = null)) : "function" == typeof p23.type && void 0 !== _22 ? f23 = _22 : v23 && (f23 = v23.nextSibling), p23.__u &= -7);
  return u23.__e = y22, f23;
}
function T(n22, l23, u23, t23, i23) {
  var r23, o22, e23, f23, c23, a23 = u23.length, s22 = a23, h23 = 0;
  for (n22.__k = new Array(i23), r23 = 0; r23 < i23; r23++) null != (o22 = l23[r23]) && "boolean" != typeof o22 && "function" != typeof o22 ? ("string" == typeof o22 || "number" == typeof o22 || "bigint" == typeof o22 || o22.constructor == String ? o22 = n22.__k[r23] = x(null, o22, null, null, null) : g(o22) ? o22 = n22.__k[r23] = x(S, { children: o22 }, null, null, null) : void 0 === o22.constructor && o22.__b > 0 ? o22 = n22.__k[r23] = x(o22.type, o22.props, o22.key, o22.ref ? o22.ref : null, o22.__v) : n22.__k[r23] = o22, f23 = r23 + h23, o22.__ = n22, o22.__b = n22.__b + 1, e23 = null, -1 != (c23 = o22.__i = O(o22, u23, f23, s22)) && (s22--, (e23 = u23[c23]) && (e23.__u |= 2)), null == e23 || null == e23.__v ? (-1 == c23 && (i23 > a23 ? h23-- : i23 < a23 && h23++), "function" != typeof o22.type && (o22.__u |= 4)) : c23 != f23 && (c23 == f23 - 1 ? h23-- : c23 == f23 + 1 ? h23++ : (c23 > f23 ? h23-- : h23++, o22.__u |= 4))) : n22.__k[r23] = null;
  if (s22) for (r23 = 0; r23 < a23; r23++) null != (e23 = u23[r23]) && 0 == (2 & e23.__u) && (e23.__e == t23 && (t23 = $(e23)), K(e23, e23));
  return t23;
}
function j(n22, l23, u23) {
  var t23, i23;
  if ("function" == typeof n22.type) {
    for (t23 = n22.__k, i23 = 0; t23 && i23 < t23.length; i23++) t23[i23] && (t23[i23].__ = n22, l23 = j(t23[i23], l23, u23));
    return l23;
  }
  n22.__e != l23 && (l23 && n22.type && !l23.parentNode && (l23 = $(n22)), l23 = u23.insertBefore(n22.__e, l23 || null));
  do {
    l23 = l23 && l23.nextSibling;
  } while (null != l23 && 8 == l23.nodeType);
  return l23;
}
function F(n22, l23) {
  return l23 = l23 || [], null == n22 || "boolean" == typeof n22 || (g(n22) ? n22.some(function(n32) {
    F(n32, l23);
  }) : l23.push(n22)), l23;
}
function O(n22, l23, u23, t23) {
  var i23, r23, o22, e23 = n22.key, f23 = n22.type, c23 = l23[u23], a23 = null != c23 && 0 == (2 & c23.__u);
  if (null === c23 && null == e23 || a23 && e23 == c23.key && f23 == c23.type) return u23;
  if (t23 > (a23 ? 1 : 0)) {
    for (i23 = u23 - 1, r23 = u23 + 1; i23 >= 0 || r23 < l23.length; ) if (null != (c23 = l23[o22 = i23 >= 0 ? i23-- : r23++]) && 0 == (2 & c23.__u) && e23 == c23.key && f23 == c23.type) return o22;
  }
  return -1;
}
function z(n22, l23, u23) {
  "-" == l23[0] ? n22.setProperty(l23, null == u23 ? "" : u23) : n22[l23] = null == u23 ? "" : "number" != typeof u23 || _.test(l23) ? u23 : u23 + "px";
}
function N(n22, l23, u23, t23, i23) {
  var r23, o22;
  n: if ("style" == l23) if ("string" == typeof u23) n22.style.cssText = u23;
  else {
    if ("string" == typeof t23 && (n22.style.cssText = t23 = ""), t23) for (l23 in t23) u23 && l23 in u23 || z(n22.style, l23, "");
    if (u23) for (l23 in u23) t23 && u23[l23] == t23[l23] || z(n22.style, l23, u23[l23]);
  }
  else if ("o" == l23[0] && "n" == l23[1]) r23 = l23 != (l23 = l23.replace(s, "$1")), o22 = l23.toLowerCase(), l23 = o22 in n22 || "onFocusOut" == l23 || "onFocusIn" == l23 ? o22.slice(2) : l23.slice(2), n22.l || (n22.l = {}), n22.l[l23 + r23] = u23, u23 ? t23 ? u23[a] = t23[a] : (u23[a] = h, n22.addEventListener(l23, r23 ? v : p, r23)) : n22.removeEventListener(l23, r23 ? v : p, r23);
  else {
    if ("http://www.w3.org/2000/svg" == i23) l23 = l23.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l23 && "height" != l23 && "href" != l23 && "list" != l23 && "form" != l23 && "tabIndex" != l23 && "download" != l23 && "rowSpan" != l23 && "colSpan" != l23 && "role" != l23 && "popover" != l23 && l23 in n22) try {
      n22[l23] = null == u23 ? "" : u23;
      break n;
    } catch (n32) {
    }
    "function" == typeof u23 || (null == u23 || false === u23 && "-" != l23[4] ? n22.removeAttribute(l23) : n22.setAttribute(l23, "popover" == l23 && 1 == u23 ? "" : u23));
  }
}
function V(n22) {
  return function(u23) {
    if (this.l) {
      var t23 = this.l[u23.type + n22];
      if (null == u23[c]) u23[c] = h++;
      else if (u23[c] < t23[a]) return;
      return t23(l.event ? l.event(u23) : u23);
    }
  };
}
function q(n22, u23, t23, i23, r23, o22, e23, f23, c23, a23) {
  var s22, h23, p23, v23, y22, d23, _22, k22, x22, M2, I22, P22, A23, H22, T22, j23, F2 = u23.type;
  if (void 0 !== u23.constructor) return null;
  128 & t23.__u && (c23 = !!(32 & t23.__u), o22 = [f23 = u23.__e = t23.__e]), (s22 = l.__b) && s22(u23);
  n: if ("function" == typeof F2) {
    h23 = e23.length;
    try {
      if (x22 = u23.props, M2 = F2.prototype && F2.prototype.render, I22 = (s22 = F2.contextType) && i23[s22.__c], P22 = s22 ? I22 ? I22.props.value : s22.__ : i23, t23.__c ? k22 = (p23 = u23.__c = t23.__c).__ = p23.__E : (M2 ? u23.__c = p23 = new F2(x22, P22) : (u23.__c = p23 = new C(x22, P22), p23.constructor = F2, p23.render = Q), I22 && I22.sub(p23), p23.state || (p23.state = {}), p23.__n = i23, v23 = p23.__d = true, p23.__h = [], p23._sb = []), M2 && null == p23.__s && (p23.__s = p23.state), M2 && null != F2.getDerivedStateFromProps && (p23.__s == p23.state && (p23.__s = m({}, p23.__s)), m(p23.__s, F2.getDerivedStateFromProps(x22, p23.__s))), y22 = p23.props, d23 = p23.state, p23.__v = u23, v23) M2 && null == F2.getDerivedStateFromProps && null != p23.componentWillMount && p23.componentWillMount(), M2 && null != p23.componentDidMount && p23.__h.push(p23.componentDidMount);
      else {
        if (M2 && null == F2.getDerivedStateFromProps && x22 !== y22 && null != p23.componentWillReceiveProps && p23.componentWillReceiveProps(x22, P22), u23.__v == t23.__v || !p23.__e && null != p23.shouldComponentUpdate && false === p23.shouldComponentUpdate(x22, p23.__s, P22)) {
          u23.__v != t23.__v && (p23.props = x22, p23.state = p23.__s, p23.__d = false), u23.__e = t23.__e, u23.__k = t23.__k, u23.__k.some(function(n32) {
            n32 && (n32.__ = u23);
          }), w.push.apply(p23.__h, p23._sb), p23._sb = [], p23.__h.length && e23.push(p23), f23 = $(t23);
          break n;
        }
        null != p23.componentWillUpdate && p23.componentWillUpdate(x22, p23.__s, P22), M2 && null != p23.componentDidUpdate && p23.__h.push(function() {
          p23.componentDidUpdate(y22, d23, _22);
        });
      }
      if (p23.context = P22, p23.props = x22, p23.__P = n22, p23.__e = false, A23 = l.__r, H22 = 0, M2) p23.state = p23.__s, p23.__d = false, A23 && A23(u23), s22 = p23.render(p23.props, p23.state, p23.context), w.push.apply(p23.__h, p23._sb), p23._sb = [];
      else do {
        p23.__d = false, A23 && A23(u23), s22 = p23.render(p23.props, p23.state, p23.context), p23.state = p23.__s;
      } while (p23.__d && ++H22 < 25);
      p23.state = p23.__s, null != p23.getChildContext && (i23 = m(m({}, i23), p23.getChildContext())), M2 && !v23 && null != p23.getSnapshotBeforeUpdate && (_22 = p23.getSnapshotBeforeUpdate(y22, d23)), T22 = null != s22 && s22.type === S && null == s22.key ? E(s22.props.children) : s22, f23 = L(n22, g(T22) ? T22 : [T22], u23, t23, i23, r23, o22, e23, f23, c23, a23), p23.base = u23.__e, u23.__u &= -161, p23.__h.length && e23.push(p23), k22 && (p23.__E = p23.__ = null);
    } catch (n32) {
      if (e23.length = h23, u23.__v = null, c23 || null != o22) {
        if (n32.then) {
          for (u23.__u |= c23 ? 160 : 128; f23 && 8 == f23.nodeType && f23.nextSibling; ) f23 = f23.nextSibling;
          null != o22 && (o22[o22.indexOf(f23)] = null), u23.__e = f23;
        } else if (null != o22) for (j23 = o22.length; j23--; ) b(o22[j23]);
      } else u23.__e = t23.__e;
      null == u23.__k && (u23.__k = t23.__k || []), n32.then || B(u23), l.__e(n32, u23, t23);
    }
  } else null == o22 && u23.__v == t23.__v ? (u23.__k = t23.__k, u23.__e = t23.__e) : f23 = u23.__e = G(t23.__e, u23, t23, i23, r23, o22, e23, c23, a23);
  return (s22 = l.diffed) && s22(u23), 128 & u23.__u ? void 0 : f23;
}
function B(n22) {
  n22 && (n22.__c && (n22.__c.__e = true), n22.__k && n22.__k.some(B));
}
function D(n22, u23, t23) {
  for (var i23 = 0; i23 < t23.length; i23++) J(t23[i23], t23[++i23], t23[++i23]);
  l.__c && l.__c(u23, n22), n22.some(function(u3) {
    try {
      n22 = u3.__h, u3.__h = [], n22.some(function(n32) {
        n32.call(u3);
      });
    } catch (n32) {
      l.__e(n32, u3.__v);
    }
  });
}
function E(n22) {
  return "object" != typeof n22 || null == n22 || n22.__b > 0 ? n22 : g(n22) ? n22.map(E) : void 0 !== n22.constructor ? null : m({}, n22);
}
function G(u23, t23, i23, r23, o22, e23, f23, c23, a23) {
  var s22, h23, p23, v23, y22, w23, _22, m23 = i23.props || d, k22 = t23.props, x22 = t23.type;
  if ("svg" == x22 ? o22 = "http://www.w3.org/2000/svg" : "math" == x22 ? o22 = "http://www.w3.org/1998/Math/MathML" : o22 || (o22 = "http://www.w3.org/1999/xhtml"), null != e23) {
    for (s22 = 0; s22 < e23.length; s22++) if ((y22 = e23[s22]) && "setAttribute" in y22 == !!x22 && (x22 ? y22.localName == x22 : 3 == y22.nodeType)) {
      u23 = y22, e23[s22] = null;
      break;
    }
  }
  if (null == u23) {
    if (null == x22) return document.createTextNode(k22);
    u23 = document.createElementNS(o22, x22, k22.is && k22), c23 && (l.__m && l.__m(t23, e23), c23 = false), e23 = null;
  }
  if (null == x22) m23 === k22 || c23 && u23.data == k22 || (u23.data = k22);
  else {
    if (e23 = "textarea" == x22 && null != k22.defaultValue ? null : e23 && n.call(u23.childNodes), !c23 && null != e23) for (m23 = {}, s22 = 0; s22 < u23.attributes.length; s22++) m23[(y22 = u23.attributes[s22]).name] = y22.value;
    for (s22 in m23) y22 = m23[s22], "dangerouslySetInnerHTML" == s22 ? p23 = y22 : "children" == s22 || s22 in k22 || "value" == s22 && "defaultValue" in k22 || "checked" == s22 && "defaultChecked" in k22 || N(u23, s22, null, y22, o22);
    for (s22 in k22) y22 = k22[s22], "children" == s22 ? v23 = y22 : "dangerouslySetInnerHTML" == s22 ? h23 = y22 : "value" == s22 ? w23 = y22 : "checked" == s22 ? _22 = y22 : c23 && "function" != typeof y22 || m23[s22] === y22 || N(u23, s22, y22, m23[s22], o22);
    if (h23) c23 || p23 && (h23.__html == p23.__html || h23.__html == u23.innerHTML) || (u23.innerHTML = h23.__html), t23.__k = [];
    else if (p23 && (u23.innerHTML = ""), L("template" == t23.type ? u23.content : u23, g(v23) ? v23 : [v23], t23, i23, r23, "foreignObject" == x22 ? "http://www.w3.org/1999/xhtml" : o22, e23, f23, e23 ? e23[0] : i23.__k && $(i23, 0), c23, a23), null != e23) for (s22 = e23.length; s22--; ) b(e23[s22]);
    c23 && "textarea" != x22 || (s22 = "value", "progress" == x22 && null == w23 ? u23.removeAttribute("value") : null != w23 && (w23 !== u23[s22] || "progress" == x22 && !w23 || "option" == x22 && w23 != m23[s22]) && N(u23, s22, w23, m23[s22], o22), s22 = "checked", null != _22 && _22 != u23[s22] && N(u23, s22, _22, m23[s22], o22));
  }
  return u23;
}
function J(n22, u23, t23) {
  try {
    if ("function" == typeof n22) {
      var i23 = "function" == typeof n22.__u;
      i23 && n22.__u(), i23 && null == u23 || (n22.__u = n22(u23));
    } else n22.current = u23;
  } catch (n32) {
    l.__e(n32, t23);
  }
}
function K(n22, u23, t23) {
  var i23, r23;
  if (l.unmount && l.unmount(n22), (i23 = n22.ref) && (i23.current && i23.current != n22.__e || J(i23, null, u23)), null != (i23 = n22.__c)) {
    if (i23.componentWillUnmount) try {
      i23.componentWillUnmount();
    } catch (n32) {
      l.__e(n32, u23);
    }
    i23.base = i23.__P = i23.__n = null;
  }
  if (i23 = n22.__k) for (r23 = 0; r23 < i23.length; r23++) i23[r23] && K(i23[r23], u23, t23 || "function" != typeof n22.type);
  t23 || b(n22.__e), n22.__c = n22.__ = n22.__e = void 0;
}
function Q(n22, l23, u23) {
  return this.constructor(n22, u23);
}
function R(u23, t23, i23) {
  var r23, o22, e23, f23;
  t23 == document && (t23 = document.documentElement), l.__ && l.__(u23, t23), o22 = (r23 = "function" == typeof i23) ? null : i23 && i23.__k || t23.__k, e23 = [], f23 = [], q(t23, u23 = (!r23 && i23 || t23).__k = k(S, null, [u23]), o22 || d, d, t23.namespaceURI, !r23 && i23 ? [i23] : o22 ? null : t23.firstChild ? n.call(t23.childNodes) : null, e23, !r23 && i23 ? i23 : o22 ? o22.__e : t23.firstChild, r23, f23), D(e23, u23, f23), u23.props.children = null;
}
function U(n22, l23) {
  R(n22, l23, U);
}
function W(l23, u23, t23) {
  var i23, r23, o22, e23, f23 = m({}, l23.props);
  for (o22 in l23.type && l23.type.defaultProps && (e23 = l23.type.defaultProps), u23) "key" == o22 ? i23 = u23[o22] : "ref" == o22 ? r23 = u23[o22] : f23[o22] = void 0 === u23[o22] && null != e23 ? e23[o22] : u23[o22];
  return arguments.length > 2 && (f23.children = arguments.length > 3 ? n.call(arguments, 2) : t23), x(l23.type, f23, i23 || l23.key, r23 || l23.ref, null);
}
function X(n22) {
  function l23(n32) {
    var u23, t23;
    return this.getChildContext || (u23 = /* @__PURE__ */ new Set(), (t23 = {})[l23.__c] = this, this.getChildContext = function() {
      return t23;
    }, this.componentWillUnmount = function() {
      u23 = null;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value != n4.value && u23.forEach(function(n5) {
        n5.__e = true, A(n5);
      });
    }, this.sub = function(n4) {
      u23.add(n4);
      var l3 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u23 && u23.delete(n4), l3 && l3.call(n4);
      };
    }), n32.children;
  }
  return l23.__c = "__cC" + y++, l23.__ = n22, l23.Provider = l23.__l = (l23.Consumer = function(n32, l3) {
    return n32.children(l3);
  }).contextType = l23, l23;
}
n = w.slice, l = { __e: function(n22, l23, u23, t23) {
  for (var i23, r23, o22; l23 = l23.__; ) if ((i23 = l23.__c) && !i23.__) try {
    if ((r23 = i23.constructor) && null != r23.getDerivedStateFromError && (i23.setState(r23.getDerivedStateFromError(n22)), o22 = i23.__d), null != i23.componentDidCatch && (i23.componentDidCatch(n22, t23 || {}), o22 = i23.__d), o22) return i23.__E = i23;
  } catch (l3) {
    n22 = l3;
  }
  throw n22;
} }, u = 0, t = function(n22) {
  return null != n22 && void 0 === n22.constructor;
}, C.prototype.setState = function(n22, l23) {
  var u23;
  u23 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n22 && (n22 = n22(m({}, u23), this.props)), n22 && m(u23, n22), null != n22 && this.__v && (l23 && this._sb.push(l23), A(this));
}, C.prototype.forceUpdate = function(n22) {
  this.__v && (this.__e = true, n22 && this.__h.push(n22), A(this));
}, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n22, l23) {
  return n22.__v.__b - l23.__v.__b;
}, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a = "__a" + f, s = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;

// libs/bundle/htm.js
var n2 = function(t23, s3, r3, e3) {
  var u3;
  s3[0] = 0;
  for (var h3 = 1; h3 < s3.length; h3++) {
    var p3 = s3[h3++], a3 = s3[h3] ? (s3[0] |= p3 ? 1 : 2, r3[s3[h3++]]) : s3[++h3];
    3 === p3 ? e3[0] = a3 : 4 === p3 ? e3[1] = Object.assign(e3[1] || {}, a3) : 5 === p3 ? (e3[1] = e3[1] || {})[s3[++h3]] = a3 : 6 === p3 ? e3[1][s3[++h3]] += a3 + "" : p3 ? (u3 = t23.apply(a3, n2(t23, a3, r3, ["", null])), e3.push(u3), a3[0] ? s3[0] |= 2 : (s3[h3 - 2] = 0, s3[h3] = u3)) : e3.push(a3);
  }
  return e3;
};
var t2 = /* @__PURE__ */ new Map();
function htm_module_default(s3) {
  var r3 = t2.get(this);
  return r3 || (r3 = /* @__PURE__ */ new Map(), t2.set(this, r3)), (r3 = n2(this, r3.get(s3) || (r3.set(s3, r3 = (function(n22) {
    for (var t23, s22, r23 = 1, e3 = "", u3 = "", h3 = [0], p3 = function(n32) {
      1 === r23 && (n32 || (e3 = e3.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h3.push(0, n32, e3) : 3 === r23 && (n32 || e3) ? (h3.push(3, n32, e3), r23 = 2) : 2 === r23 && "..." === e3 && n32 ? h3.push(4, n32, 0) : 2 === r23 && e3 && !n32 ? h3.push(5, 0, true, e3) : r23 >= 5 && ((e3 || !n32 && 5 === r23) && (h3.push(r23, 0, e3, s22), r23 = 6), n32 && (h3.push(r23, n32, 0, s22), r23 = 6)), e3 = "";
    }, a3 = 0; a3 < n22.length; a3++) {
      a3 && (1 === r23 && p3(), p3(a3));
      for (var l3 = 0; l3 < n22[a3].length; l3++) t23 = n22[a3][l3], 1 === r23 ? "<" === t23 ? (p3(), h3 = [h3], r23 = 3) : e3 += t23 : 4 === r23 ? "--" === e3 && ">" === t23 ? (r23 = 1, e3 = "") : e3 = t23 + e3[0] : u3 ? t23 === u3 ? u3 = "" : e3 += t23 : '"' === t23 || "'" === t23 ? u3 = t23 : ">" === t23 ? (p3(), r23 = 1) : r23 && ("=" === t23 ? (r23 = 5, s22 = e3, e3 = "") : "/" === t23 && (r23 < 5 || ">" === n22[a3][l3 + 1]) ? (p3(), 3 === r23 && (h3 = h3[0]), r23 = h3, (h3 = h3[0]).push(2, 0, r23), r23 = 0) : " " === t23 || "	" === t23 || "\n" === t23 || "\r" === t23 ? (p3(), r23 = 2) : e3 += t23), 3 === r23 && "!--" === e3 && (r23 = 4, h3 = h3[0]);
    }
    return p3(), h3;
  })(s3)), r3), arguments, [])).length > 1 ? r3 : r3[0];
}

// libs/bundle/preact/hooks.js
var n3;
var l2;
var u2;
var t3;
var i2;
var r2;
var o2;
var e2;
var f2;
var c2;
var a2;
var s2;
var h2;
var p2;
var v2;
var y2;
var d2 = {};
var w2 = [];
var _2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var g2 = Array.isArray;
function m2(n22, l3) {
  for (var u3 in l3) n22[u3] = l3[u3];
  return n22;
}
function b2(n22) {
  n22 && n22.parentNode && n22.parentNode.removeChild(n22);
}
function x2(n22, t32, i3, r3, o3) {
  var e3 = { type: n22, props: t32, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u2 : o3, __i: -1, __u: 0 };
  return null == o3 && null != l2.vnode && l2.vnode(e3), e3;
}
function S2(n22) {
  return n22.children;
}
function C2(n22, l3) {
  this.props = n22, this.context = l3;
}
function $2(n22, l3) {
  if (null == l3) return n22.__ ? $2(n22.__, n22.__i + 1) : null;
  for (var u3; l3 < n22.__k.length; l3++) if (null != (u3 = n22.__k[l3]) && null != u3.__e) return u3.__e;
  return "function" == typeof n22.type ? $2(n22) : null;
}
function I2(n22) {
  if (n22.__P && n22.__d) {
    var u3 = n22.__v, t32 = u3.__e, i3 = [], r3 = [], o3 = m2({}, u3);
    o3.__v = u3.__v + 1, l2.vnode && l2.vnode(o3), q2(n22.__P, o3, u3, n22.__n, n22.__P.namespaceURI, 32 & u3.__u ? [t32] : null, i3, null == t32 ? $2(u3) : t32, !!(32 & u3.__u), r3), o3.__v = u3.__v, o3.__.__k[o3.__i] = o3, D2(i3, o3, r3), u3.__e = u3.__ = null, o3.__e != t32 && P2(o3);
  }
}
function P2(n22) {
  if (null != (n22 = n22.__) && null != n22.__c) return n22.__e = n22.__c.base = null, n22.__k.some(function(l3) {
    if (null != l3 && null != l3.__e) return n22.__e = n22.__c.base = l3.__e;
  }), P2(n22);
}
function A2(n22) {
  (!n22.__d && (n22.__d = true) && i2.push(n22) && !H2.__r++ || r2 != l2.debounceRendering) && ((r2 = l2.debounceRendering) || o2)(H2);
}
function H2() {
  try {
    for (var n22, l3 = 1; i2.length; ) i2.length > l3 && i2.sort(e2), n22 = i2.shift(), l3 = i2.length, I2(n22);
  } finally {
    i2.length = H2.__r = 0;
  }
}
function L2(n22, l3, u3, t32, i3, r3, o3, e3, f3, c3, a3) {
  var s3, h3, p3, v3, y3, _3, g3 = t32 && t32.__k || w2, m3 = l3.length;
  for (f3 = T2(u3, l3, g3, f3, m3), s3 = 0; s3 < m3; s3++) null != (p3 = u3.__k[s3]) && (h3 = -1 != p3.__i && g3[p3.__i] || d2, p3.__i = s3, _3 = q2(n22, p3, h3, i3, r3, o3, e3, f3, c3, a3), v3 = p3.__e, p3.ref && h3.ref != p3.ref && (h3.ref && J2(h3.ref, null, p3), a3.push(p3.ref, p3.__c || v3, p3)), null == y3 && null != v3 && (y3 = v3), 4 & p3.__u ? (f3 = j2(p3, f3, n22), h3.__e && (h3.__e = null)) : "function" == typeof p3.type && void 0 !== _3 ? f3 = _3 : v3 && (f3 = v3.nextSibling), p3.__u &= -7);
  return u3.__e = y3, f3;
}
function T2(n22, l3, u3, t32, i3) {
  var r3, o3, e3, f3, c3, a3 = u3.length, s3 = a3, h3 = 0;
  for (n22.__k = new Array(i3), r3 = 0; r3 < i3; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? ("string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? o3 = n22.__k[r3] = x2(null, o3, null, null, null) : g2(o3) ? o3 = n22.__k[r3] = x2(S2, { children: o3 }, null, null, null) : void 0 === o3.constructor && o3.__b > 0 ? o3 = n22.__k[r3] = x2(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : n22.__k[r3] = o3, f3 = r3 + h3, o3.__ = n22, o3.__b = n22.__b + 1, e3 = null, -1 != (c3 = o3.__i = O2(o3, u3, f3, s3)) && (s3--, (e3 = u3[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > a3 ? h3-- : i3 < a3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f3 && (c3 == f3 - 1 ? h3-- : c3 == f3 + 1 ? h3++ : (c3 > f3 ? h3-- : h3++, o3.__u |= 4))) : n22.__k[r3] = null;
  if (s3) for (r3 = 0; r3 < a3; r3++) null != (e3 = u3[r3]) && 0 == (2 & e3.__u) && (e3.__e == t32 && (t32 = $2(e3)), K2(e3, e3));
  return t32;
}
function j2(n22, l3, u3) {
  var t32, i3;
  if ("function" == typeof n22.type) {
    for (t32 = n22.__k, i3 = 0; t32 && i3 < t32.length; i3++) t32[i3] && (t32[i3].__ = n22, l3 = j2(t32[i3], l3, u3));
    return l3;
  }
  n22.__e != l3 && (l3 && n22.type && !l3.parentNode && (l3 = $2(n22)), l3 = u3.insertBefore(n22.__e, l3 || null));
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function O2(n22, l3, u3, t32) {
  var i3, r3, o3, e3 = n22.key, f3 = n22.type, c3 = l3[u3], a3 = null != c3 && 0 == (2 & c3.__u);
  if (null === c3 && null == e3 || a3 && e3 == c3.key && f3 == c3.type) return u3;
  if (t32 > (a3 ? 1 : 0)) {
    for (i3 = u3 - 1, r3 = u3 + 1; i3 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f3 == c3.type) return o3;
  }
  return -1;
}
function z2(n22, l3, u3) {
  "-" == l3[0] ? n22.setProperty(l3, null == u3 ? "" : u3) : n22[l3] = null == u3 ? "" : "number" != typeof u3 || _2.test(l3) ? u3 : u3 + "px";
}
function N2(n22, l3, u3, t32, i3) {
  var r3, o3;
  n: if ("style" == l3) if ("string" == typeof u3) n22.style.cssText = u3;
  else {
    if ("string" == typeof t32 && (n22.style.cssText = t32 = ""), t32) for (l3 in t32) u3 && l3 in u3 || z2(n22.style, l3, "");
    if (u3) for (l3 in u3) t32 && u3[l3] == t32[l3] || z2(n22.style, l3, u3[l3]);
  }
  else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(s2, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n22 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n22.l || (n22.l = {}), n22.l[l3 + r3] = u3, u3 ? t32 ? u3[a2] = t32[a2] : (u3[a2] = h2, n22.addEventListener(l3, r3 ? v2 : p2, r3)) : n22.removeEventListener(l3, r3 ? v2 : p2, r3);
  else {
    if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n22) try {
      n22[l3] = null == u3 ? "" : u3;
      break n;
    } catch (n32) {
    }
    "function" == typeof u3 || (null == u3 || false === u3 && "-" != l3[4] ? n22.removeAttribute(l3) : n22.setAttribute(l3, "popover" == l3 && 1 == u3 ? "" : u3));
  }
}
function V2(n22) {
  return function(u3) {
    if (this.l) {
      var t32 = this.l[u3.type + n22];
      if (null == u3[c2]) u3[c2] = h2++;
      else if (u3[c2] < t32[a2]) return;
      return t32(l2.event ? l2.event(u3) : u3);
    }
  };
}
function q2(n22, u3, t32, i3, r3, o3, e3, f3, c3, a3) {
  var s3, h3, p3, v3, y3, d3, _3, k22, x3, M2, I22, P3, A3, H22, T3, j3, F2 = u3.type;
  if (void 0 !== u3.constructor) return null;
  128 & t32.__u && (c3 = !!(32 & t32.__u), o3 = [f3 = u3.__e = t32.__e]), (s3 = l2.__b) && s3(u3);
  n: if ("function" == typeof F2) {
    h3 = e3.length;
    try {
      if (x3 = u3.props, M2 = F2.prototype && F2.prototype.render, I22 = (s3 = F2.contextType) && i3[s3.__c], P3 = s3 ? I22 ? I22.props.value : s3.__ : i3, t32.__c ? k22 = (p3 = u3.__c = t32.__c).__ = p3.__E : (M2 ? u3.__c = p3 = new F2(x3, P3) : (u3.__c = p3 = new C2(x3, P3), p3.constructor = F2, p3.render = Q2), I22 && I22.sub(p3), p3.state || (p3.state = {}), p3.__n = i3, v3 = p3.__d = true, p3.__h = [], p3._sb = []), M2 && null == p3.__s && (p3.__s = p3.state), M2 && null != F2.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = m2({}, p3.__s)), m2(p3.__s, F2.getDerivedStateFromProps(x3, p3.__s))), y3 = p3.props, d3 = p3.state, p3.__v = u3, v3) M2 && null == F2.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), M2 && null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
      else {
        if (M2 && null == F2.getDerivedStateFromProps && x3 !== y3 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(x3, P3), u3.__v == t32.__v || !p3.__e && null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(x3, p3.__s, P3)) {
          u3.__v != t32.__v && (p3.props = x3, p3.state = p3.__s, p3.__d = false), u3.__e = t32.__e, u3.__k = t32.__k, u3.__k.some(function(n32) {
            n32 && (n32.__ = u3);
          }), w2.push.apply(p3.__h, p3._sb), p3._sb = [], p3.__h.length && e3.push(p3), f3 = $2(t32);
          break n;
        }
        null != p3.componentWillUpdate && p3.componentWillUpdate(x3, p3.__s, P3), M2 && null != p3.componentDidUpdate && p3.__h.push(function() {
          p3.componentDidUpdate(y3, d3, _3);
        });
      }
      if (p3.context = P3, p3.props = x3, p3.__P = n22, p3.__e = false, A3 = l2.__r, H22 = 0, M2) p3.state = p3.__s, p3.__d = false, A3 && A3(u3), s3 = p3.render(p3.props, p3.state, p3.context), w2.push.apply(p3.__h, p3._sb), p3._sb = [];
      else do {
        p3.__d = false, A3 && A3(u3), s3 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
      } while (p3.__d && ++H22 < 25);
      p3.state = p3.__s, null != p3.getChildContext && (i3 = m2(m2({}, i3), p3.getChildContext())), M2 && !v3 && null != p3.getSnapshotBeforeUpdate && (_3 = p3.getSnapshotBeforeUpdate(y3, d3)), T3 = null != s3 && s3.type === S2 && null == s3.key ? E2(s3.props.children) : s3, f3 = L2(n22, g2(T3) ? T3 : [T3], u3, t32, i3, r3, o3, e3, f3, c3, a3), p3.base = u3.__e, u3.__u &= -161, p3.__h.length && e3.push(p3), k22 && (p3.__E = p3.__ = null);
    } catch (n32) {
      if (e3.length = h3, u3.__v = null, c3 || null != o3) {
        if (n32.then) {
          for (u3.__u |= c3 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; ) f3 = f3.nextSibling;
          null != o3 && (o3[o3.indexOf(f3)] = null), u3.__e = f3;
        } else if (null != o3) for (j3 = o3.length; j3--; ) b2(o3[j3]);
      } else u3.__e = t32.__e;
      null == u3.__k && (u3.__k = t32.__k || []), n32.then || B2(u3), l2.__e(n32, u3, t32);
    }
  } else null == o3 && u3.__v == t32.__v ? (u3.__k = t32.__k, u3.__e = t32.__e) : f3 = u3.__e = G2(t32.__e, u3, t32, i3, r3, o3, e3, c3, a3);
  return (s3 = l2.diffed) && s3(u3), 128 & u3.__u ? void 0 : f3;
}
function B2(n22) {
  n22 && (n22.__c && (n22.__c.__e = true), n22.__k && n22.__k.some(B2));
}
function D2(n22, u3, t32) {
  for (var i3 = 0; i3 < t32.length; i3++) J2(t32[i3], t32[++i3], t32[++i3]);
  l2.__c && l2.__c(u3, n22), n22.some(function(u4) {
    try {
      n22 = u4.__h, u4.__h = [], n22.some(function(n32) {
        n32.call(u4);
      });
    } catch (n32) {
      l2.__e(n32, u4.__v);
    }
  });
}
function E2(n22) {
  return "object" != typeof n22 || null == n22 || n22.__b > 0 ? n22 : g2(n22) ? n22.map(E2) : void 0 !== n22.constructor ? null : m2({}, n22);
}
function G2(u3, t32, i3, r3, o3, e3, f3, c3, a3) {
  var s3, h3, p3, v3, y3, w3, _3, m3 = i3.props || d2, k22 = t32.props, x3 = t32.type;
  if ("svg" == x3 ? o3 = "http://www.w3.org/2000/svg" : "math" == x3 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (s3 = 0; s3 < e3.length; s3++) if ((y3 = e3[s3]) && "setAttribute" in y3 == !!x3 && (x3 ? y3.localName == x3 : 3 == y3.nodeType)) {
      u3 = y3, e3[s3] = null;
      break;
    }
  }
  if (null == u3) {
    if (null == x3) return document.createTextNode(k22);
    u3 = document.createElementNS(o3, x3, k22.is && k22), c3 && (l2.__m && l2.__m(t32, e3), c3 = false), e3 = null;
  }
  if (null == x3) m3 === k22 || c3 && u3.data == k22 || (u3.data = k22);
  else {
    if (e3 = "textarea" == x3 && null != k22.defaultValue ? null : e3 && n3.call(u3.childNodes), !c3 && null != e3) for (m3 = {}, s3 = 0; s3 < u3.attributes.length; s3++) m3[(y3 = u3.attributes[s3]).name] = y3.value;
    for (s3 in m3) y3 = m3[s3], "dangerouslySetInnerHTML" == s3 ? p3 = y3 : "children" == s3 || s3 in k22 || "value" == s3 && "defaultValue" in k22 || "checked" == s3 && "defaultChecked" in k22 || N2(u3, s3, null, y3, o3);
    for (s3 in k22) y3 = k22[s3], "children" == s3 ? v3 = y3 : "dangerouslySetInnerHTML" == s3 ? h3 = y3 : "value" == s3 ? w3 = y3 : "checked" == s3 ? _3 = y3 : c3 && "function" != typeof y3 || m3[s3] === y3 || N2(u3, s3, y3, m3[s3], o3);
    if (h3) c3 || p3 && (h3.__html == p3.__html || h3.__html == u3.innerHTML) || (u3.innerHTML = h3.__html), t32.__k = [];
    else if (p3 && (u3.innerHTML = ""), L2("template" == t32.type ? u3.content : u3, g2(v3) ? v3 : [v3], t32, i3, r3, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : o3, e3, f3, e3 ? e3[0] : i3.__k && $2(i3, 0), c3, a3), null != e3) for (s3 = e3.length; s3--; ) b2(e3[s3]);
    c3 && "textarea" != x3 || (s3 = "value", "progress" == x3 && null == w3 ? u3.removeAttribute("value") : null != w3 && (w3 !== u3[s3] || "progress" == x3 && !w3 || "option" == x3 && w3 != m3[s3]) && N2(u3, s3, w3, m3[s3], o3), s3 = "checked", null != _3 && _3 != u3[s3] && N2(u3, s3, _3, m3[s3], o3));
  }
  return u3;
}
function J2(n22, u3, t32) {
  try {
    if ("function" == typeof n22) {
      var i3 = "function" == typeof n22.__u;
      i3 && n22.__u(), i3 && null == u3 || (n22.__u = n22(u3));
    } else n22.current = u3;
  } catch (n32) {
    l2.__e(n32, t32);
  }
}
function K2(n22, u3, t32) {
  var i3, r3;
  if (l2.unmount && l2.unmount(n22), (i3 = n22.ref) && (i3.current && i3.current != n22.__e || J2(i3, null, u3)), null != (i3 = n22.__c)) {
    if (i3.componentWillUnmount) try {
      i3.componentWillUnmount();
    } catch (n32) {
      l2.__e(n32, u3);
    }
    i3.base = i3.__P = i3.__n = null;
  }
  if (i3 = n22.__k) for (r3 = 0; r3 < i3.length; r3++) i3[r3] && K2(i3[r3], u3, t32 || "function" != typeof n22.type);
  t32 || b2(n22.__e), n22.__c = n22.__ = n22.__e = void 0;
}
function Q2(n22, l3, u3) {
  return this.constructor(n22, u3);
}
n3 = w2.slice, l2 = { __e: function(n22, l3, u3, t32) {
  for (var i3, r3, o3; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
    if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n22)), o3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n22, t32 || {}), o3 = i3.__d), o3) return i3.__E = i3;
  } catch (l4) {
    n22 = l4;
  }
  throw n22;
} }, u2 = 0, t3 = function(n22) {
  return null != n22 && void 0 === n22.constructor;
}, C2.prototype.setState = function(n22, l3) {
  var u3;
  u3 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m2({}, this.state), "function" == typeof n22 && (n22 = n22(m2({}, u3), this.props)), n22 && m2(u3, n22), null != n22 && this.__v && (l3 && this._sb.push(l3), A2(this));
}, C2.prototype.forceUpdate = function(n22) {
  this.__v && (this.__e = true, n22 && this.__h.push(n22), A2(this));
}, C2.prototype.render = S2, i2 = [], o2 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e2 = function(n22, l3) {
  return n22.__v.__b - l3.__v.__b;
}, H2.__r = 0, f2 = Math.random().toString(8), c2 = "__d" + f2, a2 = "__a" + f2, s2 = /(PointerCapture)$|Capture$/i, h2 = 0, p2 = V2(false), v2 = V2(true), y2 = 0;
var t22;
var r22;
var u22;
var i22;
var f22 = [];
var c22 = l2;
var e22 = c22.__b;
var a22 = c22.__r;
var v22 = c22.diffed;
var l22 = c22.__c;
var m22 = c22.unmount;
var p22 = c22.__;
function j22() {
  for (var n22; n22 = f22.shift(); ) {
    var t32 = n22.__H;
    if (n22.__P && t32) try {
      t32.__h.some(z22), t32.__h.some(B22), t32.__h = [];
    } catch (r3) {
      t32.__h = [], c22.__e(r3, n22.__v);
    }
  }
}
c22.__b = function(n22) {
  r22 = null, e22 && e22(n22);
}, c22.__ = function(n22, t32) {
  n22 && t32.__k && t32.__k.__m && (n22.__m = t32.__k.__m), p22 && p22(n22, t32);
}, c22.__r = function(n22) {
  a22 && a22(n22), t22 = 0;
  var i3 = (r22 = n22.__c).__H;
  i3 && (u22 === r22 ? (i3.__h = [], r22.__h = [], i3.__.some(function(n32) {
    n32.__N && (n32.__ = n32.__N), n32.u = n32.__N = void 0;
  })) : (i3.__h.some(z22), i3.__h.some(B22), i3.__h = [], t22 = 0)), u22 = r22;
}, c22.diffed = function(n22) {
  v22 && v22(n22);
  var t32 = n22.__c;
  t32 && t32.__H && (t32.__H.__h.length && (1 !== f22.push(t32) && i22 === c22.requestAnimationFrame || ((i22 = c22.requestAnimationFrame) || w22)(j22)), t32.__H.__.some(function(n32) {
    n32.u && (n32.__H = n32.u, n32.u = void 0);
  })), u22 = r22 = null;
}, c22.__c = function(n22, t32) {
  t32.some(function(n32) {
    try {
      n32.__h.some(z22), n32.__h = n32.__h.filter(function(n4) {
        return !n4.__ || B22(n4);
      });
    } catch (r3) {
      t32.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t32 = [], c22.__e(r3, n32.__v);
    }
  }), l22 && l22(n22, t32);
}, c22.unmount = function(n22) {
  m22 && m22(n22);
  var t32, r3 = n22.__c;
  r3 && r3.__H && (r3.__H.__.some(function(n32) {
    try {
      z22(n32);
    } catch (n4) {
      t32 = n4;
    }
  }), r3.__H = void 0, t32 && c22.__e(t32, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w22(n22) {
  var t32, r3 = function() {
    clearTimeout(u3), k2 && cancelAnimationFrame(t32), setTimeout(n22);
  }, u3 = setTimeout(r3, 35);
  k2 && (t32 = requestAnimationFrame(r3));
}
function z22(n22) {
  var t32 = r22, u3 = n22.__c;
  "function" == typeof u3 && (n22.__c = void 0, u3()), r22 = t32;
}
function B22(n22) {
  var t32 = r22;
  n22.__c = n22.__(), r22 = t32;
}

// js/ui/base/index.js
var html = htm_module_default.bind(k);

// js/ui/styles.js
var styles_exports = {};
__export(styles_exports, {
  loadCss: () => loadCss,
  loadStylesheet: () => loadStylesheet
});

// js/util/assert.js
var assert_exports = {};
__export(assert_exports, {
  defined: () => defined,
  isTrue: () => isTrue,
  unreachable: () => unreachable
});
function isTrue(condition, message = null) {
  if (!condition) throw new Error(message ?? "Assertion failed!");
}
function defined(condition, message = null) {
  isTrue(condition !== void 0, message);
}
function unreachable() {
  isTrue(false, "Execution reached supposedly unreachable code!");
}

// js/util/object.js
var object_exports = {};
__export(object_exports, {
  clean: () => clean,
  isolate: () => isolate,
  update: () => update
});
function clean(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== void 0) result[key] = value;
  }
  return result;
}
function update(dst, src) {
  let hasChanged = false;
  for (const key of Object.keys(src)) {
    if (dst[key] !== src[key]) {
      hasChanged = true;
      dst[key] = src[key];
    }
  }
  return hasChanged;
}
function isolate(obj, ...names) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (names.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

// js/util/dom.js
var dom_exports = {};
__export(dom_exports, {
  all: () => all,
  clear: () => clear,
  create: () => create,
  mount: () => mount,
  one: () => one,
  scrollToBottom: () => scrollToBottom
});

// js/util/events/ListenerList.js
var ListenerList = class {
  constructor() {
    this.callbacks = [];
  }
  add(callback2) {
    if (!this.callbacks.includes(callback2)) {
      this.callbacks.push(callback2);
    }
    return this;
  }
  remove(callback2) {
    const filter = function(x3) {
      return x3 !== callback2;
    };
    this.callbacks = this.callbacks.filter(filter);
    return this;
  }
  clear() {
    this.callbacks = [];
    return this;
  }
  fire(...args) {
    for (const callback2 of this.callbacks) {
      callback2(...args);
    }
    return this;
  }
};

// js/util/events/ListenerMap.js
var ListenerMap = class {
  constructor() {
    this.nextId = 0;
    this.callbacks = {};
  }
  getCallbackList(eventName) {
    let callbackList = this.callbacks[eventName];
    if (callbackList === void 0) {
      callbackList = [];
      this.callbacks[eventName] = callbackList;
    }
    return callbackList;
  }
  #validateEventName(name) {
    if (!name.startsWith("on")) {
      throw new Error(`Invalid event name: ${name}`);
    }
    return name;
  }
  add(eventName, callback2) {
    eventName = this.#validateEventName(eventName);
    this.getCallbackList(eventName).push(callback2);
    return this;
  }
  remove(eventName, callback2) {
    eventName = this.#validateEventName(eventName);
    const oldCallbacks = this.getCallbackList(eventName);
    const newCallbacks = oldCallbacks.filter((entry) => entry !== callback2);
    if (newCallbacks.length !== oldCallbacks.length - 1) {
      console.warn(`Error removing ${eventName} listener.`);
    }
    this.callbacks[eventName] = newCallbacks;
    return this;
  }
  fire(eventName, ...args) {
    eventName = this.#validateEventName(eventName);
    for (const callback2 of this.getCallbackList(eventName)) {
      callback2(...args);
    }
    return this;
  }
};

// js/util/events/ready.js
var isReady = false;
var readyListenerList = new ListenerList();
function onReady2(listener) {
  if (!isReady) {
    readyListenerList.add(listener);
  } else {
    listener();
  }
}
window.document.addEventListener("DOMContentLoaded", function() {
  isReady = true;
  readyListenerList.fire();
});

// js/util/events/Bindings.js
var Bindings = class {
  constructor() {
    this.nextId = 0;
    this.bindings = {};
  }
  #getBindings(name) {
    let bindings = this.bindings[name];
    if (bindings === void 0) {
      bindings = [];
      this.bindings[name] = bindings;
    }
    return bindings;
  }
  add(name, value) {
    let bindings = this.#getBindings(name);
    bindings = bindings.filter((x3) => x3 !== value);
    bindings.push(value);
    this.bindings[name] = bindings;
    return this;
  }
  remove(name, value) {
    let bindings = this.#getBindings(name);
    bindings = bindings.filter((x3) => x3 !== value);
    this.bindings[name] = bindings;
    return this;
  }
  fire(name, ...args) {
    for (const callback2 of this.#getBindings(name)) {
      callback2(...args);
    }
    return this;
  }
};

// js/util/events/windowEvents.js
var keyBindings = new Bindings();
var windowEvents = new ListenerMap();
var frameTime = Date.now();
function onAnimationFrame() {
  const lastFrameTime = frameTime;
  frameTime = Date.now();
  windowEvents.fire("onAnimationFrame", { lastFrameTime });
  window.requestAnimationFrame(onAnimationFrame);
}
function onKeyDown(event2) {
  keyBindings.fire(event2.key, event2);
  windowEvents.fire("onKeyDown", event2);
}
function onFullscreenChange(event2) {
  windowEvents.fire("onFullScreenChange", event2);
}
function onTick50(event2) {
  windowEvents.fire("onTick50", event2);
}
function onTick500(event2) {
  windowEvents.fire("onTick500", event2);
}
onReady2(function() {
  onAnimationFrame();
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  window.setInterval(onTick50, 50);
  window.setInterval(onTick500, 500);
});

// js/ui/dialogs/DialogModel.js
var DialogModel = class {
  #dialogMap;
  #dialogStack;
  constructor() {
    this.#dialogMap = {};
    this.#dialogStack = [];
    this.listenerList = new ListenerList();
  }
  isEmpty() {
    return this.#dialogStack.length === 0;
  }
  includes(name) {
    return this.#dialogMap[name] !== void 0;
  }
  open(name) {
    console.info(`Opening dialog: ${name}`);
    return new Promise((accept, reject) => {
      this.#dialogMap[name] = { accept, reject };
      this.#dialogStack.push(name);
      this.listenerList.fire();
    });
  }
  close(result) {
    if (this.#dialogStack.length > 0) {
      const name = this.#dialogStack.pop();
      const dialog = this.#dialogMap[name];
      delete this.#dialogMap[name];
      dialog.accept(result);
      this.listenerList.fire();
    }
  }
};

// js/ui/button/Button.js
var THEMES = {
  "x-circle": "secondary"
};
var Button = class extends preact_exports.Component {
  #buttonRef = null;
  #key;
  constructor(props) {
    super(props);
    this.state = {
      img: null
    };
    this.#key = this.props.key;
  }
  componentDidMount() {
    if (this.#key) {
      keyBindings.add(this.#key, this.#onKey);
    }
  }
  componentWillUnmount() {
    if (this.#key) {
      keyBindings.remove(this.#key, this.#onKey);
    }
  }
  #onKey = (event2) => {
    console.info(`Key activated button: ${this.props.name}`);
    this.#buttonRef.activate();
  };
  render() {
    loadCss({ path: `js/ui/button/button.css`, content: `button {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    column-gap: 1rem;
}
` });
    const icon = this.props.icon;
    const extraClassNames = this.props["class"];
    let img = null;
    const classNames = new ClassNames("button");
    if (extraClassNames) classNames.add(extraClassNames);
    if (icon) {
      const url = url_exports.resolve(`/img/icons/${icon}.svg`);
      img = html`<img src="${url}" class="icon" />`;
      classNames.add("icon-button");
      const theme = THEMES[icon];
      if (theme) classNames.add(theme);
    }
    const setButtonRef = (node) => this.#buttonRef = node;
    const xProps = object_exports.isolate(this.props, "onClick", "disabled");
    return html`
            <button ref=${setButtonRef} class=${classNames.toString()} ...${xProps}>
                ${img}
                ${this.props.name}
            </button>
        `;
  }
};

// js/ui/dialogs/DialogContext.js
var DialogContext = preact_exports.createContext();

// js/ui/dialogs/DialogLayer.js
var DialogLayer = class extends preact_exports.Component {
  #model;
  #layerContext;
  constructor(props) {
    super(props);
    this.#model = props.model;
    this.#layerContext = { model: this.#model };
    this.state = {
      isActive: false
    };
  }
  componentDidMount() {
    this.#model.listenerList.add(this.onModelUpdate).fire();
  }
  componentWillUnmount() {
    this.#model.listenerList.remove(this.onModelUpdate);
  }
  onModelUpdate = () => {
    this.setState({
      isActive: !this.#model.isEmpty()
    });
  };
  render() {
    loadCss({ path: `js/ui/dialogs/dialogs.css`, content: `div.dialog-layer {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    div.dialog {
        position: relative;
        max-height: 80%;
        max-width: 50%;

        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: stretch;

        border: var(--pico-border-width) solid var(--pico-primary-border);
        border-radius: var(--pico-border-radius);
        background: var(--pico-background-color);
        box-shadow: var(--pico-box-shadow);

        header {
            text-align: center;
            font-weight: bold;
            border-bottom: var(--pico-border-width) solid var(--pico-primary-border);
            padding: 0.5rem;
        }

        div.dialog-content {
            display: flex;
            flex-flow: column nowrap;
            justify-content: stretch;
            align-items: start;
            padding: 0 1rem;
            overflow-y: auto;
        }

        footer {
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem;
        }
    }

    div.dialog:focus {
        border: 1px solid var(--pico-primary-border);
    }
}
` });
    if (!this.state.isActive) return null;
    const { children } = this.props;
    return html`
            <${DialogContext.Provider} value=${this.#layerContext}>
                <div class="dialog-layer">
                    ${children}
                </div>
            <//>
        `;
  }
};

// js/ui/dialogs/DialogWindow.js
var DialogWindow = class extends preact_exports.Component {
  static contextType = DialogContext;
  #wasActive = false;
  #dialogElement = null;
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      isActive: false
    };
  }
  componentDidMount() {
    const model = this.context.model;
    model.listenerList.add(this.onModelUpdate).fire();
    this.#attemptFocusDialog();
  }
  componentDidUpdate() {
    this.#attemptFocusDialog();
  }
  componentWillUnmount() {
    const model = this.context.model;
    model.listenerList.remove(this.onModelUpdate);
    this.#wasActive = false;
  }
  #attemptFocusDialog() {
    if (this.#dialogElement !== null) {
      if (!this.#wasActive && this.state.isActive) {
        this.#dialogElement.focus();
      }
    }
    this.#wasActive = this.state.isActive;
  }
  onModelUpdate = () => {
    const model = this.context.model;
    this.setState({
      isActive: model.includes(this.state.name)
    });
  };
  onKeyDown = (event2) => {
    const target = event2.target;
    const model = this.context.model;
    if (event2.key === "Enter") {
      if (target.tagName === "TEXTAREA") return null;
      event2.preventDefault();
      model.close(0);
    }
    if (event2.key === "Escape") {
      event2.preventDefault();
      model.close(1);
    }
  };
  render() {
    if (!this.state.isActive) return null;
    const model = this.context.model;
    const { children, title, onSubmit } = this.props;
    const buttons = this.props.buttons ?? "Cancel,OK";
    const buttonTextList = string_exports.split(buttons, ",");
    const buttonElements = [];
    for (let i3 = 0; i3 < buttonTextList.length; i3 += 1) {
      const option = buttonTextList.length - 1 - i3;
      const text = buttonTextList[i3];
      const onClick = (event2) => {
        model.close(option);
      };
      const button = html`
                <${Button} name=${text} onClick=${onClick} />
            `;
      buttonElements.push(button);
    }
    const setDialogElement = (node) => this.#dialogElement = node;
    return html`
            <div ref=${setDialogElement} class="dialog pico" onKeyDown=${this.onKeyDown} tabindex="0">
                <header>
                    ${title}
                </header>
                <div class="dialog-content">
                    ${children}
                </div>
                <footer>
                    ${buttonElements}
                </footer>
            </div>
        `;
  }
};

// js/ai/Tool.js
var Tool = class {
  constructor(callback2, name, description) {
    this.callback = callback2;
    this.name = name;
    this.description = description;
    this.parameters = {};
    this.requiredParameters = /* @__PURE__ */ new Set();
  }
  addParameter(name, type, description, required = false) {
    this.parameters[name] = { type, description };
    if (required) this.requiredParameters.add(name);
    return this;
  }
  async call(env, args = null) {
    return await this.callback.call(this, env, args ?? {});
  }
  getDeclaration() {
    return {
      "type": "function",
      "function": {
        name: this.name,
        description: this.description,
        parameters: {
          type: "object",
          properties: this.parameters,
          required: Array.from(this.requiredParameters.keys()),
          additionalProperties: false
        }
      }
    };
  }
};

// js/ai/ToolBox.js
var ToolBox = class {
  constructor(parent) {
    this.parent = null;
    this.tools = {};
    if (parent) Object.assign(this.tools, parent.tools);
  }
  addTool(callback2, name, description) {
    const tool = new Tool(callback2, name, description);
    this.tools[name] = tool;
    return tool;
  }
  getTool(name) {
    const tool = this.tools[name];
    assert_exports.defined(tool);
    return tool;
  }
  getDeclarations() {
    return Object.values(this.tools).map((tool) => tool.getDeclaration());
  }
};

// js/ai/ChatApi.js
var ChatApi = class {
  constructor(config = {}) {
    this.server = config.server ? new URL(config.server) : null;
    this.apiKey = config.apiKey ?? null;
    this.apiType = config.apiType ?? "completions";
    this.modelNames = [];
  }
  async listModelNames() {
    const remoteModels = Url.from(new URL("v1/models", this.server));
    try {
      const request = this.createRequest();
      const data = await remoteModels.fetchJson(request);
      return data.models?.map((pojo) => pojo.model);
    } catch (err) {
      return false;
    }
  }
  async setModel(modelName = null, name = null) {
    if (!this.server) {
      return false;
    } else if (this.modelNames.length === 0) {
      this.modelNames = await this.listModelNames() ?? [];
      if (this.modelNames.length === 0) return false;
    }
    if (modelName === null) {
      this.modelName = this.modelNames[0];
    } else if (this.modelNames.includes(modelName)) {
      this.modelName = modelName;
    } else {
      return false;
    }
    this.name = name ?? this.modelName;
    console.info(`Set AI model to: ${this.modelName}`);
    return true;
  }
  async ask(messages, callback2, toolDeclarations) {
    switch (this.apiType) {
      case "completions":
        return this.#streamCompletionsApi(messages, callback2, toolDeclarations);
      case "responses":
        return this.#streamResponsesApi(messages, callback2, toolDeclarations);
      default:
        throw new Error(`API type not supported: ${this.apiType}`);
    }
  }
  async #streamCompletionsApi(messages, callback2, toolDeclarations) {
    await this.#streamApi({
      model: this.modelName,
      messages,
      stream: true,
      tools: toolDeclarations,
      tool_choice: "auto"
    }, callback2);
  }
  async #streamResponsesApi(messages, callback2) {
    await this.#streamApi({
      model: this.modelName,
      input: messages,
      stream: true,
      store: false
    }, callback2);
  }
  createRequest(request = {}) {
    request = Object.assign({}, request);
    if (!request.method) request.method = "GET";
    if (!request.headers) request.headers = {
      "Content-Type": "application/json"
    };
    if (this.apiKey) {
      request.headers.Authorization = `Bearer ${this.apiKey}`;
    }
    return request;
  }
  async #streamApi(parameters, callback2) {
    if (!this.modelName) {
      throw new Error(`Cannot make AI call until model is chosen.`);
    }
    const remoteCompletions = Url.from(new URL("v1/chat/completions", this.server));
    const request = this.createRequest({
      method: "POST",
      body: JSON.stringify(parameters)
    });
    const textStreamer = await remoteCompletions.streamText(request);
    for (; ; ) {
      const line = await textStreamer.readLine();
      if (line === null) break;
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      var jobj = null;
      try {
        jobj = data !== "[DONE]" ? JSON.parse(data) : null;
      } catch (err) {
      }
      if (jobj) await callback2(jobj);
    }
  }
};

// js/ai/User.js
var users = {};
var User = class _User {
  static from(name) {
    if (name instanceof _User) return name;
    name = name.toLowerCase();
    const user = users[name];
    if (!user) throw new Error(`Unknown user: ${name}`);
    return user;
  }
  static add(name, role, info = null) {
    const user = new _User(name, role, info);
    users[name.toLowerCase()] = user;
    return user;
  }
  constructor(name, role, info = null) {
    this.name = name;
    this.role = role;
    this.info = info ?? {};
  }
  toString() {
    return this.name;
  }
};
User.add("System", "system", { system: true });
User.add("Tool", "tool", { system: true });
User.add("User", "user");
User.add("Assistant", "assistant");

// js/ai/Message.js
var Message = class {
  constructor(content, user, metadata = null, timestamp = null) {
    this.user = User.from(user);
    this.content = content;
    this.metadata = metadata;
    this.timestamp = timestamp ?? Date.now();
  }
  isSystemMessage() {
    return this.user.info.system || this.content === "";
  }
  updateContent(content) {
    this.content = content;
  }
  toPojo() {
    const pojo = {
      role: this.user.role,
      content: this.content
    };
    if (this.metadata) Object.assign(pojo, this.metadata);
    return pojo;
  }
};

// js/ai/ToolCalls.js
var ToolCalls = class {
  constructor(toolBox, env = {}) {
    this.toolBox = toolBox ?? new ToolBox();
    this.pendingCalls = /* @__PURE__ */ new Map();
    this.env = env;
  }
  getPendingCall(index, toolCallId) {
    let pendingCall = this.pendingCalls.get(index);
    if (!pendingCall) {
      pendingCall = {
        toolCallId,
        type: "function"
      };
      this.pendingCalls.set(index, pendingCall);
    }
    return pendingCall;
  }
  updateToolCalls(serverPojo) {
    for (const entry of serverPojo) {
      const callData = this.getPendingCall(entry.index, entry.id);
      if (entry.type) callData.type = entry.type;
      const updates = entry[callData.type];
      for (const key of Object.keys(updates)) {
        const keyData = callData[key] ?? "";
        callData[key] = keyData + updates[key];
      }
    }
  }
  async performToolCalls(chat) {
    const performedCalls = /* @__PURE__ */ new Map();
    for (const pendingCall of this.pendingCalls.values()) {
      const toolName = pendingCall.name;
      let callResult = null;
      try {
        const args = JSON.parse(pendingCall.arguments);
        console.info(`Calling tool: ${toolName} ${pendingCall.arguments}`);
        const tool = this.toolBox.getTool(toolName);
        callResult = await tool.call(this.env, args);
        console.info(`Returned: ${JSON.stringify(callResult)}`);
      } catch (e3) {
        console.log(e3);
        callResult = `Calling tool '${toolName}' failed: ${e3}`;
      }
      performedCalls.set(pendingCall.toolCallId, callResult);
    }
    this.pendingCalls.clear();
    return performedCalls;
  }
};

// js/ai/Chat.js
var Chat = class {
  constructor(env, messages = [], toolBox = null) {
    this.env = env;
    this.messages = messages;
    this.toolCalls = new ToolCalls(toolBox, env);
    this.currentThought = [];
    this.currentSpeech = [];
    this.listenerMap = new ListenerMap();
  }
  clear() {
    this.messages = [];
  }
  getMessages() {
    return this.messages.slice(0);
  }
  async addMessage(message) {
    this.messages.push(message);
    this.listenerMap.fire("update");
  }
  async say(content, user, metadata) {
    content = content.trim();
    const message = new Message(content, user, metadata);
    this.addMessage(message);
    return message;
  }
  onReceiveCompletionsApi(pojo) {
    if (pojo.choices) {
      const choice = pojo.choices[0];
      const delta = choice?.delta ?? {};
      if (delta.tool_calls) {
        this.toolCalls.updateToolCalls(delta.tool_calls);
      }
      if (delta.reasoning_content) {
        this.currentThought.push(delta.reasoning_content);
      }
      if (delta.content) {
        this.currentSpeech.push(delta.content);
      }
    } else {
      return false;
    }
    return true;
  }
  onReceiveResponsesApi(pojo) {
    if (pojo.type === "response.reasoning_summary_text.delta") {
      if (pojo.delta) this.currentThought.push(pojo.delta);
    } else if (pojo.type === "response.output_text.delta") {
      if (pojo.delta) this.currentSpeech.push(pojo.delta);
    } else if (pojo.type === "response.reasoning_summary_text.done") {
      this.currentThought.splice(0, thinkingText.length, pojo.text);
    } else if (pojo.type === "response.output_text.done") {
      this.currentSpeech.splice(0, responseText.length, pojo.text);
    } else if (pojo.type === "response.completed") {
    } else {
      return false;
    }
    return true;
  }
  onReceive(chatApi, pojo) {
    switch (chatApi.apiType) {
      case "completions":
        return this.onReceiveCompletionsApi(pojo);
      case "responses":
        return this.onReceiveResponsesApi(pojo);
      default:
        util.assert.unreachable();
    }
  }
  async ask(chatApi, callback2) {
    const messages = this.messages.map((message) => message.toPojo());
    const responseMessage = await this.say("", "assistant");
    this.currentSpeech.length = 0;
    this.currentThought.length = 0;
    const onReceiveFragment = async (pojo) => {
      const isUnderstood = this.onReceive(chatApi, pojo);
      if (isUnderstood) {
        const thought2 = this.currentThought.join("");
        const speech2 = this.currentSpeech.join("");
        responseMessage.updateContent(speech2);
        callback2({ thought: thought2, speech: speech2, hasFinished: false });
      } else {
        console.warn(`Ignore message:`, pojo);
      }
    };
    const toolDeclarations = this.toolCalls.toolBox.getDeclarations();
    await chatApi.ask(messages, onReceiveFragment, toolDeclarations);
    const thought = this.currentThought.join("");
    const speech = this.currentSpeech.join("");
    responseMessage.updateContent(speech);
    if (thought !== "") console.log(`Thinking: ${thought}`);
    const toolCallResults = await this.toolCalls.performToolCalls(this);
    if (toolCallResults.size > 0) {
      for (const [tool_call_id, value] of toolCallResults.entries()) {
        this.say(value, "tool", { tool_call_id });
      }
      return await this.ask(chatApi, callback2);
    } else {
      callback2({ thought, speech, hasFinished: true });
      return speech;
    }
  }
};

// js/env/FileLayer.js
var FileLayer = class {
  constructor(storage = null) {
    this.storage = storage;
  }
  async load(path, fallback = void 0) {
    path = url_exports.qualifyPath(path);
    const data = await this.storage.getItem(path);
    if (data !== void 0) {
      return data;
    } else if (fallback !== void 0) {
      return fallback;
    } else {
      throw new Error(`Could not load file: ${path}`);
    }
  }
  async loadJson(path) {
    const data = await this.load(path);
    return JSON.parse(data);
  }
  async save(path, data = void 0) {
    path = url_exports.qualifyPath(path);
    return await this.storage.setItem(path, data);
  }
  async touch(path, data = "") {
    path = url_exports.qualifyPath(path);
    const currentValue = await this.storage.getItem(path);
    if (currentValue !== void 0) return false;
    await this.storage.setItem(path, data);
    return true;
  }
  async revert(path) {
    path = url_exports.qualifyPath(path);
    await this.storage.setItem(path);
    return await this.storage.getItem(path);
  }
};

// js/env/Storage.js
var Storage = class {
  constructor(parent) {
    this.parent = parent;
  }
  async getParentItem(key, fallback = void 0) {
    if (!this.parent) return fallback;
    return await this.parent.getItem(key, fallback);
  }
  async sync() {
  }
};

// js/env/ReadOnlyStorage.js
var ReadOnlyStorage = class extends Storage {
  constructor(parent, pojo) {
    super(parent);
    this.pojo = pojo;
  }
  async getItem(key, fallback = void 0) {
    const value = this.pojo[key];
    if (value !== void 0) return value;
    if (!this.parent) return fallback;
    return await this.parent.getItem(key, fallback);
  }
  async setItem(key, value) {
    if (this.parent) {
      return await this.parent.setItem(key, value);
    } else {
      throw new Error(`Cannot set ${key}=${value} in read only storage!`);
    }
  }
};

// js/env/ReadWriteStorage.js
var ReadWriteStorage = class extends Storage {
  constructor(parent, password = null) {
    super(parent);
    this.storage = window.localStorage;
    this.password = password;
    this.key = null;
    this.cache = /* @__PURE__ */ new Map();
  }
  async #getKey() {
    if (this.key || !this.password) return this.key;
    const encoded = new TextEncoder().encode(this.password);
    const rawKey = await crypto.subtle.digest("SHA-256", encoded);
    this.key = await crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
    return this.key;
  }
  async #encrypt(text) {
    const key = await this.#getKey();
    if (!key) return text;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedText = new TextEncoder().encode(text);
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedText
    );
    const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(cipherBuffer), iv.length);
    let binary = "";
    for (let i3 = 0; i3 < combined.byteLength; i3++) {
      binary += String.fromCharCode(combined[i3]);
    }
    return btoa(binary);
  }
  async #decrypt(b64) {
    const key = await this.#getKey();
    if (!key) return b64;
    try {
      const binary = atob(b64);
      const combined = new Uint8Array(binary.length);
      for (let i3 = 0; i3 < binary.length; i3++) {
        combined[i3] = binary.charCodeAt(i3);
      }
      const iv = combined.slice(0, 12);
      const cipherText = combined.slice(12);
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipherText
      );
      return new TextDecoder().decode(decryptedBuffer);
    } catch (e3) {
      return null;
    }
  }
  async getItem(key, fallback = void 0) {
    if (this.cache.has(key)) return this.cache.get(key);
    let value = this.storage.getItem(key);
    if (value) {
      if (this.password) {
        value = await this.#decrypt(value);
      }
      if (value) {
        try {
          return JSON.parse(value);
        } catch (e3) {
        }
      }
    }
    if (!this.parent) return fallback;
    return await this.parent.getItem(key, fallback);
  }
  async setItem(key, value = void 0) {
    this.cache.set(key, value);
  }
  async #syncItem(key, value = void 0) {
    let parentValue = void 0;
    if (this.parent) {
      parentValue = await this.parent.getItem(key);
    }
    if (value === parentValue || value === void 0) {
      this.storage.removeItem(key);
    } else {
      value = JSON.stringify(value);
      if (this.password) {
        value = await this.#encrypt(value);
      }
      this.storage.setItem(key, value);
    }
  }
  async sync() {
    for (const [key, value] of this.cache.entries()) {
      await this.#syncItem(key, value);
    }
    this.cache.clear();
  }
};

// js/env/Variables.js
var Variables = class {
  constructor(pojo) {
    this.pojo = pojo;
    this.listenerList = new ListenerList();
  }
  test(conditions) {
    const fields = string_exports.split(conditions, ",");
    for (const field of fields) {
      const eqIndex = field.indexOf("=");
      const lhs = field.substring(0, eqIndex).trim();
      const rhs = field.substring(eqIndex + 1).trim();
      const value = `${this.pojo[lhs]}`;
      if (value !== rhs) return false;
    }
    return true;
  }
  getValue(key, fallback = void 0) {
    const value = this.pojo[key];
    console.info(`get page variable: ${key}=${value}`);
    return value !== void 0 ? value : fallback;
  }
  setValue(key, value) {
    console.info(`Set page variable: ${key} = ${value}`);
    this.pojo[key] = value;
    this.listenerList.fire({ key, value });
    const elements = document.querySelectorAll("[data-if]");
    for (const element of elements) {
      const conditions = element.getAttribute("data-if");
      const isVisible = this.test(conditions);
      element.classList.toggle("hidden", !isVisible);
    }
  }
};

// js/env/GlobalEnv.js
var GlobalEnv = class {
  constructor(env) {
    this.pageName = url_exports.getPathComponents().pop();
    this.deviceFingerprint = this.getDeviceFingerprint();
    this.pageVariables = new Variables(window.lc);
    const files = this.pageVariables.getValue("files");
    const absFiles = {};
    for (const [key, value] of Object.entries(files)) {
      absFiles[url_exports.qualifyPath(key)] = value;
    }
    this.storage0 = new ReadOnlyStorage(null, absFiles);
    this.storage1 = new ReadWriteStorage(this.storage0, this.deviceFingerprint);
    this.storage = this.storage1;
    this.files = new FileLayer(this.storage);
    this.mountIds = {};
    console.info(`Device fingerprint is: ${this.deviceFingerprint}`);
    windowEvents.add("onTick50", this.#sync);
  }
  initialise() {
    this.pageVariables.setValue("today", time_exports.strftime("%d %B %Y"));
  }
  getDeviceFingerprint() {
    const parts = [
      `${screen.width}x${screen.height}`,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency ?? "-",
      navigator.deviceMemory ?? "-",
      navigator.maxTouchPoints ?? "0",
      navigator.platform ?? "-"
    ];
    return parts.join(":");
  }
  #sync = async (event2) => {
    await this.storage0.sync();
    await this.storage1.sync();
  };
};

// js/env/index.js
var globalEnv = new GlobalEnv(window.lc);

// js/ai/coreTools.js
function getEnv(env, args) {
  env = Object.assign({}, env);
  env["locale"] = client_exports.locale.name;
  env["date"] = client_exports.locale.dateString();
  env["time"] = client_exports.locale.timeString();
  env["username"] = "Lewis";
  return JSON.stringify(env);
}
function listFiles(env, args) {
  return globalEnv.files.listAbsolutePaths().join("\n");
}
function currentFile(env, args) {
  return JSON.stringify({
    filename: env.currentFilepath,
    contents: env.currentText
  });
}
async function loadFile(env, args) {
  if (!args.filename) return `The load command requires a filename.`;
  return await globalEnv.files.load(args.filename);
}
function addCoreTools(tb) {
  tb.addTool(
    getEnv,
    "getEnv",
    "Get environment information: date, time, locale, current user etc."
  );
  tb.addTool(
    listFiles,
    "listFiles",
    "List all available files."
  );
  tb.addTool(
    currentFile,
    "currentFile",
    "Return the filename and content of the file the user is currently editing."
  );
  tb.addTool(
    loadFile,
    "loadFile",
    "Read the contents of a file."
  ).addParameter(
    "filename",
    "string",
    "The full filename, as shown by the listFiles command.",
    true
  );
}

// js/ai/ChatSession.js
var ChatSession = class {
  constructor(config = {}) {
    const toolBox = config.toolbox ?? new ToolBox();
    addCoreTools(toolBox);
    const messages = config.messages ?? [];
    const env = config.env ?? {};
    this.chat = config.chat ?? new Chat(env, messages, toolBox);
    this.chatApi = config.chatApi ?? new ChatApi(config);
  }
  clear() {
    this.chat.clear();
  }
  getMessages() {
    return this.chat.getMessages();
  }
  async say(content, user = "user", callback2 = null) {
    const message = await this.chat.say(content, user);
    if (callback2 && !message.isSystemMessage()) {
      callback2();
      await this.chat.ask(this.chatApi, callback2);
    }
  }
};

// js/ui/ai/AiChatWindow.js
var AiChatWindow = class extends preact_exports.Component {
  #chatSession;
  #refs;
  constructor(props) {
    super(props);
    this.#chatSession = props.chatSession;
    this.#refs = {};
    this.state = { messages: this.#chatSession.getMessages() };
  }
  componentDidMount() {
    this.#chatSession.chat.listenerMap.add("update", this.#updateContent);
  }
  componentWillUnmount() {
    this.#chatSession.chat.listenerMap.remove("update", this.#updateContent);
  }
  #updateContent = async (event2) => {
    this.setState({ messages: this.#chatSession.getMessages() });
    dom_exports.scrollToBottom(this.#refs.contentWindow);
  };
  async userSay(text) {
    const callback2 = this.#updateContent.bind(this);
    await this.#chatSession.say(event.target.value, "user", callback2);
  }
  /*****************************************************************
   ** Render code                                                 **
   *****************************************************************/
  render() {
    styles_exports.loadCss({ path: `js/ui/ai/ai-chat-window.css`, content: `.ai-chat-window {
    display: flex;
    flex-flow: column nowrap;
    height: 16rem;

    & div.content {
        overflow-x: hidden;
        overflow-y: scroll;
        flex-grow: 1;
    }

    div.username {
        color: var(--pico-primary);
    }

    div.date {
        text-align: right;
        color: var(--pico-secondary);
    }

    div.speech {
        whitespace: pre-wrap;
    }

    & textarea {
        background: white;
        color: black;
        margin: 0;
        border: 0;
        padding: 0;
        resize: none;
        height: 4rem;
    }
}
` });
    const messageElements = this.state.messages.map((message, index) => {
      if (message.isSystemMessage()) return null;
      const dateText = client_exports.locale.dateString(message.timestamp);
      return html`
                <article key=${index} class="message">
                    <hgroup role="group">
                        <div class="username">${message.user.toString()}</div>
                        <div class="date">${dateText}</div>
                    </hgroup>
                    <div class="speech">${message.content}</div>
                </article>
            `;
    });
    const onKeyDown2 = (event2) => {
      if (event2.key === "Enter" && !event2.shiftKey) {
        this.userSay(event2.target.value);
        event2.target.value = "";
        event2.preventDefault();
      }
    };
    return html`
            <article class="ai-chat-window container">
                <div class="content" ref=${(node) => this.#refs.contentWindow = node}>
                    ${messageElements}
                </div>
                <textarea onKeyDown=${onKeyDown2}></textarea>
            </article>
        `;
  }
};

// js/ui/stores/index.js
var stores_exports = {};
__export(stores_exports, {
  PrimitiveStore: () => PrimitiveStore
});

// js/ui/stores/notifications.js
var notificationQueue = [];
var isNotifying = false;
function push(listeners, event2) {
  for (const listener of listeners) {
    notificationQueue.push({ listener, event: event2 });
  }
  if (!isNotifying) {
    isNotifying = true;
    if (notificationQueue.length > 20) {
      console.warn(`Notification queue length: ${notificationQueue.length}`);
    }
    let index = 0;
    while (index < notificationQueue.length) {
      const notification = notificationQueue[index];
      if (notification.listener === null) continue;
      notification.listener(notification.event);
      index += 1;
    }
    notificationQueue = [];
    isNotifying = false;
  }
}
function cancel(listener) {
  for (const notification of notificationQueue) {
    if (notification.listener === listener) {
      notification.listener = null;
    }
  }
}

// js/ui/stores/AbstractStore.js
var AbstractStore = class {
  #listeners;
  constructor(config) {
    this.#listeners = [];
  }
  addListener(listener) {
    if (this.#listeners.length > 10) {
      console.warn("Number of listeners: ${this.#listeners.length}");
    }
    this.#listeners.push(listener);
    return () => this.removeListener(listener);
  }
  removeListener(listener) {
    cancel(listener);
    const index = this.#listeners.indexOf(listener);
    if (index >= 0) this.#listeners.splice(index, 1);
  }
  notify(event2) {
    push(this.#listeners, event2);
  }
};

// js/ui/stores/PrimitiveStore.js
var PrimitiveStore = class _PrimitiveStore extends AbstractStore {
  #value;
  #storagePath;
  static of(initialValue, storagePath = void 0) {
    if (initialValue instanceof AbstractStore) return initialValue;
    if (storagePath) storagePath = url_exports.qualifyPath(storagePath);
    return new _PrimitiveStore(initialValue, storagePath);
  }
  constructor(initialValue, storagePath = void 0) {
    super();
    this.#value = initialValue;
    this.#storagePath = storagePath;
    if (storagePath) this.#loadFromLocalStorage();
  }
  async #loadFromLocalStorage() {
    const value = await globalEnv.storage.getItem(this.#storagePath, this.#value);
    this.setValue(value);
  }
  async #saveToLocalStorage() {
    if (this.#storagePath) {
      globalEnv.storage.setItem(this.#storagePath, this.#value);
    }
  }
  addAndFireListener(listener) {
    this.addListener(listener);
    listener({ newValue: this.#value, oldValue: void 0 });
  }
  getValue() {
    return this.#value;
  }
  setValue(newValue, forceTrigger = false) {
    const oldValue = this.#value;
    this.#value = newValue;
    if (oldValue !== newValue) {
      this.notify({ oldValue, newValue });
      this.#saveToLocalStorage();
    }
    return oldValue !== newValue;
  }
  resetValue(newValue) {
    const oldValue = this.#value;
    this.#value = newValue;
    this.notify({ oldValue, newValue });
    if (oldValue !== newValue) {
      this.#saveToLocalStorage();
    }
    return oldValue !== newValue;
  }
};

// js/ui/canvas/StaticCanvas.js
var StaticCanvas = class extends preact_exports.Component {
  #containerRef = null;
  #resizeObserver = null;
  #requestAnimationFrameId = null;
  #controller;
  #containerWidth = 0;
  #containerHeight = 0;
  #pointerState = { isPressed: false };
  #lastRenderState = {};
  constructor(props) {
    super(props);
    this.#controller = props.controller;
    this.state = {
      width: 0,
      height: 0,
      focusable: !!props.focusable
    };
  }
  componentDidMount() {
    this.#resizeObserver = new ResizeObserver((entries) => {
      this.#onResizeContainer();
    });
    this.#resizeObserver.observe(this.#containerRef);
    windowEvents.add("onAnimationFrame", this.#onAnimationFrame);
  }
  componentWillUnmount() {
    windowEvents.remove("onAnimationFrame", this.#onAnimationFrame);
    this.#resizeObserver?.disconnect();
  }
  #onResizeContainer = (event2) => {
    if (this.#containerRef) {
      const canvas = this.#controller.canvas;
      this.#containerWidth = this.#containerRef.clientWidth;
      this.#containerHeight = this.#containerRef.clientHeight;
      this.#controller.listenerMap.fire("onResize", canvas);
    }
  };
  #onAnimationFrame = (event2) => {
    const canvas = this.#controller.canvas;
    if (!canvas) return null;
    const lastState = this.#lastRenderState;
    this.#lastRenderState = {
      width: canvas.width,
      height: canvas.height
    };
    if (canvas.width !== lastState.width || canvas.height !== lastState.height) {
      this.#controller.listenerMap.fire("onRepaint", { canvas });
    }
    const controller = this.#controller;
    const preferredSize = controller.getPreferredSize();
    let width = preferredSize.x;
    let height = preferredSize.y;
    if (width === null) width = this.#containerWidth;
    if (height === null) height = this.#containerHeight;
    if (width !== this.state.width || height !== this.state.height) {
      this.setState({ width, height });
    }
    controller.listenerMap.fire("onAnimationFrame", {
      canvas,
      lastFrameTime: event2.lastFrameTime
    });
  };
  #onKeyEvent = (event2) => {
    event2.preventDefault();
    const controller = this.#controller;
    const canvas = controller.canvas;
    const wrappedEvent = { canvas: this, key: event2.key, event: event2 };
    switch (event2.type) {
      case "keydown":
        return controller.listenerMap.fire("onKeyDown", wrappedEvent);
      case "keypress":
        return controller.listenerMap.fire("onKeyPress", wrappedEvent);
      case "keyup":
        return controller.listenerMap.fire("onKeyUp", wrappedEvent);
    }
  };
  #onPointerEvent = (event2) => {
    const controller = this.#controller;
    const canvas = controller.canvas;
    if (canvas) {
      event2.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x3 = event2.clientX - rect.left;
      const y3 = event2.clientY - rect.top;
      const pressure = event2.pressure;
      const wrappedEvent = Object.assign({ x: x3, y: y3, canvas, event: event2 }, this.#pointerState);
      switch (event2.type) {
        case "pointerdown":
          this.#pointerState.isPressed = true;
          canvas.setPointerCapture(event2.pointerId);
          return controller.listenerMap.fire("onPointerDown", wrappedEvent);
        case "pointerup":
          this.#pointerState.isPressed = false;
          canvas.releasePointerCapture(event2.pointerId);
          return controller.listenerMap.fire("onPointerUp", wrappedEvent);
        case "pointercancel":
          this.#pointerState.isPressed = false;
          canvas.releasePointerCapture(event2.pointerId);
          return controller.listenerMap.fire("onPointerCancel", wrappedEvent);
        case "pointermove":
          return controller.listenerMap.fire("onPointerMove", wrappedEvent);
      }
    }
  };
  render() {
    loadCss({ path: `js/ui/canvas/static-canvas.css`, content: `div.my-canvas {
    image-rendering: pixelated;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    overflow: auto;
    background: #444;

    width: 100%;
    height: 100%;

    & canvas {
        touch-action: none;
    }
}
` });
    const setContainerRef = (node) => this.#containerRef = node;
    const setCanvasRef = (node) => this.#controller.setCanvas(node);
    const xprops = {};
    if (this.state.focusable) {
      xprops.tabindex = 0;
      xprops.onKeyDown = this.#onKeyEvent;
      xprops.onKeyPress = this.#onKeyEvent;
      xprops.onKeyUp = this.#onKeyEvent;
    }
    return html`
            <div class="my-canvas" ref=${setContainerRef}>
                <canvas ref=${setCanvasRef}
                    width=${this.state.width}
                    height=${this.state.height}
                    onPointerDown=${this.#onPointerEvent}
                    onPointerUp=${this.#onPointerEvent}
                    onPointerMove=${this.#onPointerEvent}
                    onPointerCancel=${this.#onPointerEvent}
                    ...${xprops}
                    />
            </div>
        `;
  }
};

// js/ui/canvas/DynamicCanvas.js
var DynamicCanvas = class extends preact_exports.Component {
  #controller;
  #refs;
  #lastFrameTime;
  #requestAnimationFrameId;
  #resizeObserver;
  constructor(props) {
    super(props);
    this.#controller = props.controller;
    this.#refs = {};
    this.#lastFrameTime = 0;
    this.#requestAnimationFrameId = null;
    this.#resizeObserver = null;
  }
  componentDidMount() {
    const container = this.#refs.container;
    const canvas = this.#refs.canvas;
    this.#resizeObserver = new ResizeObserver((entries) => {
      this.#resizeCanvas();
    });
    this.#resizeObserver.observe(container);
    this.#onAnimationFrame();
  }
  componentWillUnmount() {
    const canvas = this.#refs.canvas;
    this.#resizeObserver.disconnect();
    if (this.#requestAnimationFrameId !== null) {
      window.cancelAnimationFrame(this.#requestAnimationFrameId);
    }
  }
  #resizeCanvas() {
    const controller = this.#controller;
    const container = this.#refs.container;
    const canvas = this.#refs.canvas;
    if (container && canvas) {
      const preferredSize = controller?.getPreferredSize();
      if (preferredSize) {
        canvas.width = Math.min(container.clientWidth, preferredSize.x);
        canvas.height = preferredSize.y;
      } else {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
      this.#lastFrameTime = 0;
      controller.listenerMap.fire("resize", canvas);
    }
  }
  #onAnimationFrame = (event2) => {
    const controller = this.#controller;
    const canvas = this.#refs.canvas;
    if (canvas) {
      const lastFrameTime = this.#lastFrameTime;
      controller.listenerMap.fire("animation-frame", { canvas, lastFrameTime });
      this.#lastFrameTime = Date.now();
    }
    this.#requestAnimationFrameId = window.requestAnimationFrame(this.#onAnimationFrame);
  };
  #onPointerEvent = (event2) => {
    const canvas = this.#refs.canvas;
    if (canvas) {
      const controller = this.#controller;
      const rect = canvas.getBoundingClientRect();
      const x3 = event2.clientX - rect.left;
      const y3 = event2.clientY - rect.top;
      switch (event2.type) {
        case "pointerdown":
          return controller.listenerMap.fire("pointer-down", x3, y3, event2);
        case "pointerup":
          return controller.listenerMap.fire("pointer-up", x3, y3, event2);
        case "pointermove":
          return controller.listenerMap.fire("pointer-move", x3, y3, event2);
      }
    }
  };
  render() {
    loadCss({ path: `js/ui/canvas/dynamic-canvas.css`, content: `.dynamic-canvas {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    overflow: auto;
    background: #444;

    canvas {
        touch-action: none;
    }
}

` });
    const setContainerRef = (node) => this.#refs.container = node;
    const setCanvasRef = (node) => this.#refs.canvas = node;
    return html`
            <div class="dynamic-canvas" ref=${setContainerRef}>
                <canvas ref=${setCanvasRef} width="0" height="0"
                    onMouseDown=${this.#onPointerEvent}
                    onMouseUp=${this.#onPointerEvent}
                    onMouseMove=${this.#onPointerEvent}
                    />
            </div>
        `;
  }
};

// js/ui/canvas/CanvasController.js
var CanvasController = class {
  constructor(options = {}) {
    this.canvas = null;
    this.preferredSize = options.preferredSize ?? { x: null, y: null };
    this.listenerMap = new ListenerMap();
  }
  setCanvas(canvas) {
    this.canvas = canvas;
  }
  getContext2d() {
    return this.canvas.getContext("2d");
  }
  getPreferredSize() {
    return this.preferredSize;
  }
  setPreferredSize(x3, y3) {
    this.preferredSize = { x: x3, y: y3 };
  }
};

// js/ui/TextInput.js
var TextInput = class extends preact_exports.Component {
  #store;
  #unsubscriber;
  #ref;
  constructor(props) {
    super(props);
    this.#store = props.store;
  }
  componentDidMount() {
    this.#store.addListener(this.#onStoreUpdate);
    this.#ref.value = this.#store.getValue();
  }
  componentWillUnmount() {
    this.#store.removeListener(this.#onStoreUpdate);
  }
  #onStoreUpdate = (event2) => {
    this.#ref.value = event2.newValue;
    if (this.props.autofocus) this.#ref.focus();
  };
  #onKeyUp = (event2) => {
    this.#store.setValue(event2.target.value);
    if (event2.key === "Enter") {
      this.props.onSubmit?.call(null, event2);
    }
  };
  render() {
    const setRef = (node) => this.#ref = node;
    const xProps = object_exports.isolate(this.props, "autofocus");
    return html`
            <input type="text" ref=${setRef} onKeyUp=${this.#onKeyUp} ...${xProps} //>
        `;
  }
};

// js/ui/TextArea.js
var TextArea = class extends preact_exports.Component {
  #store;
  #unsubscriber;
  #ref;
  constructor(props) {
    super(props);
    this.#store = props.store;
  }
  componentDidMount() {
    this.#store.addListener(this.#onStoreUpdate);
    this.#ref.addEventListener("input", this.#onInput);
  }
  componentWillUnmount() {
    this.#ref.removeEventListener("input", this.#onInput);
    this.#store.removeListener(this.#onStoreUpdate);
  }
  #onStoreUpdate = (event2) => {
    this.#ref.value = event2.newValue;
  };
  #onInput = (event2) => {
    this.#store.setValue(event2.target.value);
  };
  render() {
    const setRef = (node) => this.#ref = node;
    const xProps = object_exports.isolate(this.props, "rows", "cols", "onInput", "onKeyUp", "value");
    return html`
            <textarea ref=${setRef} ...${xProps}></textarea>
        `;
  }
};

// js/ui/select-input/SelectItem.js
var SelectItem = class {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  isDisabled() {
    return false;
  }
  toString() {
    return this.name;
  }
};

// js/ui/select-input/ObjectSelector.js
var ObjectSelector = class extends preact_exports.Component {
  #store;
  #ref;
  constructor(props) {
    super(props);
    this.#store = props.store;
    this.state = {};
  }
  componentDidMount() {
    this.#store.addListener(this.#onStoreUpdate);
    this.#onStoreUpdate({
      newValue: this.#store.getValue()
    });
  }
  componentWillUnmount() {
    this.#store.removeListener(this.#onStoreUpdate);
  }
  #onStoreUpdate = (event2) => {
    const options = this.props.options;
    let isValid = false;
    for (let i3 = 0; i3 < options.length; i3 += 1) {
      const option = options[i3];
      if (option === event2.newValue) {
        this.#ref.value = `${i3}`;
        isValid = true;
      }
    }
    if (options.length > 0 && !isValid) {
      this.#store.setValue(options[0]);
      this.#ref.value = 0;
    }
  };
  #onChangeWrapper = (event2) => {
    const options = this.props.options;
    const key = parseInt(event2.target.value);
    const option = options[key];
    this.#store.setValue(option);
  };
  render() {
    styles_exports.loadCss({ path: `js/ui/select-input/select-input.css`, content: `
` });
    const classNames = new ClassNames();
    const { placeholder, options } = this.props;
    const elements = [];
    for (let i3 = 0; i3 < options.length; i3 += 1) {
      const option = options[i3];
      let isDisabled = false;
      const name = `${option}`;
      if (option instanceof SelectItem) {
        isDisabled = option.isDisabled();
      }
      elements.push(html`
                <option key=${i3} value=${i3} disabled=${isDisabled}>${name}</option>
            `);
    }
    let placeholderElement = null;
    if (placeholder) {
      placeholderElement = html`
                <option value="" disabled selected>${placeholder}</option>
            `;
    }
    const setRef = (node) => this.#ref = node;
    return html`
            <select required ref=${setRef} class=${classNames.toString()} onChange=${this.#onChangeWrapper}>
                ${placeholderElement}
                ${elements}
            </select>
        `;
  }
};

// js/ui/TabSelector.js
var TabSelector = class extends preact_exports.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabNames: this.props.tabs ?? [],
      selectedIndex: this.props.selectedIndex ?? 0
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    styles_exports.loadCss({ path: `js/ui/tab-selector.css`, content: `.tab-selector {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: start;
    flex-grow: 1;
    padding: 0.25rem 0;

    input[type=button] {
        margin: 0;
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 0;
    }
}
` });
    const tabNames = this.state.tabNames;
    const selectedIndex = this.state.selectedIndex;
    const tabs = [];
    for (let i3 = 0; i3 < tabNames.length; i3 += 1) {
      const tabIndex = i3;
      const tabName = tabNames[i3];
      const onClick = (event2) => this.setState({
        selectedIndex: tabIndex
      });
      const element = html`
                <input type="button" value=${tabName} onClick=${onClick} disabled=${i3 === selectedIndex} />
            `;
      tabs.push(element);
    }
    return html`
            <div class="tab-selector">
                ${tabs}
            </div>
        `;
  }
};

// js/ui/Clock.js
var Clock = class extends preact_exports.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      mode: "clock"
    };
  }
  /*
      getDerivedStateFromProps(props, state) {
          const changes = {}
          if (props.time) change.time = props.time
          if (props.mode) change.mode = props.mode
          return Object.assign({}, state, changes)
      }
  */
  componentDidMount() {
    windowEvents.add("onTick50", this.#onInterval);
  }
  componentWillUnmount() {
    windowEvents.remove("onTick50", this.#onInterval);
  }
  #onInterval = (event2) => {
    this.setState({
      timestamp: time_exports.getTimestamp()
    });
  };
  render() {
    styles_exports.loadCss({ path: `js/ui/clock.css`, content: `div.clock {
    font-family: digital, monospace;
    font-size: 25vh;
    color: green;
    text-align: center;
}

div.clock.negative {
    color: red;
}
` });
    const fixedTime = this.props.time ?? 0;
    const mode = this.props.mode ?? "clock";
    const now = TimeOfDay.now().toSeconds();
    let delta = null;
    if (mode === "countdown") {
      delta = Math.max(0, fixedTime - now);
    } else if (mode === "stopwatch") {
      delta = Math.max(0, now - fixedTime);
    } else {
      const d3 = /* @__PURE__ */ new Date();
      delta = d3.hours * 3600 + d3.minutes * 60 + d3.seconds;
    }
    const hours = Math.floor(delta / 3600);
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60);
    delta -= minutes * 60;
    const seconds = Math.floor(delta);
    const hourStr = `${hours}`.padStart(2, "0");
    const minuteStr = `${minutes}`.padStart(2, "0");
    const secondStr = `${seconds}`.padStart(2, "0");
    let text = "";
    if (hours > 0) text += `${hourStr}:`;
    text += `${minuteStr}:${secondStr}`;
    return html`
            <div class="clock">${text}</div>
        `;
  }
};

// js/ui/index.js
var prefs = {
  isDarkMode: false
};

// js/util/dom.js
function create(html2) {
  html2 = html2.trim();
  if (html2.startsWith("<")) {
    const node = document.createElement("div");
    node.innerHTML = html2;
    return node.firstChild;
  } else {
    return document.createTextNode(html2);
  }
}
function clear(node) {
  node.innerHTML = "";
}
function one(selector, element = document) {
  return element.querySelector(selector);
}
function all(selector, element = document) {
  return Array.from(element.querySelectorAll(selector));
}
function mount(selector, callback2) {
  onReady(function() {
    const elements = all(selector);
    for (const element of elements) {
      callback2(element);
    }
  });
}
function scrollToBottom(scrollPane) {
  if (scrollPane) {
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }
}

// js/util/image.js
var image_exports = {};
__export(image_exports, {
  load: () => load
});
async function load(url) {
  return new Promise(function(accept, reject) {
    const img = new Image();
    img.onload = function() {
      accept(img);
    };
    img.src = url;
  });
}

// js/util/client.js
var client_exports = {};
__export(client_exports, {
  loadText: () => loadText,
  locale: () => locale,
  saveText: () => saveText
});

// js/util/Locale.js
var Locale = class {
  constructor(name) {
    this.name = name;
  }
  getDate(timestamp = null) {
    return new Date(timestamp !== null ? timestamp : Date.now());
  }
  dateString(timestamp = null) {
    const date = this.getDate(timestamp);
    return date.toLocaleDateString(this.name, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      weekday: "short"
    });
  }
  timeString(timestamp = null) {
    const date = this.getDate(timestamp);
    return date.toLocaleDateString(this.name, {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
};

// js/util/client.js
var callback = null;
var locale = new Locale(navigator.language ?? "zh-CN");
async function saveText(text, filename, mime) {
  let fileOutput = one("#file-output");
  if (!fileOutput) {
    fileOutput = create(`<a id="file-output" class="hidden"></a>`);
    one("body").append(fileOutput);
  }
  const blob = new Blob([text], { type: mime });
  const link = document.createElement("a");
  const href = URL.createObjectURL(blob);
  fileOutput.href = href;
  fileOutput.download = filename;
  fileOutput.click();
  URL.revokeObjectURL(href);
}
async function loadText() {
  let fileInput = one("#file-input");
  if (!fileInput) {
    fileInput = create(`<input type="file" id="file-input" class="hidden">`);
    one("body").append(fileInput);
    fileInput.addEventListener("change", (event2) => {
      const file = event2.target.files[0];
      if (!file) {
        callback(null);
      } else {
        const reader = new FileReader();
        reader.onload = (event3) => {
          callback(event3.target.result);
        };
        reader.readAsText(file);
        fileInput.value = "";
      }
    });
  }
  return new Promise((accept, reject) => {
    callback = accept;
    fileInput.click();
  });
}

// js/util/clipboard.js
var clipboard_exports = {};
__export(clipboard_exports, {
  getText: () => getText,
  pasteListenerList: () => pasteListenerList,
  setText: () => setText
});
var mockClipboardText = "";
var pasteListenerList = new ListenerList();
async function setText(text) {
  mockClipboardText = text;
  try {
    await navigator?.clipboard?.writeText(text);
  } catch (e3) {
    console.error("Failed to copy to clipboard:", e3);
  }
}
async function getText() {
  try {
    return await navigator.clipboard.readText();
  } catch (e3) {
    return mockClipboardText;
  }
}
document.addEventListener("paste", function(event2) {
  const text = event2.clipboardData.getData("text/plain");
  pasteListenerList.fire({ text });
});

// js/util/time.js
var time_exports = {};
__export(time_exports, {
  getTimestamp: () => getTimestamp,
  sleep: () => sleep,
  sleepUntilTimestamp: () => sleepUntilTimestamp,
  strftime: () => strftime
});
function getTimestamp() {
  return Date.now() / 1e3;
}
async function sleep(milliseconds) {
  return new Promise(function(accept, reject) {
    window.setTimeout(accept, milliseconds);
  });
}
function sleepUntilTimestamp(timestamp) {
  return new Promise((resolve2, reject) => {
    function tick() {
      const remaining = timestamp - getTimestamp();
      if (remaining <= 0) {
        resolve2();
      } else {
        setTimeout(tick, Math.min(remaining, 1e3));
      }
    }
    tick();
  });
}
function strftime(sFormat, date) {
  if (!(date instanceof Date)) date = /* @__PURE__ */ new Date();
  const nDay = date.getDay();
  const nDate = date.getDate();
  const nMonth = date.getMonth();
  const nYear = date.getFullYear();
  const nHour = date.getHours();
  const nTime = date.getTime();
  const aDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const aMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const isLeapYear = () => nYear % 4 === 0 && nYear % 100 !== 0 || nYear % 400 === 0;
  const getThursday = () => {
    const target = new Date(date);
    target.setDate(nDate - (nDay + 6) % 7 + 3);
    return target;
  };
  const zeroPad = (nNum, nPad) => (Math.pow(10, nPad) + nNum + "").slice(1);
  return sFormat.replace(/%[a-zA-Z]+/g, (sMatch) => {
    return ({
      "%a": aDays[nDay].slice(0, 3),
      "%A": aDays[nDay],
      "%b": aMonths[nMonth].slice(0, 3),
      "%B": aMonths[nMonth],
      "%c": date.toUTCString().replace(",", ""),
      "%C": Math.floor(nYear / 100),
      "%d": zeroPad(nDate, 2),
      "%e": nDate,
      "%F": new Date(nTime - date.getTimezoneOffset() * 6e4).toISOString().slice(0, 10),
      "%G": getThursday().getFullYear(),
      "%g": (getThursday().getFullYear() + "").slice(2),
      "%H": zeroPad(nHour, 2),
      "%I": zeroPad((nHour + 11) % 12 + 1, 2),
      "%j": zeroPad(aDayCount[nMonth] + nDate + (nMonth > 1 && isLeapYear() ? 1 : 0), 3),
      "%k": nHour,
      "%l": (nHour + 11) % 12 + 1,
      "%m": zeroPad(nMonth + 1, 2),
      "%n": nMonth + 1,
      "%M": zeroPad(date.getMinutes(), 2),
      "%p": nHour < 12 ? "AM" : "PM",
      "%P": nHour < 12 ? "am" : "pm",
      "%s": Math.round(nTime / 1e3),
      "%S": zeroPad(date.getSeconds(), 2),
      "%u": nDay || 7,
      "%V": (() => {
        const thurs = getThursday();
        const firstJan = new Date(thurs.getFullYear(), 0, 1);
        let firstThurs = new Date(firstJan);
        firstThurs.setDate(firstJan.getDate() + (4 - firstJan.getDay() + 7) % 7);
        const nWeekDiff = (thurs - firstThurs) / 6048e5;
        return zeroPad(Math.round(nWeekDiff) + 1, 2);
      })(),
      "%w": nDay,
      "%x": date.toLocaleDateString(),
      "%X": date.toLocaleTimeString(),
      "%y": (nYear + "").slice(2),
      "%Y": nYear,
      "%z": (() => {
        const nOffset = date.getTimezoneOffset();
        const sSign = nOffset <= 0 ? "+" : "-";
        const nHours = Math.floor(Math.abs(nOffset) / 60);
        const nMinutes = Math.abs(nOffset) % 60;
        return sSign + zeroPad(nHours, 2) + zeroPad(nMinutes, 2);
      })(),
      "%Z": (() => {
        const sTime = date.toTimeString();
        const aMatches = sTime.match(/\((.+?)\)$/);
        return aMatches ? aMatches[1] : "";
      })(),
      "%Zs": new Intl.DateTimeFormat("default", {
        timeZoneName: "short"
      }).formatToParts(date).find((oPart) => oPart.type === "timeZoneName")?.value
    }[sMatch] || "") + "" || sMatch;
  });
}

// js/util/scripts.js
var scripts_exports = {};
__export(scripts_exports, {
  loadScript: () => loadScript,
  removeJavascript: () => removeJavascript
});
var scriptId = 0;
function loadScript(url, type = "text/javascript") {
  const id = `${scriptId++}-script`;
  return new Promise((resolve2, reject) => {
    let ready = false;
    function onLoad() {
      if (!ready) {
        ready = true;
        resolve2(id);
      }
    }
    function onError() {
      reject(new Error("Script loading error or abort"));
    }
    const script = document.createElement("script");
    script.crossOrigin = "";
    script.id = id;
    script.type = type;
    script.src = url;
    script.onreadystatechange = onLoad;
    script.onload = onLoad;
    script.onerror = onError;
    script.onabort = onError;
    document.append(script);
  });
}
function removeJavascript(id) {
  return new Promise((resolve2, reject) => {
    const script = document.getElementById(id);
    if (script) {
      script.remove();
      resolve2();
    } else {
      reject(new Error("Error removing script."));
    }
  });
}

// js/util/md5.js
function safeAdd(x3, y3) {
  let lsw = (x3 & 65535) + (y3 & 65535);
  let msw = (x3 >> 16) + (y3 >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q3, a3, b3, x3, s3, t4) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a3, q3), safeAdd(x3, t4)), s3), b3);
}
function md5ff(a3, b3, c3, d3, x3, s3, t4) {
  return md5cmn(b3 & c3 | ~b3 & d3, a3, b3, x3, s3, t4);
}
function md5gg(a3, b3, c3, d3, x3, s3, t4) {
  return md5cmn(b3 & d3 | c3 & ~d3, a3, b3, x3, s3, t4);
}
function md5hh(a3, b3, c3, d3, x3, s3, t4) {
  return md5cmn(b3 ^ c3 ^ d3, a3, b3, x3, s3, t4);
}
function md5ii(a3, b3, c3, d3, x3, s3, t4) {
  return md5cmn(c3 ^ (b3 | ~d3), a3, b3, x3, s3, t4);
}
function binlMD5(x3, len) {
  x3[len >> 5] |= 128 << len % 32;
  x3[(len + 64 >>> 9 << 4) + 14] = len;
  let i3;
  let olda;
  let oldb;
  let oldc;
  let oldd;
  let a3 = 1732584193;
  let b3 = -271733879;
  let c3 = -1732584194;
  let d3 = 271733878;
  for (i3 = 0; i3 < x3.length; i3 += 16) {
    olda = a3;
    oldb = b3;
    oldc = c3;
    oldd = d3;
    a3 = md5ff(a3, b3, c3, d3, x3[i3], 7, -680876936);
    d3 = md5ff(d3, a3, b3, c3, x3[i3 + 1], 12, -389564586);
    c3 = md5ff(c3, d3, a3, b3, x3[i3 + 2], 17, 606105819);
    b3 = md5ff(b3, c3, d3, a3, x3[i3 + 3], 22, -1044525330);
    a3 = md5ff(a3, b3, c3, d3, x3[i3 + 4], 7, -176418897);
    d3 = md5ff(d3, a3, b3, c3, x3[i3 + 5], 12, 1200080426);
    c3 = md5ff(c3, d3, a3, b3, x3[i3 + 6], 17, -1473231341);
    b3 = md5ff(b3, c3, d3, a3, x3[i3 + 7], 22, -45705983);
    a3 = md5ff(a3, b3, c3, d3, x3[i3 + 8], 7, 1770035416);
    d3 = md5ff(d3, a3, b3, c3, x3[i3 + 9], 12, -1958414417);
    c3 = md5ff(c3, d3, a3, b3, x3[i3 + 10], 17, -42063);
    b3 = md5ff(b3, c3, d3, a3, x3[i3 + 11], 22, -1990404162);
    a3 = md5ff(a3, b3, c3, d3, x3[i3 + 12], 7, 1804603682);
    d3 = md5ff(d3, a3, b3, c3, x3[i3 + 13], 12, -40341101);
    c3 = md5ff(c3, d3, a3, b3, x3[i3 + 14], 17, -1502002290);
    b3 = md5ff(b3, c3, d3, a3, x3[i3 + 15], 22, 1236535329);
    a3 = md5gg(a3, b3, c3, d3, x3[i3 + 1], 5, -165796510);
    d3 = md5gg(d3, a3, b3, c3, x3[i3 + 6], 9, -1069501632);
    c3 = md5gg(c3, d3, a3, b3, x3[i3 + 11], 14, 643717713);
    b3 = md5gg(b3, c3, d3, a3, x3[i3], 20, -373897302);
    a3 = md5gg(a3, b3, c3, d3, x3[i3 + 5], 5, -701558691);
    d3 = md5gg(d3, a3, b3, c3, x3[i3 + 10], 9, 38016083);
    c3 = md5gg(c3, d3, a3, b3, x3[i3 + 15], 14, -660478335);
    b3 = md5gg(b3, c3, d3, a3, x3[i3 + 4], 20, -405537848);
    a3 = md5gg(a3, b3, c3, d3, x3[i3 + 9], 5, 568446438);
    d3 = md5gg(d3, a3, b3, c3, x3[i3 + 14], 9, -1019803690);
    c3 = md5gg(c3, d3, a3, b3, x3[i3 + 3], 14, -187363961);
    b3 = md5gg(b3, c3, d3, a3, x3[i3 + 8], 20, 1163531501);
    a3 = md5gg(a3, b3, c3, d3, x3[i3 + 13], 5, -1444681467);
    d3 = md5gg(d3, a3, b3, c3, x3[i3 + 2], 9, -51403784);
    c3 = md5gg(c3, d3, a3, b3, x3[i3 + 7], 14, 1735328473);
    b3 = md5gg(b3, c3, d3, a3, x3[i3 + 12], 20, -1926607734);
    a3 = md5hh(a3, b3, c3, d3, x3[i3 + 5], 4, -378558);
    d3 = md5hh(d3, a3, b3, c3, x3[i3 + 8], 11, -2022574463);
    c3 = md5hh(c3, d3, a3, b3, x3[i3 + 11], 16, 1839030562);
    b3 = md5hh(b3, c3, d3, a3, x3[i3 + 14], 23, -35309556);
    a3 = md5hh(a3, b3, c3, d3, x3[i3 + 1], 4, -1530992060);
    d3 = md5hh(d3, a3, b3, c3, x3[i3 + 4], 11, 1272893353);
    c3 = md5hh(c3, d3, a3, b3, x3[i3 + 7], 16, -155497632);
    b3 = md5hh(b3, c3, d3, a3, x3[i3 + 10], 23, -1094730640);
    a3 = md5hh(a3, b3, c3, d3, x3[i3 + 13], 4, 681279174);
    d3 = md5hh(d3, a3, b3, c3, x3[i3], 11, -358537222);
    c3 = md5hh(c3, d3, a3, b3, x3[i3 + 3], 16, -722521979);
    b3 = md5hh(b3, c3, d3, a3, x3[i3 + 6], 23, 76029189);
    a3 = md5hh(a3, b3, c3, d3, x3[i3 + 9], 4, -640364487);
    d3 = md5hh(d3, a3, b3, c3, x3[i3 + 12], 11, -421815835);
    c3 = md5hh(c3, d3, a3, b3, x3[i3 + 15], 16, 530742520);
    b3 = md5hh(b3, c3, d3, a3, x3[i3 + 2], 23, -995338651);
    a3 = md5ii(a3, b3, c3, d3, x3[i3], 6, -198630844);
    d3 = md5ii(d3, a3, b3, c3, x3[i3 + 7], 10, 1126891415);
    c3 = md5ii(c3, d3, a3, b3, x3[i3 + 14], 15, -1416354905);
    b3 = md5ii(b3, c3, d3, a3, x3[i3 + 5], 21, -57434055);
    a3 = md5ii(a3, b3, c3, d3, x3[i3 + 12], 6, 1700485571);
    d3 = md5ii(d3, a3, b3, c3, x3[i3 + 3], 10, -1894986606);
    c3 = md5ii(c3, d3, a3, b3, x3[i3 + 10], 15, -1051523);
    b3 = md5ii(b3, c3, d3, a3, x3[i3 + 1], 21, -2054922799);
    a3 = md5ii(a3, b3, c3, d3, x3[i3 + 8], 6, 1873313359);
    d3 = md5ii(d3, a3, b3, c3, x3[i3 + 15], 10, -30611744);
    c3 = md5ii(c3, d3, a3, b3, x3[i3 + 6], 15, -1560198380);
    b3 = md5ii(b3, c3, d3, a3, x3[i3 + 13], 21, 1309151649);
    a3 = md5ii(a3, b3, c3, d3, x3[i3 + 4], 6, -145523070);
    d3 = md5ii(d3, a3, b3, c3, x3[i3 + 11], 10, -1120210379);
    c3 = md5ii(c3, d3, a3, b3, x3[i3 + 2], 15, 718787259);
    b3 = md5ii(b3, c3, d3, a3, x3[i3 + 9], 21, -343485551);
    a3 = safeAdd(a3, olda);
    b3 = safeAdd(b3, oldb);
    c3 = safeAdd(c3, oldc);
    d3 = safeAdd(d3, oldd);
  }
  return [a3, b3, c3, d3];
}
function binl2rstr(input) {
  let i3;
  let output = "";
  let length32 = input.length * 32;
  for (i3 = 0; i3 < length32; i3 += 8) {
    output += String.fromCharCode(input[i3 >> 5] >>> i3 % 32 & 255);
  }
  return output;
}
function rstr2binl(input) {
  let i3;
  let output = [];
  output[(input.length >> 2) - 1] = void 0;
  for (i3 = 0; i3 < output.length; i3 += 1) {
    output[i3] = 0;
  }
  let length8 = input.length * 8;
  for (i3 = 0; i3 < length8; i3 += 8) {
    output[i3 >> 5] |= (input.charCodeAt(i3 / 8) & 255) << i3 % 32;
  }
  return output;
}
function rstrMD5(s3) {
  return binl2rstr(binlMD5(rstr2binl(s3), s3.length * 8));
}
function rstrHMACMD5(key, data) {
  let i3;
  let bkey = rstr2binl(key);
  let ipad = [];
  let opad = [];
  let hash;
  ipad[15] = opad[15] = void 0;
  if (bkey.length > 16) {
    bkey = binlMD5(bkey, key.length * 8);
  }
  for (i3 = 0; i3 < 16; i3 += 1) {
    ipad[i3] = bkey[i3] ^ 909522486;
    opad[i3] = bkey[i3] ^ 1549556828;
  }
  hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
}
function rstr2hex(input) {
  let hexTab = "0123456789abcdef";
  let output = "";
  let x3;
  let i3;
  for (i3 = 0; i3 < input.length; i3 += 1) {
    x3 = input.charCodeAt(i3);
    output += hexTab.charAt(x3 >>> 4 & 15) + hexTab.charAt(x3 & 15);
  }
  return output;
}
function str2rstrUTF8(input) {
  return unescape(encodeURIComponent(input));
}
function rawMD5(s3) {
  return rstrMD5(str2rstrUTF8(s3));
}
function hexMD5(s3) {
  return rstr2hex(rawMD5(s3));
}
function rawHMACMD5(k3, d3) {
  return rstrHMACMD5(str2rstrUTF8(k3), str2rstrUTF8(d3));
}
function hexHMACMD5(k3, d3) {
  return rstr2hex(rawHMACMD5(k3, d3));
}
function md5(string, key, raw) {
  if (!key) {
    if (!raw) {
      return hexMD5(string);
    }
    return rawMD5(string);
  }
  if (!raw) {
    return hexHMACMD5(key, string);
  }
  return rawHMACMD5(key, string);
}

// js/util/net/TextStreamer.js
var TextStreamer = class {
  constructor(response) {
    this.reader = response.body.getReader();
    this.decoder = new TextDecoder("utf-8");
    this.lines = [];
    this.lineIndex = 0;
    this.buffer = "";
    this.isComplete = false;
  }
  async read() {
    if (this.isComplete) return false;
    const { value, done } = await this.reader.read();
    if (done) {
      this.lines.push(this.buffer);
      this.isComplete = true;
      return true;
    }
    ;
    this.buffer += this.decoder.decode(value, { stream: true });
    for (; ; ) {
      const eolIndex = this.buffer.indexOf("\n");
      if (eolIndex < 0) break;
      this.lines.push(this.buffer.substring(0, eolIndex));
      this.buffer = this.buffer.substring(eolIndex + 1);
    }
    return true;
  }
  async readLine() {
    while (!this.isComplete) {
      if (this.lineIndex < this.lines.length) {
        return this.lines[this.lineIndex++];
      }
      await this.read();
    }
    return null;
  }
};

// js/util/net/Url.js
var Url = class _Url {
  static from(url) {
    if (!url) {
      return null;
    } else if (url instanceof _Url) {
      return url;
    } else if (url instanceof URL) {
      url = url.toString();
    } else if (typeof url === "string") {
      url = resolve(url);
    }
    return new _Url(url);
  }
  constructor(url) {
    this.url = url;
  }
  async fetch(request = {}) {
    const response = await window.fetch(this.url, request);
    if (!response.ok) {
      throw new Error(response.text());
    }
    return await response;
  }
  async fetchText(request = {}) {
    const response = await this.fetch(request);
    return await response.text();
  }
  async fetchJson(request = {}) {
    const response = await this.fetch(request);
    return await response.json();
  }
  async streamText(request = {}) {
    const response = await this.fetch(request);
    return new TextStreamer(response);
  }
  async call(method, ...params) {
    const request = {
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now() + Math.random().toString(36).substr(2, 9)
    };
    const data = await this.fetchJson({
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });
    if (data.error) {
      const errorMsg = data.error.message ?? "Unknown RPC error";
      const errorCode = data.error.code ?? -32e3;
      throw new Error(`RPC Error ${errorCode}: ${errorMsg}`);
    }
    return data.result;
  }
  toString() {
    return this.url.toString();
  }
};

// js/util/ClassNames.js
var ClassNames = class {
  constructor(...names) {
    this.names = /* @__PURE__ */ new Set();
    this.add(...names);
  }
  add(...names) {
    for (const name of names) {
      this.names.add(name);
    }
    return this;
  }
  toString() {
    return Array.from(this.names).join(" ");
  }
};

// js/util/TimeOfDay.js
var TimeOfDay = class _TimeOfDay {
  static parseTime(text) {
    const fields = split(text, ":");
    const hours = fields.length >= 1 ? fields[0] : 0;
    const minutes = fields.length >= 2 ? fields[1] : 0;
    const seconds = fields.length >= 3 ? fields[2] : 0;
    return new _TimeOfDay(parseInt(hours), parseInt(minutes), parseInt(seconds));
  }
  static fromSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return new _TimeOfDay(hours, minutes, seconds);
  }
  static now() {
    const now = /* @__PURE__ */ new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return new _TimeOfDay(hours, minutes, seconds);
  }
  constructor(hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
  roundUp(...timesOfDay) {
    let leastDelta = 999999;
    let match = null;
    const seconds = this.toSeconds();
    for (const timeOfDay of timesOfDay) {
      const delta = timeOfDay.toSeconds() - seconds;
      if (delta >= 0 && delta < leastDelta) {
        leastDelta = delta;
        match = timeOfDay;
      }
    }
    return match;
  }
  cmp(timeOfDay) {
    const seconds1 = this.toSeconds();
    const seconds2 = timeOfDay.toSeconds();
    return seconds2 - seconds1;
  }
  difference(timeOfDay) {
    const seconds1 = this.toSeconds();
    const seconds2 = timeOfDay.toSeconds();
    return _TimeOfDay.fromSeconds(Math.abs(seconds2 - seconds1));
  }
  toSeconds() {
    return this.hours * 3600 + this.minutes * 60 + this.seconds;
  }
  toDate() {
    const now = /* @__PURE__ */ new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      this.hours,
      this.minutes,
      this.seconds,
      0
    );
  }
};

// js/util/BitString.js
var BitString = class _BitString {
  static fromHex(text) {
    const bitString = new _BitString();
    for (let i3 = 0; i3 < text.length; i3 += 2) {
      const byteHex = text.substring(i3, i3 + 2);
      const value = parseInt(byteHex, 16);
      bitString.data.push(value);
    }
    return bitString;
  }
  constructor() {
    this.data = [];
  }
  trim() {
    let index = this.data.length - 1;
    while (index >= 0 && this.data[index] === 0) {
      this.data.pop();
      index -= 1;
    }
  }
  getBit(index, value) {
    const byteIndex = Math.floor(index / 8);
    if (byteIndex >= this.data.length) return false;
    const bitmask = 1 << (index & 7);
    return (this.data[byteIndex] & bitmask) !== 0;
  }
  setBit(index, value) {
    const byteIndex = Math.floor(index / 8);
    while (this.data.length <= byteIndex) {
      this.data.push(0);
    }
    const bitmask = 1 << (index & 7);
    this.data[byteIndex] |= bitmask;
    if (!value) this.data[byteIndex] ^= bitmask;
    this.trim();
  }
  toHex(minLength = 0) {
    const digits = "0123456789ABCDEF";
    let chars = [];
    for (const datum of this.data) {
      chars.push(digits[datum >> 4 & 15] + digits[datum & 15]);
    }
    while (chars.length < minLength) {
      chars.push("00");
    }
    return chars.join("");
  }
};

// js/util/Random.js
var BITMASK32 = 4294967295;
var BITMASK28 = 268435455;
var seedSeed = 0;
function generateNext(seed) {
  seed = seed & BITMASK28;
  seed = seed + 2127912214 + (seed << 12) & BITMASK32;
  seed = (seed ^ 3345072700 ^ seed >>> 19) & BITMASK32;
  seed = seed + 374761393 + (seed << 5) & BITMASK32;
  seed = (seed + 3550635116 ^ seed << 9) & BITMASK32;
  seed = seed + 4251993797 + (seed << 3) & BITMASK32;
  seed = (seed ^ 3042594569 ^ seed >>> 16) & BITMASK32;
  return seed & BITMASK28;
}
function createSeed() {
  seedSeed ^= Date.now() & BITMASK28;
  seedSeed = generateNext(seedSeed);
  return seedSeed;
}
var Random = class {
  #seed;
  constructor(seed = void 0) {
    if (seed === void 0) {
      seed = createSeed();
    }
    this.#seed = seed;
  }
  choice(array) {
    const index = this.nextInt(array.length);
    return array[index];
  }
  nextInt(max) {
    return Math.floor(this.next() * max);
  }
  next() {
    this.#seed = generateNext(this.#seed);
    return this.#seed / (BITMASK28 + 1);
  }
};

// js/util/lexer/State.js
var State = class {
  constructor(parent, addr, start, end) {
    this.parent = parent;
    this.addr = addr;
    this.start = start;
    this.end = end;
  }
  getTokens(text) {
    const tokens = [];
    let node = this;
    for (let node2 = this; node2; node2 = node2.parent) {
      tokens.push(text.substring(node2.start, node2.end));
    }
    return tokens.reverse();
  }
};

// js/util/lexer/Lexer.js
var Lexer = class {
  constructor(lextab) {
    this.stateTable = lextab.states;
    this.actionTable = lextab.actions;
    this.maxAddr = this.stateTable.length;
    this.startStateAddr = this.actionTable[0];
  }
  getCell(stateAddr, offset) {
    const addr = stateAddr + offset;
    return this.stateTable[addr] === stateAddr ? this.actionTable[addr] : null;
  }
  lex(text, bestEffort = false) {
    const length = text.length;
    const startState = new State(null, this.startStateAddr, 0, 0);
    let states = [startState];
    for (let index = 0; index < length; index += 1) {
      const letter = text.charAt(index);
      const ascii = letter.codePointAt(0);
      const newStates = [];
      for (const state of states) {
        const stateAddr = state.addr;
        const nextStateAddr = this.getCell(state.addr, ascii);
        if (nextStateAddr === null) continue;
        const newState1 = new State(state.parent, nextStateAddr, state.start, index + 1);
        newStates.push(newState1);
        const match = this.getCell(nextStateAddr, 0);
        if (match) {
          const matchState = new State(state.parent, this.startStateAddr, state.start, index + 1);
          const newState2 = new State(matchState, this.startStateAddr, index + 1, index + 1);
          newStates.push(newState2);
        }
      }
      if (newStates.length === 0) break;
      states = newStates;
    }
    let bestState = states[0];
    for (const state of states) {
      const matchState = state.parent;
      if (matchState && matchState.index > bestState.index) {
        bestState = matchState;
      }
    }
    if (bestState.end === text.length) {
      return bestState.getTokens(text);
    } else if (bestEffort) {
      const tokens = bestState.getTokens(text);
      const unlexed = text.substring(bestState.end);
      return [...tokens, unlexed];
    } else return null;
  }
};

// js/util/pinyin/pinyin-table.js
var pinyin_table_default = {
  "states": [
    0,
    1,
    2,
    3,
    4,
    null,
    6,
    7,
    8,
    null,
    null,
    11,
    12,
    13,
    14,
    15,
    null,
    17,
    null,
    null,
    null,
    null,
    null,
    23,
    24,
    null,
    null,
    null,
    null,
    29,
    null,
    null,
    null,
    null,
    34,
    null,
    null,
    null,
    null,
    39,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    47,
    null,
    null,
    null,
    2,
    2,
    2,
    2,
    2,
    7,
    7,
    7,
    7,
    7,
    12,
    12,
    12,
    12,
    12,
    17,
    17,
    17,
    17,
    17,
    null,
    23,
    23,
    23,
    23,
    23,
    77,
    29,
    29,
    29,
    29,
    29,
    34,
    34,
    34,
    34,
    34,
    39,
    39,
    39,
    39,
    39,
    null,
    null,
    null,
    47,
    47,
    47,
    47,
    47,
    null,
    null,
    null,
    null,
    null,
    null,
    4,
    null,
    null,
    7,
    null,
    null,
    3,
    3,
    115,
    6,
    117,
    8,
    14,
    23,
    11,
    12,
    6,
    14,
    15,
    15,
    17,
    23,
    24,
    13,
    34,
    null,
    23,
    23,
    34,
    null,
    null,
    138,
    34,
    140,
    24,
    null,
    143,
    39,
    34,
    29,
    147,
    null,
    39,
    39,
    34,
    47,
    null,
    null,
    null,
    156,
    47,
    null,
    null,
    null,
    47,
    162,
    null,
    115,
    115,
    115,
    115,
    115,
    null,
    null,
    null,
    null,
    null,
    77,
    null,
    null,
    177,
    77,
    null,
    180,
    null,
    77,
    null,
    null,
    null,
    null,
    null,
    77,
    140,
    140,
    140,
    140,
    140,
    77,
    null,
    147,
    147,
    147,
    147,
    147,
    null,
    null,
    null,
    null,
    156,
    156,
    156,
    156,
    156,
    null,
    null,
    115,
    null,
    117,
    null,
    115,
    null,
    117,
    219,
    null,
    null,
    117,
    null,
    null,
    115,
    null,
    null,
    117,
    180,
    180,
    180,
    180,
    180,
    117,
    138,
    null,
    140,
    null,
    138,
    143,
    null,
    138,
    138,
    143,
    140,
    246,
    null,
    143,
    138,
    140,
    140,
    147,
    156,
    143,
    138,
    null,
    147,
    258,
    162,
    143,
    156,
    null,
    162,
    null,
    null,
    156,
    156,
    219,
    219,
    219,
    219,
    219,
    162,
    177,
    275,
    null,
    null,
    177,
    162,
    null,
    281,
    null,
    283,
    null,
    null,
    null,
    null,
    177,
    null,
    180,
    180,
    292,
    null,
    177,
    246,
    246,
    246,
    246,
    246,
    300,
    null,
    null,
    null,
    null,
    null,
    null,
    258,
    258,
    258,
    258,
    258,
    null,
    null,
    314,
    315,
    219,
    null,
    null,
    null,
    219,
    null,
    null,
    null,
    275,
    275,
    275,
    275,
    275,
    219,
    281,
    281,
    281,
    281,
    281,
    null,
    219,
    null,
    null,
    null,
    null,
    292,
    292,
    292,
    292,
    292,
    346,
    null,
    348,
    300,
    300,
    300,
    300,
    300,
    354,
    258,
    246,
    246,
    null,
    258,
    null,
    361,
    null,
    314,
    314,
    314,
    314,
    314,
    258,
    258,
    null,
    null,
    275,
    null,
    null,
    258,
    275,
    null,
    378,
    null,
    283,
    null,
    null,
    null,
    283,
    275,
    281,
    387,
    283,
    292,
    null,
    281,
    392,
    292,
    283,
    346,
    346,
    346,
    346,
    346,
    283,
    283,
    292,
    354,
    354,
    354,
    354,
    354,
    null,
    292,
    300,
    314,
    315,
    413,
    null,
    415,
    315,
    300,
    null,
    null,
    315,
    null,
    null,
    null,
    314,
    314,
    315,
    378,
    378,
    378,
    378,
    378,
    315,
    null,
    null,
    null,
    387,
    387,
    387,
    387,
    387,
    null,
    null,
    null,
    null,
    348,
    null,
    346,
    448,
    348,
    450,
    354,
    null,
    348,
    null,
    354,
    null,
    457,
    361,
    348,
    null,
    null,
    361,
    null,
    354,
    348,
    348,
    null,
    null,
    null,
    null,
    354,
    361,
    null,
    null,
    378,
    null,
    null,
    361,
    378,
    null,
    481,
    null,
    null,
    387,
    485,
    null,
    null,
    378,
    392,
    490,
    null,
    null,
    392,
    null,
    378,
    null,
    392,
    387,
    null,
    null,
    null,
    null,
    392,
    null,
    null,
    null,
    null,
    null,
    392,
    413,
    null,
    415,
    null,
    413,
    null,
    415,
    null,
    413,
    415,
    415,
    null,
    null,
    null,
    413,
    525,
    415,
    null,
    null,
    null,
    413,
    null,
    415,
    null,
    485,
    485,
    485,
    485,
    485,
    490,
    490,
    490,
    490,
    490,
    null,
    448,
    null,
    450,
    null,
    448,
    null,
    450,
    null,
    448,
    457,
    450,
    null,
    525,
    457,
    448,
    null,
    450,
    457,
    null,
    525,
    448,
    null,
    450,
    457,
    null,
    null,
    null,
    null,
    null,
    457,
    null,
    null,
    null,
    481,
    null,
    null,
    null,
    481,
    null,
    null,
    481,
    481,
    490,
    null,
    null,
    null,
    490,
    481,
    null,
    null,
    485,
    null,
    null,
    481,
    null,
    490,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    525,
    525,
    525,
    525,
    525,
    525,
    525,
    525,
    null,
    525,
    525,
    525,
    525,
    525,
    525,
    525,
    525,
    525,
    525,
    525,
    null,
    null,
    525,
    525,
    525,
    525
  ],
  "actions": [
    525,
    true,
    true,
    null,
    null,
    null,
    null,
    true,
    null,
    null,
    null,
    null,
    true,
    null,
    null,
    null,
    null,
    true,
    null,
    null,
    null,
    null,
    null,
    true,
    null,
    null,
    null,
    null,
    null,
    true,
    null,
    null,
    null,
    null,
    true,
    null,
    null,
    null,
    null,
    true,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    true,
    null,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    null,
    1,
    1,
    1,
    1,
    1,
    null,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    null,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    null,
    null,
    null,
    null,
    null,
    null,
    2,
    null,
    null,
    2,
    null,
    null,
    7,
    2,
    true,
    4,
    null,
    2,
    2,
    17,
    4,
    7,
    2,
    7,
    2,
    2,
    2,
    2,
    258,
    2,
    3,
    null,
    2,
    2,
    12,
    null,
    null,
    null,
    2,
    true,
    275,
    null,
    null,
    2,
    6,
    2,
    true,
    null,
    7,
    2,
    23,
    2,
    null,
    null,
    null,
    true,
    7,
    null,
    null,
    null,
    2,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    null,
    null,
    null,
    null,
    null,
    39,
    null,
    null,
    null,
    14,
    null,
    true,
    null,
    115,
    null,
    null,
    null,
    null,
    null,
    2,
    1,
    1,
    1,
    1,
    1,
    2,
    null,
    1,
    1,
    1,
    1,
    1,
    null,
    null,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    null,
    null,
    15,
    null,
    39,
    null,
    2,
    null,
    12,
    true,
    null,
    null,
    2,
    null,
    null,
    7,
    null,
    null,
    6,
    1,
    1,
    1,
    1,
    1,
    156,
    39,
    null,
    8,
    null,
    12,
    39,
    null,
    117,
    2,
    147,
    2,
    true,
    null,
    219,
    6,
    2,
    2,
    2,
    147,
    6,
    140,
    null,
    7,
    true,
    12,
    140,
    2,
    null,
    14,
    null,
    null,
    2,
    2,
    1,
    1,
    1,
    1,
    1,
    29,
    39,
    true,
    null,
    null,
    147,
    2,
    null,
    true,
    null,
    null,
    null,
    null,
    null,
    null,
    6,
    null,
    2,
    2,
    true,
    null,
    156,
    1,
    1,
    1,
    1,
    1,
    true,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    null,
    null,
    true,
    null,
    180,
    null,
    null,
    null,
    2,
    null,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    4,
    1,
    1,
    1,
    1,
    1,
    null,
    2,
    null,
    null,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    true,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    true,
    246,
    7,
    2,
    null,
    2,
    null,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    7,
    11,
    null,
    null,
    8,
    null,
    null,
    2,
    2,
    null,
    true,
    null,
    39,
    null,
    null,
    null,
    281,
    2,
    2,
    true,
    292,
    246,
    null,
    4,
    null,
    2,
    300,
    1,
    1,
    1,
    1,
    1,
    314,
    346,
    7,
    1,
    1,
    1,
    1,
    1,
    null,
    2,
    4,
    8,
    39,
    null,
    null,
    null,
    147,
    2,
    null,
    null,
    354,
    null,
    null,
    null,
    2,
    2,
    29,
    1,
    1,
    1,
    1,
    1,
    2,
    null,
    null,
    null,
    1,
    1,
    1,
    1,
    1,
    null,
    null,
    null,
    null,
    39,
    null,
    2,
    null,
    147,
    null,
    15,
    null,
    378,
    null,
    2,
    null,
    null,
    147,
    6,
    null,
    null,
    14,
    null,
    7,
    387,
    346,
    null,
    null,
    null,
    null,
    2,
    2,
    null,
    null,
    3,
    null,
    null,
    2,
    2,
    null,
    null,
    null,
    null,
    8,
    true,
    null,
    null,
    7,
    39,
    true,
    null,
    null,
    14,
    null,
    2,
    null,
    115,
    2,
    null,
    null,
    null,
    null,
    29,
    null,
    null,
    null,
    null,
    null,
    2,
    39,
    null,
    39,
    null,
    147,
    null,
    12,
    null,
    2,
    413,
    2,
    null,
    null,
    null,
    13,
    null,
    6,
    null,
    null,
    null,
    156,
    null,
    140,
    null,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    null,
    39,
    null,
    246,
    null,
    485,
    null,
    2,
    null,
    490,
    39,
    12,
    null,
    2,
    147,
    6,
    null,
    300,
    2,
    null,
    2,
    140,
    null,
    275,
    6,
    null,
    null,
    null,
    null,
    null,
    156,
    null,
    null,
    null,
    39,
    null,
    null,
    null,
    147,
    null,
    null,
    457,
    2,
    15,
    null,
    null,
    null,
    2,
    6,
    null,
    null,
    4,
    null,
    null,
    140,
    null,
    4,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    39,
    77,
    138,
    143,
    47,
    162,
    177,
    177,
    null,
    24,
    177,
    283,
    315,
    348,
    29,
    392,
    24,
    34,
    415,
    448,
    null,
    null,
    361,
    24,
    450,
    481
  ]
};

// js/util/pinyin/PinyinString.js
var pinyinLexer = new Lexer(pinyin_table_default);
var pinyinMarks = {
  a: "\u0101\xE1\u01CE\xE0a",
  e: "\u0113\xE9\u011B\xE8e",
  i: "\u012B\xED\u01D0\xECi",
  o: "\u014D\xF3\u01D2\xF2o",
  u: "\u016B\xFA\u01D4\xF9u",
  \u00FC: "\u01D6\u01D8\u01DA\u01DC\xFC",
  v: "\u01D6\u01D8\u01DA\u01DC\xFC"
};
function findToneIndex(base) {
  for (const special of ["a", "e", "ou"]) {
    const index = base.indexOf(special);
    if (index >= 0) return index;
  }
  for (let toneIndex = base.length - 1; toneIndex >= 0; toneIndex -= 1) {
    const char = base.charAt(toneIndex);
    if (pinyinMarks[char]) return toneIndex;
  }
  return null;
}
function toneNumberToDiacritic(phoneme) {
  const length = phoneme.length;
  const suffix = phoneme.charAt(length - 1);
  const hasTone = "12345".includes(suffix);
  if (!hasTone) return phoneme;
  const base = phoneme.substring(0, length - 1);
  const tone = parseInt(suffix);
  const toneIndex = findToneIndex(base);
  const tonelessLetter = base.charAt(toneIndex);
  const toneLetter = pinyinMarks[tonelessLetter][tone - 1];
  return base.slice(0, toneIndex) + toneLetter + base.slice(toneIndex + 1);
}
var PinyinString = class _PinyinString {
  static of(text) {
    text = text.toLowerCase();
    const rawTokens = pinyinLexer.lex(text);
    if (rawTokens === null) return null;
    const tokens = [];
    for (let token of rawTokens) {
      if (token.match(/r[1-5]?$/)) token = "e" + token;
      if (!token.match(/[a-z]/)) continue;
      const tone = token.charAt(token.length - 1);
      tokens.push("12345".includes(tone) ? token : token + "0");
    }
    return new _PinyinString(tokens);
  }
  constructor(tokens) {
    this.tokens = tokens;
  }
  toDiacritics() {
    return this.tokens.map(toneNumberToDiacritic).join(" ");
  }
  toString() {
    return this.tokens.join("");
  }
};

// js/util/index.js
var rpcUrl = Url.from(buildConfig.rpcURL);
async function rpc(method, ...args) {
  return await rpcUrl.call(method, ...args);
}

// js/ui/styles.js
var loadedSheets = /* @__PURE__ */ new Set();
async function loadCss(fileobj) {
  const { path, content } = fileobj;
  if (!loadedSheets.has(path)) {
    loadedSheets.add(path);
    const styleElement = dom_exports.create("<style>");
    styleElement.innerHTML = content;
    window.document.head.append(styleElement);
  }
}
async function loadStylesheet(url) {
  url = Url.from(url);
  const css = await url.fetchText();
  return await loadCss({ path: url.toString(), content: css });
}

export {
  config_exports,
  string_exports,
  object_exports,
  url_exports,
  preact_exports,
  html,
  loadCss,
  styles_exports,
  ListenerList,
  ListenerMap,
  onReady2 as onReady,
  windowEvents,
  DialogModel,
  Button,
  DialogLayer,
  DialogWindow,
  globalEnv,
  ChatSession,
  AiChatWindow,
  stores_exports,
  StaticCanvas,
  CanvasController,
  TextInput,
  TextArea,
  SelectItem,
  ObjectSelector,
  TabSelector,
  Clock,
  prefs,
  dom_exports,
  image_exports,
  client_exports,
  clipboard_exports,
  time_exports,
  scripts_exports,
  md5,
  Url,
  ClassNames,
  TimeOfDay,
  BitString,
  Random,
  PinyinString,
  rpc
};
