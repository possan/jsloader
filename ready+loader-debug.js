window.ready = function() {
  var d = window, a = {b:[], d:!1, c:!1};
  a.a = function() {
    if(!a.c) {
      a.c = !0;
      for(var b = 0;b < a.b.length;b++) {
        var c = a.b[b];
        try {
          c.e.apply(c.scope)
        }catch(d) {
        }
      }
      a.b = []
    }
  };
  if(!a.d) {
    a.d = !0;
    var b = document;
    b.readyState === "complete" ? setTimeout(a.a, 1) : b.addEventListener ? (b.addEventListener("load", a.a, !1), b.addEventListener("DOMContentLoaded", a.a, !1)) : b.attachEvent && (b.attachEvent("onload", a.a), b.attachEvent("onreadystatechange", a.a), d.attachEvent("onload", a.a))
  }
  return function(b) {
    var c = this.callee ? this.callee : this;
    a.c ? setTimeout(function() {
      b.apply(c)
    }, 1) : a.b.push({e:b, scope:c})
  }
}();

window.Loader = function(g) {
  function h(a, d) {
    for(var c = 0;c < a.length;c++) {
      if(a[c] == d) {
        return c
      }
    }
    return-1
  }
  var j = this.callee, a = {scope:j, f:[], b:{}, p:!0};
  a.root = g.root || "./";
  a.prefix = g.prefix || "";
  a.w = g.extension || ".js";
  a.p = g.nocache || !1;
  a.log = function() {
    var a = !1;
    if(typeof console != "undefined") {
      try {
        console.log.apply(console, arguments), a = !0
      }catch(d) {
      }
    }
    if(!a && (a = document.getElementById("legacydebug"), typeof a != "undefined" && a)) {
      for(var c = document.createElement("div"), e = "", i = 0;i < arguments.length;i++) {
        e += arguments[i] + " "
      }
      c.innerHTML = e;
      a.appendChild(c)
    }
  };
  a.k = [];
  a.j = function(b) {
    b.toString = function() {
      var a = "";
      typeof this.n != "undefined" && this.n.length > 0 && (a += "deps=" + this.n);
      typeof this.C != "undefined" && (a != "" && (a += ", "), a += "provides=" + this.C);
      return"[" + a + "]"
    };
    a.k.push(b);
    a.log("queueJob: queueing ", b)
  };
  a.r = 0;
  a.t = function() {
    a.r++;
    if(a.k.length < 1) {
      a.log("combTick #" + a.r + "; queue empty.")
    }else {
      a.log("--------------------------------------------------------------------------");
      a.log("BEFORE JOB");
      a.log("--------------------------------------------------------------------------");
      a.log("modulecache", a.b);
      a.log("loading", a.f);
      a.log("--------------------------------------------------------------------------");
      var b = a.k.splice(0, 1)[0];
      b.o(b);
      a.log("--------------------------------------------------------------------------");
      a.log("AFTER JOB");
      a.log("--------------------------------------------------------------------------");
      a.log("modulecache", a.b);
      a.log("loading", a.f);
      a.log("--------------------------------------------------------------------------")
    }
  };
  a.i = -1;
  a.c = function() {
    var b;
    a.i != -1 && clearTimeout(a.i);
    typeof b == "undefined" && (b = 500);
    a.i = setTimeout(function() {
      a.i = -1;
      a.t()
    }, b)
  };
  a.m = !1;
  a.B = function() {
    if(window.XMLHttpRequest) {
      return new XMLHttpRequest
    }else {
      if(window.ActiveXObject) {
        if(a.m) {
          return new ActiveXObject(a.m)
        }else {
          for(var b = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], d = 0;d < b.length;d++) {
            try {
              var c = new ActiveXObject(b[d]);
              if(c) {
                return a.m = b[d], c
              }
            }catch(e) {
            }
          }
        }
      }
    }
    return!1
  };
  a.F = function(b, d) {
    var c = d ? d : {};
    if(typeof d == "function") {
      c = {}, c.e = d
    }
    var e = this, i = c.method || "get", f = a.B();
    if(typeof f != "undefined") {
      c.error = c.error && typeof c.error == "function" ? c.error : function() {
      }, f.onreadystatechange = function() {
        f.readyState == 4 && ((f.status === 0 || f.status == 200) && c.e.apply(f, [e]), /^[45]/.test(f.status) && c.error.apply(f))
      }, f.open(i, b, !0), e.G = f, f.send("")
    }
  };
  a.A = function(b) {
    b = a.root + a.prefix + b + a.w;
    a.p && (b += "?dummy=" + escape(Math.random()));
    return b
  };
  a.l = function(a) {
    if(typeof a == "undefined") {
      return[]
    }
    if(typeof a == "string") {
      return[a]
    }
    return a
  };
  a.u = function(b) {
    return function(d, c, e) {
      typeof e == "undefined" ? typeof c == "undefined" ? (a.log("registering module ", b, " (", d, ") without dependencies"), a.b[b] = {e:d, a:[], d:!0}, a.log("marking module READY", b)) : (a.log("registering module", b, "(", c, ") with dependencies", d), a.b[b] = {e:c, a:d, d:!1}, a.h(d)) : (a.log("registering module ", b, "(", e, ") with dependencies", d), a.b[b] = {e:e, a:d, d:!1}, a.h(d))
    }
  };
  a.D = function(b) {
    var d = b.g;
    a.log("resolve: resolve dependency: " + d);
    if(d[0] == ".") {
      a.log("resolve:", d, "starts with dot, ignore."), a.c()
    }else {
      var c = a.b[d];
      if(typeof c != "undefined") {
        if(c.d == !0) {
          a.log("resolve:", d, "already cached (and ready).")
        }else {
          if(a.log("resolve:", d, "already cached but not ready yet, check dependencies."), !a.h(c.a)) {
            a.log("resolve:", d, "all dependencies ready, mark as ready."), c.d = !0
          }
        }
        a.c()
      }else {
        h(a.f, d) != -1 ? (a.log("resolve:", d, "is loading..."), a.c()) : (h(a.f, d) == -1 && a.f.push(d), c = a.A(d), a.log("resolve: Resolving dependency: " + d + " from " + c), a.F(c, {e:function() {
          a.f.splice(h(a.f, d), 1);
          var b = this;
          a.log("resolve: downloaded " + this.responseText);
          (function() {
            var c = a.u(d), f = new Function("define", b.responseText), g = {};
            try {
              f.apply(g, [c])
            }catch(h) {
              a.log("apply crashed."), a.log(h)
            }
            a.log("resolve: done invoking.")
          })();
          a.c()
        }, error:function() {
          a.log("resolve: failed to load", u);
          a.j(b);
          a.c()
        }}))
      }
    }
  };
  a.z = function(b) {
    b = a.l(b);
    a.log("queueDepJobs: check dependencies: " + b);
    if(b.length == 0) {
      return[]
    }
    for(var d = [], c = 0;c < b.length;c++) {
      var e = b[c];
      a.log("queueDepJobs: checking for dependency: " + e);
      typeof a.b[e] != "undefined" && a.b[e].d == !0 ? a.log("queueDepJobs: dependency already loaded: " + e) : d.push(e)
    }
    return d
  };
  a.h = function(b) {
    var b = a.l(b), d = !1, b = a.z(b);
    a.log("queueDepJobs: non ready dependencies:", b);
    for(var c = 0;c < b.length;c++) {
      d = b[c], a.log("queueDepJobs: queueing resolve dependency job: " + d), a.j({o:a.D, g:d}), d = !0
    }
    return d
  };
  a.s = function(b, d) {
    a.log("tryResolveDependencyValue: dep=" + b + ", allowqueue=" + d);
    var c = a.b[b];
    if(typeof c == "undefined") {
      return a.log("tryResolveDependencyValue: dep=" + b + ", invalid input"), !1
    }
    if(c.d == !0) {
      return a.log("tryResolveDependencyValue: dep=" + b + ", using cached ready-value"), !0
    }
    a.log("tryResolveDependencyValue: dep=" + b + ", module:", c);
    a.log("tryResolveDependencyValue: dep=" + b + ", module dependencies:", c.a);
    if(a.h(c.a)) {
      return a.c(), a.log("tryResolveDependencyValue: dep=" + b + ", has non-ready dependencies, requeue"), !1
    }
    for(var e = 0;e < c.a.length;e++) {
      a.log("tryResolveDependencyValue: dep=" + b + ", trying to resolve nested dependency #" + e + ", " + c.a[e]);
      if(a.s(c.a[e], d) == !1) {
        return a.log("tryResolveDependencyValue: dep=" + b + ", nested resolve #" + e + " failed."), !1
      }
      a.log("tryResolveDependencyValue: dep=" + b + ", nested resolve #" + e + " ok")
    }
    a.log("tryResolveDependencyValue: dep=" + b + ", caching as ready.");
    return c.d = !0
  };
  a.q = function(b) {
    a.log("resolveDependencyValue: dep=" + b);
    b = a.b[b];
    if(typeof b == "undefined") {
      return null
    }
    a.log("resolveDependencyValue module:", b);
    a.log("resolveDependencyValue module dependencies:", b.a);
    if(a.h(b.a)) {
      return a.log("resolveDependencyValue: some missing dependencies queued", b.a), a.c(), null
    }
    for(var d = [], c = 0;c < b.a.length;c++) {
      var e = a.q(b.a[c]);
      a.log("resolved arg #" + c + " = " + e);
      d.push(e)
    }
    a.log("final args", d);
    a.log("resolveDependencyValue: dependencies are met, run!");
    c = {};
    a.log("resolveDependencyValue calling module:", b);
    a.log("resolveDependencyValue: calling callback with args", d);
    j = {};
    c = b.e.apply(j, d);
    a.log("resolveDependencyValue: after callback, got", c);
    a.log("resolveDependencyValue exports", c);
    return c
  };
  a.v = function(b) {
    a.log("executeJob: executing: ", b);
    if(a.s(b.g, !0)) {
      a.log("executeJob: before execute");
      var d = a.q(b.g);
      a.log("executeJob: RESOLVED", b.g, "returned", d);
      a.b[b.g].d = !0
    }else {
      a.log("executeJob: cant resolve all dependencies, try later"), a.j(b)
    }
    a.c()
  };
  a.c();
  a.log("ready.");
  return function(b, d) {
    b = a.l(b);
    a.log("require: called with deps=", b, "callback=", d);
    var c = ".$" + Math.random();
    a.b[c] = {e:d, a:b, d:!1};
    a.h(b);
    a.j({o:a.v, g:c});
    a.c()
  }
};

