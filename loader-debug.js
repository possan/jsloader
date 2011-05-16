window.Loader = function(e) {
  typeof XMLHttpRequest == "undefined" && (XMLHttpRequest = function() {
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0")
    }catch(a) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0")
    }catch(c) {
    }
    try {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }catch(d) {
    }
    throw Error("This browser does not support XMLHttpRequest.");
  });
  var a = {scope:this.callee, u:"js", root:"", a:{p:[], loaded:[], B:[]}, A:!1, t:!1, h:[], log:function() {
    console.log.apply(console, arguments)
  }};
  if(e && e.root) {
    a.root = e.root
  }
  if(e && e.extension) {
    a.u = e.extension
  }
  if(e && e.nocache) {
    a.A = e.nocache
  }
  if(e && e.domevents) {
    a.t = e.domevents
  }
  a.e = [];
  a.g = function(b) {
    a.log("queue job", b);
    a.e.push(b);
    a.log("new queue length: " + a.e.length, a.e)
  };
  a.C = function() {
    a.log("combTick; queue length: " + a.e.length);
    if(a.e.length < 1) {
      a.c(6E3)
    }else {
      var b = a.e.splice(0, 1)[0];
      a.log("running job", b);
      b.i(b)
    }
  };
  a.k = -1;
  a.c = function(b) {
    a.k != -1 && clearTimeout(a.k);
    typeof b == "undefined" && (b = 1E3);
    a.log("queue comb tick; delay=" + b);
    a.k = setTimeout(function() {
      a.k = -1;
      a.C()
    }, b)
  };
  a.L = function(a, c) {
    function d() {
      f.readyState == 4 && (delete e.Q, (f.status === 0 || f.status == 200) && f.F(), /^[45]/.test(f.status) && f.handleError())
    }
    var g = c ? c : {};
    if(typeof c == "function") {
      g = {}, g.b = c
    }
    var e = this, f = new XMLHttpRequest, l = g.method || "get", j = g.async || !0, k = g.data || null, h = 0;
    f.O = k;
    f.open(l, a, j);
    if(g.headers) {
      for(;h < g.headers.length;h++) {
        f.setRequestHeader(g.headers[h].name, g.headers[h].value)
      }
    }
    f.F = g.b;
    f.handleError = g.error && typeof g.error == "function" ? g.error : function() {
    };
    if(j) {
      f.onreadystatechange = d, xmlHttpRequest = f
    }
    f.send(k)
  };
  a.D = function(b) {
    b = a.root + b + "." + a.u;
    a.A && (b += "?dummy=" + escape(Math.random()));
    return b
  };
  Array.prototype.find = function(a) {
    for(var c = !1, d = 0;d < this.length;d++) {
      c |= a(this[d], d)
    }
    return c
  };
  Array.prototype.m = function(a) {
    return this.find(function(c) {
      return a.indexOf(c) != -1
    })
  };
  Array.f = function(a) {
    if(typeof a != "undefined") {
      return typeof a == "string" && (a = [a]), a
    }
  };
  Array.prototype.r = function(b, c) {
    a.log("enableItems: ", b, c);
    typeof c == "undefined" && (c = !0);
    if(typeof b != "undefined") {
      typeof b == "string" && (b = [b]);
      for(var d = 0;d < b.length;d++) {
        var g = b[d], e = this.indexOf(g);
        e == -1 && c ? (a.log("enableItems: adding " + g), this.push(g)) : e != -1 && !c && (a.log("enableItems: removing " + g), this.splice(e, 1))
      }
    }
  };
  Array.prototype.l = function(a) {
    this.r(a, !0)
  };
  Array.prototype.J = function(a) {
    this.r(a, !1)
  };
  a.H = function(b) {
    b = Array.f(b);
    a.log("markReady: ", b);
    a.a.B.l(b)
  };
  a.G = function(b) {
    b = Array.f(b);
    if(b.length == 0) {
      return!0
    }
    return a.a.B.m(b)
  };
  a.M = function(b) {
    b = Array.f(b);
    a.log("markLoaded: ", b);
    a.a.loaded.l(b)
  };
  a.z = function(b, c) {
    b = Array.f(b);
    a.log("markLoading: ", b, c);
    typeof c == "undefined" && (c = !0);
    c ? a.a.p.l(b) : a.a.p.J(b)
  };
  a.w = function(b) {
    b = Array.f(b);
    if(b.length == 0) {
      return!0
    }
    return a.a.p.m(b)
  };
  a.o = function(b) {
    b = Array.f(b);
    if(b.length == 0) {
      return!0
    }
    return a.a.loaded.m(b)
  };
  a.s = function(b) {
    var c = [], d = {};
    d.requires = function(a) {
      typeof a == "string" && (a = [a]);
      c = a;
      return d
    };
    d.provides = function(e, i) {
      var f = {event:event, b:i, a:c, q:e};
      a.log("createModuleObject: provides called:", f);
      a.g({i:a.n, item:f, b:i, a:c, q:e});
      b(f);
      return d
    };
    return d
  };
  a.I = function(b) {
    a.log("queueDepJobs: ", b);
    if(typeof b != "undefined") {
      typeof b == "string" && (b = [b]);
      for(var c = 0;c < b.length;c++) {
        var d = b[c];
        !a.o(d) && !a.w(d) && (a.log("queueDepJobs: queueing resolve dependency job: " + d), a.g({i:a.K, name:d}))
      }
    }
  };
  a.K = function(b) {
    var c = b.name;
    a.log("resolveDependencyJob: trying to resolve dependency: " + c);
    if(typeof b.a != "undefined" && a.o(b.a)) {
      a.log("resolveDependencyJob: ", b.a, " already loaded, skip."), a.c()
    }else {
      if(a.w(c)) {
        a.log("resolveDependencyJob: ", c, " already loading, wait..."), a.c()
      }else {
        a.z(c, !0);
        a.log("resolveDependencyJob: Resolving dependency: " + c);
        var d = a.D(c);
        a.log("resolveDependencyJob: downloading", d);
        a.L(d, {b:function() {
          a.z(c, !1);
          a.log("resolveDependencyJob: downloaded", this.responseText);
          var b = new Function("module", this.responseText), d = a.s(function(b) {
            a.log("resolveDependencyJob: Module created from within resolveDependencyJob", b)
          });
          a.log("resolveDependencyJob: invoking.");
          b(d);
          a.c()
        }, error:function() {
          a.log("resolveDependencyJob: failed to load", u);
          a.g(b);
          a.c()
        }})
      }
    }
  };
  a.n = function(b) {
    a.log("executeFunctionJob:", b);
    a.G(b.a) ? (a.log("executeFunctionJob: dependencies are met, run!"), b.b.apply(a.scope), typeof b.q != "undefined" && a.H(b.q)) : (a.log("executeFunctionJob: missing dependencies", b.a), a.I(b.a), a.g(b));
    a.c()
  };
  a.j = function(b, c, d) {
    a.log("innerRun: called with deps=", c, "event=", d, "callback=", b);
    typeof c == "string" && (c = [c]);
    typeof c == "undefined" && (c = []);
    typeof d == "undefined" && (d = "");
    d != "" ? (a.log("innerRun: is event (" + d + "), queue for later run."), a.h.push({event:d, b:b, a:c})) : (a.log("innerRun: queue all dependencies"), a.o(c) ? (a.log("innerRun: all dependencies satisfied, run now."), b.apply(a.scope)) : (a.log("innerRun: queue later."), a.g({i:a.n, b:b, a:c})), a.c())
  };
  a.d = function(b) {
    a.log("innerFire: fire events (" + b + ")");
    for(var c = [], d = 0;d < a.h.length;d++) {
      a.h[d].event == b && c.push(d)
    }
    if(!(c.length < 1)) {
      for(d = 0;d < c.length;d++) {
        b = a.h[c[d]], a.g({i:a.n, b:b.b, a:b.a})
      }
      for(d = c.length - 1;d >= 0;d--) {
        a.h.splice(c[d], 1)
      }
      a.c()
    }
  };
  a.v = function() {
    document.addEventListener ? (document.addEventListener("load", function() {
      a.d("load")
    }, !1), document.addEventListener("DOMContentLoaded", function() {
      a.d("ready")
    }, !1)) : document.attachEvent ? (document.attachEvent("onload", function() {
      a.d("load")
    }), document.attachEvent("ondocumentready", function() {
      a.d("ready")
    })) : (document.onload = function() {
      a.d("load")
    }, document.N = function() {
      a.d("ready")
    })
  };
  e = {};
  e.module = a.s(function() {
    a.log("Module created from Loader, start ticks")
  });
  e.load = function(b) {
    a.P(b)
  };
  e.requires = function(b, c) {
    a.j(c, b, "")
  };
  e.require = function(b, c) {
    a.j(c, b, "")
  };
  e.when = function(b, c) {
    a.j(c, [], b)
  };
  e.fire = function(b) {
    a.d(b)
  };
  e.run = function(b, c, d) {
    a.j(b, c, d)
  };
  e.registerDomEvents = function() {
    a.v()
  };
  a.t && a.v();
  a.c();
  return e
};

