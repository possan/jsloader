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

