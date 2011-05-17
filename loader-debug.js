window.Loader = function(h) {
  var a = {scope:this.callee, r:"js", root:"", a:{h:[], loaded:[], m:[]}, v:!0}, i = {};
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
    a.v = h.nocache
  }
  a.d = [];
  a.i = function(b) {
    b.toString = function() {
      var a = "";
      typeof this.a != "undefined" && this.a.length > 0 && (a += "deps=" + this.a);
      typeof this.c != "undefined" && (a != "" && (a += ", "), a += "provides=" + this.c);
      return"[" + a + "]"
    };
    a.log("queueJob: queueing " + b);
    a.d.push(b);
    for(b = 0;b < a.d.length;b++) {
      a.log("queueJob: new queue #" + b + ": " + a.d[b])
    }
  };
  a.n = 0;
  a.A = function() {
    a.n++;
    if(a.d.length < 1) {
      a.log("combTick #" + a.n + "; queue empty."), a.b(2E3)
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
  a.b = function(b) {
    a.g != -1 && clearTimeout(a.g);
    typeof b == "undefined" && (b = 100);
    a.g = setTimeout(function() {
      a.g = -1;
      a.A()
    }, b)
  };
  a.k = !1;
  a.D = function() {
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
    a.log("q");
    var e = this, g = d.method || "get", f = a.D();
    typeof f == "undefined" ? a.log("unable to create a xhr") : (d.error = d.error && typeof d.error == "function" ? d.error : function() {
    }, f.onreadystatechange = function() {
      a.log("req.onreadystatechange", f.readyState);
      f.readyState == 4 && (a.log("req.status", f.status), (f.status === 0 || f.status == 200) && d.e.apply(f, [e]), /^[45]/.test(f.status) && d.error.apply(f))
    }, f.open(g, b, !0), e.N = f, f.send(""), a.log("q"))
  };
  a.C = function(b) {
    b = a.root + b + "." + a.r;
    a.v && (b += "?dummy=" + escape(Math.random()));
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
  a.u = function(b, c) {
    typeof c == "undefined" && (c = !0);
    c ? a.a.h.j(b) : a.a.h.K(b)
  };
  a.F = function(b) {
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
      var f = {e:g, a:c, c:e};
      a.log("createModuleObject: provides called:", f);
      a.z(g, c, e, f);
      a.G(e);
      b(f);
      c = [];
      return d
    };
    return d
  };
  a.L = function(b) {
    var c = b.c;
    a.log("resolve: trying to resolve dependency: " + c);
    if(a.f(c)) {
      a.log("resolve: ", c, " already ready, skip..."), a.b()
    }else {
      if(a.F(c)) {
        a.log("resolve: ", c, " already loading, wait..."), a.b()
      }else {
        if(typeof b.a != "undefined" && a.t(b.a)) {
          a.log("resolve: ", b.a, " already loaded, skip."), a.b()
        }else {
          a.u(c, !0);
          var d = a.C(c);
          a.log("resolve: Resolving dependency: " + c + " from " + d);
          a.log("-----xhr-----");
          a.M(d, {e:function() {
            a.u(c, !1);
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
            a.b()
          }, error:function() {
            a.log("resolve: failed to load", u);
            a.i(b);
            a.b()
          }})
        }
      }
    }
  };
  a.B = function(b) {
    a.log("exec: " + b);
    a.f(b.a) ? (a.log("exec: dependencies are met, run!"), b.e.apply(a.scope), typeof b.c != "undefined" && a.H(b.c)) : (a.log("exec: some missing dependencies", b.a), a.w(b.a), a.i(b));
    a.b()
  };
  a.z = function(b, c, d, e) {
    a.i({s:a.B, item:e, e:b, a:c, c:d})
  };
  a.J = function(b) {
    a.i({s:a.L, c:b})
  };
  a.w = function(b) {
    if(typeof b != "undefined") {
      typeof b == "string" && (b = [b]);
      for(var c = 0;c < b.length;c++) {
        var d = b[c];
        a.t(d) ? a.log("queueDepJobs: dependency already loaded: " + d) : a.f(d) ? a.log("queueDepJobs: dependency already ready: " + d) : (a.log("queueDepJobs: queueing resolve dependency job: " + d), a.J(d))
      }
    }
  };
  a.l = function(b, c) {
    a.log("innerRun: called with deps=", c, "callback=", b);
    typeof c == "string" && (c = [c]);
    typeof c == "undefined" && (c = []);
    a.log("innerRun: queue all dependencies");
    a.f(c) ? (a.log("innerRun: all dependencies satisfied, run now."), b.apply(a.scope)) : (a.log("innerRun: queue later."), a.z(b, c, void 0, void 0));
    a.b()
  };
  i.module = a.q(function() {
    a.log("Module created from Loader, start ticks")
  });
  i.load = function(b) {
    a.w(b);
    a.b()
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
  a.b();
  a.log("ready.");
  return i
};

