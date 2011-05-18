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

window.Loader = function(h) {
  var a = {scope:this.callee, r:"js", root:"", a:{h:[], loaded:[], m:[]}, w:!0}, i = {};
  a.log = function() {
    var a = !1;
    if(typeof console != "undefined") {
      try {
        console.log.apply(console, arguments), a = !0
      }catch(c) {
      }
    }
    if(!a && (a = document.getElementById("legacydebug"), typeof a != "undefined" && a)) {
      for(var d = document.createElement("div"), e = "", g = 0;g < arguments.length;g++) {
        e += arguments[g] + " "
      }
      d.innerHTML = e;
      a.appendChild(d)
    }
  };
  if(h && h.root) {
    a.root = h.root
  }
  if(h && h.extension) {
    a.r = h.extension
  }
  if(h && h.nocache) {
    a.w = h.nocache
  }
  a.d = [];
  a.i = function(b) {
    b.toString = function() {
      var a = "";
      typeof this.a != "undefined" && this.a.length > 0 && (a += "deps=" + this.a);
      typeof this.b != "undefined" && (a != "" && (a += ", "), a += "provides=" + this.b);
      return"[" + a + "]"
    };
    a.d.push(b);
    a.log("queueJob: queueing " + b);
    for(b = 0;b < a.d.length;b++) {
      a.log("queueJob: new queue #" + b + ": " + a.d[b])
    }
  };
  a.n = 0;
  a.B = function() {
    a.n++;
    if(a.d.length < 1) {
      a.log("combTick #" + a.n + "; queue empty.")
    }else {
      a.log("--------------------------------------------------------------------------");
      a.log("combTick #" + a.n + "; " + a.d.length + " jobs in queue.");
      a.log("deps.loading: " + a.a.h);
      a.log("deps.loaded: " + a.a.loaded);
      a.log("deps.ready: " + a.a.m);
      a.log("--------------------------------------------------------------------------");
      var b = a.d.splice(0, 1)[0];
      b.s(b)
    }
  };
  a.g = -1;
  a.c = function() {
    var b;
    a.g != -1 && clearTimeout(a.g);
    typeof b == "undefined" && (b = 100);
    a.g = setTimeout(function() {
      a.g = -1;
      a.B()
    }, b)
  };
  a.k = !1;
  a.F = function() {
    if(window.XMLHttpRequest) {
      return a.log("creating using window.XMLHttpRequest"), new XMLHttpRequest
    }else {
      if(window.ActiveXObject) {
        if(a.log("creating using window.ActiveXObject"), a.k) {
          return new ActiveXObject(a.k)
        }else {
          for(var b = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
            try {
              a.log("trying " + b[c]);
              var d = new ActiveXObject(b[c]);
              a.log("got " + d);
              if(d) {
                return a.k = b[c], d
              }
            }catch(e) {
            }
          }
        }
      }
    }
    a.log("no xhr created.");
    return!1
  };
  a.M = function(b, c) {
    var d = c ? c : {};
    if(typeof c == "function") {
      d = {}, d.e = c
    }
    var e = this, g = d.method || "get", f = a.F();
    typeof f == "undefined" ? a.log("unable to create a xhr") : (d.error = d.error && typeof d.error == "function" ? d.error : function() {
    }, f.onreadystatechange = function() {
      a.log("req.onreadystatechange", f.readyState);
      f.readyState == 4 && (a.log("req.status", f.status), (f.status === 0 || f.status == 200) && d.e.apply(f, [e]), /^[45]/.test(f.status) && d.error.apply(f))
    }, f.open(g, b, !0), e.N = f, f.send(""))
  };
  a.D = function(b) {
    b = a.root + b + "." + a.r;
    a.w && (b += "?dummy=" + escape(Math.random()));
    return b
  };
  if(!Array.indexOf) {
    Array.prototype.indexOf = function(a, c) {
      for(var d = c || 0;d < this.length;d++) {
        if(this[d] == a) {
          return d
        }
      }
      return-1
    }
  }
  Array.prototype.I = function(a) {
    for(var c = !1, d = 0;d < this.length;d++) {
      var e = a(this[d], d);
      c |= e
    }
    return c
  };
  Array.prototype.all = function(a) {
    a = Array.p(a);
    if(a.length < 1) {
      return!0
    }
    if(this.length < 1) {
      return!1
    }
    var c = this;
    return!a.I(function(a) {
      return c.indexOf(a) == -1
    })
  };
  Array.p = function(a) {
    if(typeof a != "undefined") {
      return typeof a == "string" && (a = [a]), a
    }
  };
  Array.prototype.o = function(a, c) {
    a = Array.p(a);
    typeof c == "undefined" && (c = !0);
    for(var d = 0;d < a.length;d++) {
      var e = a[d], g = this.indexOf(e);
      g == -1 && c ? this.push(e) : g != -1 && !c && this.splice(g, 1)
    }
  };
  Array.prototype.j = function(a) {
    this.o(a, !0)
  };
  Array.prototype.K = function(a) {
    this.o(a, !1)
  };
  a.H = function(b) {
    a.a.m.j(b)
  };
  a.f = function(b) {
    return a.a.m.all(b)
  };
  a.G = function(b) {
    a.a.loaded.j(b)
  };
  a.t = function(b) {
    return a.a.loaded.all(b)
  };
  a.v = function(b, c) {
    typeof c == "undefined" && (c = !0);
    c ? a.a.h.j(b) : a.a.h.K(b)
  };
  a.u = function(b) {
    return a.a.h.all(b)
  };
  a.q = function(b) {
    var c = [], d = {};
    d.requires = function(a) {
      typeof a == "string" && (a = [a]);
      c = a;
      return d
    };
    d.provides = function(e, g) {
      var f = {e:g, a:c, b:e};
      a.log("createModuleObject: provides called:", f);
      a.A(g, c, e, f);
      a.G(e);
      b(f);
      c = [];
      return d
    };
    return d
  };
  a.L = function(b) {
    var c = b.b;
    a.log("resolve: trying to resolve dependency: " + c);
    if(a.f(c) || a.u(c) || a.t(c)) {
      a.log("resolve: ", c, " already loaded, ready or loading..."), a.c()
    }else {
      a.v(c, !0);
      var d = a.D(c);
      a.log("resolve: Resolving dependency: " + c + " from " + d);
      a.log("-----xhr-----");
      a.M(d, {e:function() {
        a.v(c, !1);
        var b = this;
        a.log("resolve: downloaded", this.responseText);
        (function() {
          a.log("before create");
          var c = new Function("module", "loader", b.responseText);
          a.log("created", c);
          var d = a.q(function(b) {
            a.log("resolve: Module created from within resolve", b)
          });
          a.log("resolve: invoking.");
          c.apply(this, [d, i]);
          a.log("resolve: done invoking.")
        })();
        a.c()
      }, error:function() {
        a.log("resolve: failed to load", u);
        a.i(b);
        a.c()
      }})
    }
  };
  a.C = function(b) {
    a.log("exec: " + b);
    a.f(b.a) ? (a.log("exec: dependencies are met, run!"), b.e.apply(a.scope), typeof b.b != "undefined" && a.H(b.b)) : (a.log("exec: some missing dependencies", b.a), a.z(b.a), a.i(b));
    a.c()
  };
  a.A = function(b, c, d, e) {
    a.i({s:a.C, item:e, e:b, a:c, b:d})
  };
  a.J = function(b) {
    a.i({s:a.L, b:b})
  };
  a.z = function(b) {
    if(typeof b != "undefined") {
      typeof b == "string" && (b = [b]);
      for(var c = 0;c < b.length;c++) {
        var d = b[c];
        a.t(d) ? a.log("queueDepJobs: dependency already loaded: " + d) : a.f(d) ? a.log("queueDepJobs: dependency already ready: " + d) : a.u(d) ? a.log("queueDepJobs: dependency already loading: " + d) : (a.log("queueDepJobs: queueing resolve dependency job: " + d), a.J(d))
      }
    }
  };
  a.l = function(b, c) {
    a.log("innerRun: called with deps=", c, "callback=", b);
    typeof c == "string" && (c = [c]);
    typeof c == "undefined" && (c = []);
    a.log("innerRun: queue all dependencies");
    a.f(c) ? (a.log("innerRun: all dependencies satisfied, run now."), b.apply(a.scope)) : (a.log("innerRun: queue later."), a.A(b, c, void 0, void 0));
    a.c()
  };
  i.module = a.q(function() {
    a.log("Module created from Loader, start ticks")
  });
  i.load = function(b) {
    a.z(b);
    a.c()
  };
  i.requires = function(b, c) {
    a.l(c, b)
  };
  i.require = function(b, c) {
    a.l(c, b)
  };
  i.run = function(b, c) {
    a.l(b, c)
  };
  a.c();
  a.log("ready.");
  return i
};

