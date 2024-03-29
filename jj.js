var jsGame = window.jsGame || {};
(function() {
  var B = window.eval;
  window.eval = function(b) {
    if (b.indexOf("jsGame") < 0) return B(b)
  };
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.setTimeout;
  var a = {
      canvas: {
        id: "jsGameScreen",
        defaultId: "jsGameScreen",
        defaultFont: "12px Arial",
        defaultWidth: 240,
        defaultHeight: 320,
        defaultColor: "rgb(0, 0, 0)",
        bgColor: "#6A6A6A",
        cavansDoms: [],
        ctxs: [],
        device: "",
        fps: 1,
        touch: false,
        zoom: 1
      },
      system: {
        loadRes: null,
        pageLoad: null,
        menu: null,
        run: null,
        runFn: null,
        stop: null,
        over: null,
        zone: null,
        active: null,
        timeout: 30,
        isPause: false,
        gameFlow: 0,
        zoneArgs: null,
        activeArgs: null,
        spendTime: 0
      },
      event: {
        key: 0,
        keys: {
          up: false,
          down: false,
          left: false,
          right: false,
          a: false,
          b: false,
          c: false,
          menu: false,
          quit: false
        },
        lastKey: {
          up: false,
          down: false,
          left: false,
          right: false,
          a: false,
          b: false,
          c: false,
          menu: false,
          quit: false
        },
        pressedKey: {
          up: false,
          down: false,
          left: false,
          right: false,
          a: false,
          b: false,
          c: false,
          menu: false,
          quit: false
        },
        keyPressCtrl: {
          up: true,
          down: true,
          left: true,
          right: true,
          a: true,
          b: true,
          c: true,
          menu: true,
          quit: true
        },
        keyDownGo: false,
        keyUpGo: false,
        keyPressedGo: false,
        keyDownCallBack: null,
        keyUpCallBack: null,
        orientationChange: null,
        touchStart: null,
        touchEnd: null,
        touchMove: null,
        touchCancel: null,
        clickCallBack: null,
        mouseDownCallBack: null,
        mouseUpCallBack: null,
        mouseMoveCallBack: null,
        mouseDowned: false
      },
      image: {
        imgs: [],
        imgObjs: [],
        imgCount: 0,
        countLoaded: 0,
        reCountLoaded: 0,
        loadImgId: "jsGameLoadImg",
        loadedImg: false,
        loadFrame: [],
        tips: ["\u52a0\u8f7d\u9700\u8981\u4e00\u70b9\u65f6\u95f4", "\u591a\u6ce1\u6e38\u620f\u5feb\u4e50\u4f60\u6211\u4ed6", "\u4e0e\u670b\u53cb\u5206\u4eab\u4f60\u7684\u5feb\u4e50", "\u6309#\u952e\u8fd4\u56de\u793e\u533a\u5148\u73a9\u73a9", "\u957f\u6309#\u952e\u5f3a\u5236\u9000\u51fa\u6e38\u620f"],
        tip: "",
        tipIndex: 0,
        tipSkip: 0
      },
      audio: {
        audios: [],
        fuckSkip: 0
      },
      ajax: {
        xhrObj: null,
        pool: [],
        poolLength: 5,
        date: new Date,
        isTimeout: false,
        param: {
          type: "get",
          data: null,
          dataType: "html",
          url: "",
          timeout: 5E3,
          before: function() {},
          success: function() {},
          error: function() {},
          complete: function() {}
        }
      },
      request: {
        gets: []
      },
      timer: {
        lockIds: {}
      },
      error: {
        img: {
          msg: "\u8d44\u6e90\u52a0\u8f7d\u51fa\u9519",
          callBack: function() {}
        }
      }
    },
    g = {
      canvas: {
        context: {
          base: 0
        },
        graphics: {
          HCENTER: 1,
          VCENTER: 2,
          LEFT: 4,
          RIGHT: 8,
          TOP: 16,
          BOTTOM: 32,
          ANCHOR_LT: 20,
          ANCHOR_LV: 6,
          ANCHOR_LB: 36,
          ANCHOR_HT: 17,
          ANCHOR_HV: 3,
          ANCHOR_HB: 33,
          ANCHOR_RT: 24,
          ANCHOR_RV: 10,
          ANCHOR_RB: 40
        },
        trans: {
          TRANS_MIRROR: 2,
          TRANS_NONE: 0,
          TRANS_ROT90: 5,
          TRANS_ROT180: 3,
          TRANS_ROT270: 6,
          TRANS_MIRROR_ROT90: 7,
          TRANS_MIRROR_ROT180: 1,
          TRANS_MIRROR_ROT270: 4
        }
      },
      event: {
        key: {
          up: 38,
          down: 40,
          left: 37,
          right: 39,
          a: 90,
          b: 88,
          c: 67,
          menu: -6,
          quit: -7,
          pcmenu: 49,
          pcquit: 50
        }
      },
      system: {
        gameFlowType: {
          menu: 0,
          run: 1,
          stop: 2,
          over: 3,
          zone: 4,
          active: 5,
          loadImage: 6
        }
      }
    },
    o = {
      keydown: function(b) {
        var c = o.checkKey(b.keyCode);
        if (a.event.keyDownGo)
          if (a.event.keys[c] != undefined) a.event.keys[c] = true;
        if (a.event.keyUpGo)
          if (a.event.lastKey[c] != undefined) a.event.lastKey[c] = false;
        if (a.event.keyPressCtrl[c] && a.event.keyPressedGo) {
          if (a.event.pressedKey[c] != undefined) a.event.pressedKey[c] = true;
          a.event.keyPressCtrl[c] =
            false
        }
        a.event.keyDownCallBack != null && a.event.keyDownCallBack(b)
      },
      keyup: function(b) {
        var c = o.checkKey(b.keyCode);
        if (a.event.keyDownGo)
          if (a.event.keys[c] != undefined) a.event.keys[c] = false;
        if (a.event.keyUpGo)
          if (a.event.lastKey[c] != undefined) a.event.lastKey[c] = true;
        if (a.event.keyPressedGo) {
          if (a.event.pressedKey[c] != undefined) a.event.pressedKey[c] = false;
          a.event.keyPressCtrl[c] = true
        }
        a.event.keyUpCallBack != null && a.event.keyUpCallBack(b)
      },
      orientationchange: function(b) {
        a.event.orientationChange != null && a.event.orientationChange(b)
      },
      touchstart: function(b) {
        a.event.touchStart != null && a.event.touchStart(b)
      },
      touchend: function(b) {
        b.preventDefault();
        a.event.touchEnd != null && a.event.touchEnd(b)
      },
      touchmove: function(b) {
        b.touches.length == 1 && b.preventDefault();
        a.event.touchMove != null && a.event.touchMove(b)
      },
      touchcancel: function(b) {
        a.event.touchCancel != null && a.event.touchCancel(b)
      },
      click: function(b) {
        a.event.clickCallBack != null && a.event.clickCallBack(b)
      },
      mouseDown: function(b) {
        a.event.mouseDownCallBack != null && a.event.mouseDownCallBack(b)
      },
      mouseUp: function(b) {
        a.event.mouseUpCallBack !=
          null && a.event.mouseUpCallBack(b)
      },
      mouseMove: function(b) {
        a.event.mouseMoveCallBack != null && a.event.mouseMoveCallBack(b)
      },
      checkKey: function(b) {
        var c = "0";
        switch (b) {
          case g.event.key.up:
            c = "up";
            break;
          case g.event.key.down:
            c = "down";
            break;
          case g.event.key.left:
            c = "left";
            break;
          case g.event.key.right:
            c = "right";
            break;
          case g.event.key.a:
            c = "a";
            break;
          case g.event.key.b:
            c = "b";
            break;
          case g.event.key.c:
            c = "c";
            break;
          case g.event.key.menu:
            c = "menu";
            break;
          case g.event.key.quit:
            c = "quit";
            break;
          case g.event.key.pcmenu:
            c = "menu";
            break;
          case g.event.key.pcquit:
            c = "quit"
        }
        return c
      },
      getDeviceConfig: function() {
        var b = navigator.userAgent.toLowerCase();
        return b.indexOf("duopaosafari") != -1 ? {
            device: "duopaoSafari",
            fps: 1,
            touch: true,
            zoom: 1
          } : b.indexOf("iphone") != -1 || b.indexOf("ipod") != -1 ? {
            device: "iphone",
            fps: 1,
            touch: true,
            zoom: 1
          } : b.indexOf("ipad") != -1 ? {
            device: "ipad",
            fps: 1,
            touch: true,
            zoom: 1
          } : b.indexOf("duopaoandroid") != -1 ? {
            device: "duopaoAndroid",
            fps: 1,
            touch: true,
            zoom: 1
          } : b.indexOf("duopaowindowsphone") != -1 ? {
            device: "duopaoWindowsPhone",
            fps: 1,
            touch: true,
            zoom: 1
          } : b.indexOf("opera mobi") != -1 ? {
            device: "operamobile",
            fps: 1,
            touch: true,
            zoom: 1
          } : b.indexOf("android") != -1 ? {
            device: "android",
            fps: 1,
            touch: true,
            zoom: 1
          } : b.indexOf("iemobile") != -1 ? {
            device: "iemobile",
            fps: 1,
            touch: false,
            zoom: 1
          } : b.indexOf("j2me") != -1 ? {
            device: "j2me",
            fps: 1,
            touch: false,
            zoom: 1
          } : b.indexOf("symbian v5") != -1 ? {
            device: "symbian5",
            fps: 1,
            touch: true,
            zoom: 1
          } : b.indexOf("symbian v3") != -1 ? {
            device: "symbian3",
            fps: 1,
            touch: false,
            zoom: 1
          } : b.indexOf("chrome") != -1 ? {
            device: "chrome",
            fps: 1,
            touch: false,
            zoom: 1
          } :
          b.indexOf("msie") != -1 ? {
            device: "ie",
            fps: 0.5,
            touch: false,
            zoom: 1
          } : b.indexOf("safari") != -1 ? {
            device: "safari",
            fps: 1,
            touch: false,
            zoom: 1
          } : b.indexOf("opera") != -1 ? {
            device: "opera",
            fps: 1,
            touch: false,
            zoom: 1
          } : b.indexOf("gecko") != -1 ? {
            device: "firefox",
            fps: 1,
            touch: false,
            zoom: 1
          } : {
            device: "",
            fps: 1,
            touch: false,
            zoom: 1
          }
      },
      loadImages: function(b, c) {
        if (parseInt(a.image.reCountLoaded) < parseInt(a.image.imgObjs.length * 0.3)) a.image.reCountLoaded += 0.1;
        var d = jsGame.canvas.screen.getWidth(),
          f = jsGame.canvas.screen.getHeight(),
          k = (d -
            200) / 2,
          r = f - 40;
        b = parseInt(a.image.reCountLoaded) > b ? parseInt(a.image.reCountLoaded) : b;
        b = b > c ? c : b;
        jsGame.canvas.fillStyle(a.canvas.bgColor).fillRect(0, 0, d, f).strokeRect(k, r, 200, 5).fillStyle("#FFFFFF").fillRect(k + 1, r + 1, b / c * 198, 3);
        if (a.image.loadedImg) {
          d = (d - 130) / 2;
          f = (f - 100) / 2;
          jsGame.canvas.drawImage(a.image.loadImgId, 45, 21, 79, 13, d + 51, f + 15, 79, 13).drawImage(a.image.loadImgId, 0, 46, 107, 12, d + 12, f + 70, 107, 12);
          for (k = 0; k < a.image.loadFrame.length; k++) {
            jsGame.canvas.drawImage(a.image.loadImgId, 47 + a.image.loadFrame[k].frames[a.image.loadFrame[k].step++] *
              7, 3, 7, 7, d + a.image.loadFrame[k].x, f + a.image.loadFrame[k].y, 7, 7);
            a.image.loadFrame[k].step %= a.image.loadFrame[k].frames.length
          }
        } else jsGame.canvas.drawString("\u52a0\u8f7d\u4e2d", 0, parseInt(f / 2), jsGame.graphics.VCENTER, true, "#FFFFFF", "#000000");
        if (a.image.tipSkip == 2 * parseInt(1E3 / a.system.timeout)) {
          a.image.tipSkip = 0;
          a.image.tipIndex++;
          a.image.tipIndex %= a.image.tips.length;
          a.image.tip = a.image.tips[a.image.tipIndex];
          jsGame.canvas.fillStyle(a.canvas.bgColor).fillRect(0, 230, jsGame.canvas.screen.getWidth(),
            35)
        }
        jsGame.canvas.drawString(a.image.tip, 0, jsGame.canvas.screen.getHeight() - 65, jsGame.graphics.VCENTER, true, "#FFFFFF", "#000000");
        a.image.tipSkip++
      },
      initImageCallBack: null,
      loadImageCallBack: null,
      getAnchor: function(b, c, d, f, k) {
        switch (k) {
          case g.canvas.graphics.ANCHOR_HV:
            b -= parseInt(d / 2);
            c -= parseInt(f / 2);
            break;
          case g.canvas.graphics.ANCHOR_LV:
            c -= parseInt(f / 2);
            break;
          case g.canvas.graphics.ANCHOR_RV:
            b -= d;
            c -= parseInt(f / 2);
            break;
          case g.canvas.graphics.ANCHOR_HT:
            b -= parseInt(d / 2);
            break;
          case g.canvas.graphics.ANCHOR_RT:
            b -=
              d;
            break;
          case g.canvas.graphics.ANCHOR_HB:
            b -= parseInt(d / 2);
            c -= f;
            break;
          case g.canvas.graphics.ANCHOR_LB:
            c -= f;
            break;
          case g.canvas.graphics.ANCHOR_RB:
            b -= d;
            c -= f
        }
        return {
          x: b,
          y: c
        }
      },
      initUrlParams: function(b) {
        if (b.indexOf("?") >= 0) {
          var c = b.split("?");
          b = [];
          if (c[1].indexOf("&") >= 0) b = c[1].split("&");
          else b.push(c[1]);
          c = [];
          for (var d = 0; d < b.length; d++)
            if (b[d].indexOf("=") >= 0) {
              c = b[d].split("=");
              a.request.gets[c[0]] = c[1]
            }
        }
      }
    };
  jsGame = {
    init: function(b, c) {
      if (!b && !c) {
        this.version = 1.6;
        this.request.init();
        this.events.init();
        this.canvas.initDevice()
      } else {
        a.canvas.defaultWidth = b;
        a.canvas.defaultHeight = c
      }
      return this
    },
    extend: function(b, c) {
      var d = function() {};
      d.prototype = c.prototype;
      b.prototype = new d;
      b.prototype.constructor = b;
      d = null;
      return b
    },
    error: function(b) {
      throw Error(b);
    },
    ajax: function(b) {
      b && a.ajax.pool.length < a.ajax.poolLength && a.ajax.pool.push(b);
      if (b && b.clear) a.ajax.pool = [];
      if (a.ajax.xhrObj == null && a.ajax.pool.length > 0) {
        a.ajax.xhrObj = this.objExtend(a.ajax.param, a.ajax.pool.shift() || {});
        a.ajax.xhrObj.type = a.ajax.xhrObj.type.toUpperCase();
        a.ajax.xhrObj.dataType = a.ajax.xhrObj.dataType.toUpperCase();
        a.ajax.xhrObj.xhr = jsGame.classes.getAjax();
        a.ajax.isTimeout = false;
        a.ajax.xhrObj.xhr.onreadystatechange = function() {
          if (a.ajax.isTimeout) return false;
          if (a.ajax.xhrObj && a.ajax.xhrObj.xhr.readyState == 4) {
            if (a.ajax.xhrObj.xhr.status == 200) {
              var c;
              switch (a.ajax.xhrObj.dataType) {
                default: c = a.ajax.xhrObj.xhr.responseText;
                break;
                case "JSON":
                    c = jsGame.getJson(a.ajax.xhrObj.xhr.responseText)
              }
              a.ajax.xhrObj.success(c);
              a.ajax.xhrObj.complete()
            } else a.ajax.xhrObj.error(a.ajax.xhrObj.xhr,
              "" + ("[error: " + a.ajax.xhrObj.xhr.status + "]"), a.ajax.xhrObj.xhr.status);
            a.ajax.xhrObj = null;
            jsGame.ajax()
          }
        };
        a.ajax.xhrObj.xhr.open(a.ajax.xhrObj.type, a.ajax.xhrObj.url, true);
        a.ajax.xhrObj.before(a.ajax.xhrObj.xhr);
        a.ajax.xhrObj.type == "POST" && a.ajax.xhrObj.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        a.ajax.xhrObj.xhr.send(a.ajax.xhrObj.data);
        setTimeout(function() {
          jsGame.ajax({
            clear: true
          });
          a.ajax.isTimeout = true;
          if (a.ajax.xhrObj) {
            a.ajax.xhrObj.error(null, "timeout",
              null);
            a.ajax.xhrObj = null
          }
        }, a.ajax.xhrObj.timeout)
      }
    },
    getDom: function(b) {
      try {
        return document.getElementById(b)
      } catch (c) {
        return document.all[b]
      }
    },
    objExtend: function() {
      var b = this.clone(arguments[0]) || {},
        c = 1,
        d = arguments.length,
        f = false,
        k;
      if (typeof b === "boolean") {
        f = b;
        b = arguments[1] || {};
        c = 2
      }
      if (typeof b !== "object") b = {};
      if (d == c) {
        b = this;
        --c
      }
      for (; c < d; c++)
        if ((k = arguments[c]) != null)
          for (var r in k) {
            var s = b[r],
              p = k[r];
            if (b !== p)
              if (f && p && typeof p === "object" && !p.nodeType) b[r] = this.objExtend(f, s || (p.length != null ? [] : {}),
                p);
              else if (p !== undefined) b[r] = p
          }
        return b
    },
    getJson: function(b) {
      try {
        return eval("(" + b + ")")
      } catch (c) {
        return {}
      }
    },
    clone: function(b) {
      var c;
      b = b || [];
      if (typeof b == "object")
        if (b.length) {
          c = [];
          for (var d = 0; d < b.length; d++)
            if (b[d].length && b[d].length > 0) {
              c[d] = [];
              for (var f = 0; f < b[d].length; f++) c[d][f] = b[d][f]
            } else c[d] = b[d]
        } else {
          c = {};
          for (d in b) c[d] = b[d]
        }
      return c
    },
    classes: {
      init: function(b) {
        b.classes.timer.prototype.stop = function() {
          if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null
          }
        };
        b.classes.timer.prototype.start =
          function(c) {
            if (c) {
              this.time = this._initTime;
              this._dateTime = new Date
            }
            this.stop();
            this.timeout = setTimeout(function(d) {
              var f = new Date,
                k = parseInt((f - d._dateTime) / d.millisec);
              d._dateTime = f;
              d.time -= k;
              d.callBack ? d.callBack(d) : d.stop();
              if (d.time >= 0) d.start();
              else {
                d.stop();
                d.time = 0
              }
            }, this.millisec, this)
          };
        b.classes.webSocket.prototype.send = function(c) {
          this.socket.send(c)
        };
        b.classes.webSocket.prototype.close = function() {
          this.socket.close()
        }
      },
      getAjax: function() {
        return new XMLHttpRequest
      },
      observer: function() {
        this.group = [];
        this.register = function(b) {
          if (b == null) return this;
          jsGame.commandFuns.inArray(b, this.group) == -1 && this.group.push(b);
          return this
        };
        this.unregister = function(b) {
          if (b == null) return this;
          b = jsGame.commandFuns.inArray(b, this.group);
          b > -1 && this.group.splice(b, 1);
          return this
        };
        this.notify = function(b) {
          for (var c = 0; c < this.group.length; c++)
            if (this.group[c] != null) this.group[c](b);
          return this
        };
        this.clear = function() {
          this.group.length > 0 && this.group.splice(0, this.group.length);
          return this
        }
      },
      getImage: function() {
        return new Image
      },
      timer: function(b, c, d, f, k) {
        this.id = b;
        this._initTime = c;
        this._dateTime = new Date;
        this.time = this._initTime;
        this.callBack = d;
        this.millisec = f || 1E3;
        this.data = k;
        this.timeout = null
      },
      webSocket: function(b, c, d, f, k) {
        this.ipPort = b || "";
        this.socket = new WebSocket(this.ipPort);
        this.socket.onopen = c;
        this.socket.onmessage = d;
        this.socket.onclose = f;
        this.socket.onerror = k
      }
    },
    commandFuns: function() {
      var b = {
        arr: [],
        len: 0,
        v: 0
      };
      return {
        registerNotify: function(c, d) {
          c != null && c.register(d)
        },
        rangeRegisterNotify: function(c, d) {
          for (var f = 0; f <
            d.length; f++) jsGame.commandFuns.registerNotify(c, d[f])
        },
        unRegisterNotify: function(c, d) {
          c != null && c.unregister(d)
        },
        rangeUnRegisterNotify: function(c, d) {
          for (var f = 0; f < d.length; f++) jsGame.commandFuns.unRegisterNotify(c, d[f])
        },
        getRandom: function(c, d) {
          if (d) return Math.round(Math.random() * (d - c) + c);
          else {
            var f = c;
            if (!f || f < 0) f = 0;
            return Math.round(Math.random() * f)
          }
        },
        getArray: function(c, d) {
          b.arr = [];
          b.len = c.toString().length;
          b.v = c;
          for (var f = 0; f < b.len; f++) {
            b.arr.push(b.v % 10);
            b.v = parseInt(b.v / 10)
          }
          d || b.arr.reverse();
          return b.arr
        },
        inArray: function(c, d) {
          var f, k = d.length;
          for (f = 0; f < k; f++)
            if (c == d[f]) return f;
          return -1
        },
        collisionCheck: function(c, d, f, k, r, s, p, v) {
          if (p && Math.abs(c + parseInt(f / 2) - (r + parseInt(p / 2))) < parseInt((f + p) / 2) && Math.abs(d + parseInt(k / 2) - (s + parseInt(v / 2))) < parseInt((k + v) / 2)) return true;
          return false
        },
        circleCollisionCheck: function(c, d, f, k, r, s) {
          c = Math.abs(c - k);
          d = Math.abs(d - r);
          if (Math.sqrt(c * c + d * d) < f + s) return true;
          return false
        }
      }
    }(),
    args: {
      ajax: {
        type: "get",
        data: null,
        dataType: "html",
        url: "",
        before: function() {},
        success: function() {},
        error: function(b, c, d) {
          this.error(c + "[" + d + "]")
        },
        complete: function() {}
      },
      setError: function(b, c, d) {
        a.error[b] = {
          msg: c,
          callBack: d
        };
        return jsGame
      },
      getError: function(b) {
        if (a.error[b]) return a.error[b];
        return {
          msg: "",
          callBack: function() {}
        }
      },
      setAjax: function(b, c) {
        if (a.ajax[b]) a.ajax[b] = c;
        return jsGame
      },
      xhr: null,
      gc: {
        collectWaitTime: 1E3
      }
    },
    localStorage: function() {
      var b, c;
      return {
        init: function() {
          b = this;
          if (!c) {
            var d;
            try {
              d = window.localStorage
            } catch (f) {}
            c = d
          }
          return b
        },
        setItem: function(d, f) {
          c.setItem(d,
            f);
          return b
        },
        getItem: function(d) {
          return c.getItem(d)
        },
        removeItem: function(d) {
          c.removeItem(d);
          return b
        },
        clear: function() {
          c.clear();
          return b
        },
        key: function(d) {
          return c.key(d)
        },
        getLength: function() {
          return c.length
        },
        base: function() {
          return jsGame
        }
      }
    }(),
    sessionStorage: function() {
      var b, c;
      return {
        init: function() {
          b = this;
          if (!c) {
            var d;
            try {
              d = window.sessionStorage
            } catch (f) {}
            c = d
          }
          return b
        },
        setItem: function(d, f) {
          c.setItem(d, f);
          return b
        },
        getItem: function(d) {
          return c.getItem(d)
        },
        removeItem: function(d) {
          c.removeItem(d);
          return b
        },
        clear: function() {
          c.clear();
          return b
        },
        key: function(d) {
          return c.key(d)
        },
        getLength: function() {
          return c.length
        },
        base: function() {
          return jsGame
        }
      }
    }(),
    pageLoad: function(b) {
      if (a.system.pageLoad == null) {
        a.system.pageLoad = b;
        this.localStorage.init();
        this.sessionStorage.init();
        this.canvas.init();
        this.audio.init();
        this.gameFlow.init();
        this.classes.init(this);
        this.graphics.ANCHOR_LT = g.canvas.graphics.ANCHOR_LT;
        this.graphics.ANCHOR_LV = g.canvas.graphics.ANCHOR_LV;
        this.graphics.ANCHOR_LB = g.canvas.graphics.ANCHOR_LB;
        this.graphics.ANCHOR_HT = g.canvas.graphics.ANCHOR_HT;
        this.graphics.ANCHOR_HV = g.canvas.graphics.ANCHOR_HV;
        this.graphics.ANCHOR_HB = g.canvas.graphics.ANCHOR_HB;
        this.graphics.ANCHOR_RT = g.canvas.graphics.ANCHOR_RT;
        this.graphics.ANCHOR_RV = g.canvas.graphics.ANCHOR_RV;
        this.graphics.ANCHOR_RB = g.canvas.graphics.ANCHOR_RB;
        b = jsGame.getDom(a.canvas.defaultId);
        if (jsGame.canvas.screen.getTouch()) {
          window.addEventListener("orientationchange", o.orientationchange, false);
          b.ontouchstart = o.touchstart;
          b.ontouchend = o.touchend;
          b.ontouchmove = o.touchmove;
          b.ontouchcancel = o.touchcancel
        } else {
          document.onkeydown = o.keydown;
          document.onkeyup = o.keyup;
          if (jsGame.canvas.screen.getDevice() != "j2me" && jsGame.canvas.screen.getDevice().indexOf("symbian") == -1) {
            b.onclick = o.click;
            b.onmousedown = o.mouseDown;
            b.onmouseup = o.mouseUp;
            b.onmousemove = o.mouseMove;
            if (a.canvas.device == "iemobile") try {
              window.external.notify("RM," + a.canvas.id + ",0,0," + jsGame.canvas.screen.getWidth() + "," + jsGame.canvas.screen.getHeight() + ",0")
            } catch (c) {}
          }
        }
        b = null;
        if (o.initImageCallBack ==
          null) o.initImageCallBack = o.loadImages;
        this.canvas.fillStyle(a.canvas.bgColor).fillRect(0, 0, jsGame.canvas.screen.getWidth(), jsGame.canvas.screen.getHeight());
        a.system.gameFlow = g.system.gameFlowType.run;
        a.image.tipIndex = jsGame.commandFuns.getRandom(a.image.tips.length - 1);
        a.image.tip = a.image.tips[a.image.tipIndex];
        if (a.system.loadRes == null) {
          a.system.loadRes = function() {
            o.initImageCallBack(a.image.countLoaded, a.image.imgObjs.length - 1);
            if (a.image.countLoaded == a.image.imgObjs.length) {
              a.system.pageLoad(jsGame);
              a.image.loadFrame = [];
              a.image.imgObjs = [];
              a.image.countLoaded = 0;
              a.image.reCountLoaded = 0;
              a.image.tipSkip = 0
            } else setTimeout(a.system.loadRes, a.system.timeout)
          };
          a.system.loadRes()
        }
      }
    },
    menu: function(b) {
      if (a.system.menu == null && typeof b == "function") {
        a.system.gameFlow = g.system.gameFlowType.menu;
        a.system.menu = b
      }
      return this
    },
    run: function(b) {
      if (a.system.run == null) {
        if (a.system.runFn == null) a.system.runFn = b;
        a.system.run = function() {
          var c = new Date;
          switch (a.system.gameFlow) {
            case g.system.gameFlowType.menu:
              a.system.menu();
              break;
            case g.system.gameFlowType.run:
              a.system.runFn();
              break;
            case g.system.gameFlowType.stop:
              a.system.stop();
              break;
            case g.system.gameFlowType.over:
              a.system.over();
              break;
            case g.system.gameFlowType.zone:
              a.system.zone(a.system.zoneArgs);
              break;
            case g.system.gameFlowType.active:
              a.system.active(a.system.activeArgs);
              break;
            case g.system.gameFlowType.loadImage:
              if (o.loadImageCallBack != null) {
                o.loadImageCallBack(a.image.countLoaded, a.image.imgCount - 1);
                if (a.image.imgObjs.length > 0) {
                  var d = a.image.imgObjs.shift();
                  if (a.image.imgs[d.id]) a.image.countLoaded++;
                  else {
                    a.image.imgs[d.id] = jsGame.classes.getImage();
                    a.image.imgs[d.id].onload = function() {
                      a.image.countLoaded++
                    };
                    a.image.imgs[d.id].src = d.src;
                    a.image.imgs[d.id].id = d.id
                  }
                  d = null
                }
              }
          }
          a.system.spendTime = new Date - c;
          c = null;
          a.system.isPause || jsGame.play()
        };
        a.system.run()
      }
      return this
    },
    stop: function(b) {
      if (a.system.stop == null && typeof b == "function") a.system.stop = b;
      return this
    },
    over: function(b) {
      if (a.system.over == null && typeof b == "function") a.system.over = b;
      return this
    },
    zone: function(b) {
      if (a.system.zone ==
        null && typeof b == "function") a.system.zone = b;
      return this
    },
    active: function(b) {
      if (a.system.active == null && typeof b == "function") a.system.active = b;
      return this
    },
    play: function() {
      a.system.isPause = false;
      setTimeout(a.system.run, a.system.timeout - a.system.spendTime < 0 ? 0 : (a.system.timeout - a.system.spendTime) * this.canvas.screen.getFps());
      return this
    },
    pause: function() {
      a.system.isPause = true;
      return this
    },
    gameFlow: function() {
      var b;
      return {
        init: function() {
          return b = this
        },
        menu: function() {
          if (a.system.menu != null) a.system.gameFlow =
            g.system.gameFlowType.menu;
          return b
        },
        run: function() {
          if (a.system.run != null) a.system.gameFlow = g.system.gameFlowType.run;
          return b
        },
        stop: function() {
          if (a.system.stop != null) a.system.gameFlow = g.system.gameFlowType.stop;
          return b
        },
        over: function() {
          if (a.system.over != null) a.system.gameFlow = g.system.gameFlowType.over;
          return b
        },
        zone: function(c) {
          if (a.system.zone != null) {
            a.system.gameFlow = g.system.gameFlowType.zone;
            a.system.zoneArgs = c
          }
          return b
        },
        active: function(c) {
          if (a.system.active != null) {
            a.system.gameFlow = g.system.gameFlowType.active;
            a.system.activeArgs = c
          }
          return b
        },
        base: function() {
          return jsGame
        }
      }
    }(),
    keyIsPressed: function(b) {
      if (!a.event.keyDownGo) a.event.keyDownGo = true;
      return a.event.keys[b]
    },
    keyPressed: function(b) {
      if (b) {
        if (!a.event.keyPressedGo) a.event.keyPressedGo = true;
        var c = a.event.pressedKey[b];
        a.event.pressedKey[b] = false;
        return c
      } else {
        if (this.keyPressed("up")) return true;
        else if (this.keyPressed("down")) return true;
        else if (this.keyPressed("left")) return true;
        else if (this.keyPressed("right")) return true;
        else if (this.keyPressed("a")) return true;
        else if (this.keyPressed("b")) return true;
        else if (this.keyPressed("c")) return true;
        else if (this.keyPressed("menu")) return true;
        else if (this.keyPressed("quit")) return true;
        return false
      }
    },
    keyIsUnPressed: function(b) {
      if (!a.event.keyUpGo) a.event.keyUpGo = true;
      var c = a.event.lastKey[b];
      a.event.lastKey[b] = false;
      return c
    },
    keyReleased: function(b) {
      if (b) return this.keyIsUnPressed(b);
      else {
        if (this.keyReleased("up")) return true;
        else if (this.keyReleased("down")) return true;
        else if (this.keyReleased("left")) return true;
        else if (this.keyReleased("right")) return true;
        else if (this.keyReleased("a")) return true;
        else if (this.keyReleased("b")) return true;
        else if (this.keyReleased("c")) return true;
        else if (this.keyReleased("menu")) return true;
        else if (this.keyReleased("quit")) return true;
        return false
      }
    },
    keyRepeated: function(b) {
      if (b) return this.keyIsPressed(b);
      else {
        if (this.keyRepeated("up")) return true;
        else if (this.keyRepeated("down")) return true;
        else if (this.keyRepeated("left")) return true;
        else if (this.keyRepeated("right")) return true;
        else if (this.keyRepeated("a")) return true;
        else if (this.keyRepeated("b")) return true;
        else if (this.keyRepeated("c")) return true;
        else if (this.keyRepeated("menu")) return true;
        else if (this.keyRepeated("quit")) return true;
        return false
      }
    },
    canvas: function() {
      var b, c, d, f, k, r, s, p, v, w, x;
      return {
        init: function() {
          b = this;
          d = {
            x: 0,
            y: 0
          };
          f = {
            fillColor: "#000000",
            strokeColor: "#000000"
          };
          k = {
            x: 0,
            y: 0
          };
          r = {
            x: 0,
            y: 0
          };
          s = {
            x: 0,
            y: 0,
            fillStyle: "#FFFFFF",
            strokeStyle: "#CCCCCC"
          };
          return b.pass()
        },
        initDevice: function() {
          v = o.getDeviceConfig();
          a.canvas.device = v.device;
          a.canvas.fps = v.fps;
          a.canvas.touch = v.touch;
          a.canvas.zoom = v.zoom;
          return b
        },
        pass: function(e, i, j) {
          var h;
          h = !e || e == "" ? a.canvas.defaultId : e;
          if (!a.canvas.ctxs[h]) {
            e = e ? document.createElement("canvas") : b.base().getDom(h);
            a.canvas.ctxs[h] = null;
            delete a.canvas.ctxs[h];
            a.canvas.ctxs[h] = e.getContext("2d");
            e.width = i ? i : a.canvas.defaultWidth;
            e.style.width = parseInt(e.width * a.canvas.zoom) + "px";
            e.height = j ? j : a.canvas.defaultHeight;
            e.style.height = parseInt(e.height * a.canvas.zoom) + "px";
            a.canvas.cavansDoms[h] =
              null;
            delete a.canvas.cavansDoms[h];
            a.canvas.cavansDoms[h] = e
          }
          c = a.canvas.ctxs[h];
          c.font = a.canvas.defaultFont;
          p = a.canvas.cavansDoms[h];
          w = parseInt(p.width);
          x = parseInt(p.height);
          return b.screen.setId(h)
        },
        font: function(e) {
          a.canvas.defaultFont = e;
          c.font = a.canvas.defaultFont;
          return b
        },
        del: function(e) {
          if (a.canvas.ctxs[e]) {
            a.canvas.ctxs[e] = null;
            delete a.canvas.ctxs[e];
            a.canvas.cavansDoms[e] = null;
            delete a.canvas.cavansDoms[e]
          }
          return b
        },
        setCurrent: function(e) {
          return b.pass(e)
        },
        screen: {
          setId: function(e) {
            if (a.canvas.ctxs[e]) a.canvas.id =
              e;
            return b
          },
          getId: function() {
            return a.canvas.id
          },
          getWidth: function() {
            return w
          },
          setWidth: function(e) {
            a.canvas.defaultWidth = e;
            if (p) {
              p.width = a.canvas.defaultWidth;
              p.style.width = p.width + "px";
              w = parseInt(p.width)
            }
            return b
          },
          getHeight: function() {
            return x
          },
          setHeight: function(e) {
            a.canvas.defaultHeight = e;
            if (p) {
              p.height = a.canvas.defaultHeight;
              p.style.height = p.height + "px";
              x = parseInt(p.height)
            }
            return b
          },
          getDevice: function() {
            return a.canvas.device
          },
          getFps: function() {
            return a.canvas.fps
          },
          setFps: function(e) {
            if (e >
              0) a.canvas.fps = e;
            return b
          },
          getTouch: function() {
            return a.canvas.touch
          },
          getZoom: function() {
            return a.canvas.zoom
          }
        },
        fillStyle: function(e) {
          c.fillStyle = e;
          return b
        },
        fillRect: function(e, i, j, h, l) {
          j = j ? j : 0;
          h = h ? h : 0;
          if (l) r = o.getAnchor(e, i, j, h, l);
          else {
            r.x = e;
            r.y = i
          }
          c.fillRect(r.x, r.y, j, h);
          return b
        },
        fillText: function(e, i, j, h) {
          c.font = h || a.canvas.defaultFont;
          c.fillText(e, i, j);
          return b
        },
        clearRect: function(e, i, j, h) {
          c.clearRect(e, i, j, h);
          return b
        },
        clearScreen: function() {
          return b.clearRect(0, 0, w, x)
        },
        fillScreen: function() {
          return b.fillRect(0,
            0, w, x)
        },
        strokeStyle: function(e) {
          c.strokeStyle = e;
          return b
        },
        lineWidth: function(e) {
          c.lineWidth = e || 1;
          return b
        },
        strokeRect: function(e, i, j, h, l) {
          if (l) k = o.getAnchor(e, i, j, h, l);
          else {
            k.x = e;
            k.y = i
          }
          c.strokeRect(k.x, k.y, j, h);
          return b
        },
        strokeText: function(e, i, j, h) {
          c.font = h || a.canvas.defaultFont;
          c.strokeText(e, i, j);
          return b
        },
        setColor: function(e, i, j) {
          if (j == null) {
            f.fillColor = e;
            f.strokeColor = i ? i : e
          } else {
            f.fillColor = "rgb(" + e + ", " + i + ", " + j + ")";
            f.strokeColor = f.fillColor
          }
          return b.fillStyle(f.fillColor).strokeStyle(f.strokeColor)
        },
        drawImage: function(e, i, j, h, l, q, m, n, t, u) {
          if (h)
            if (l)
              if (u) {
                d = o.getAnchor(q, m, n, t, u);
                c.drawImage(jsGame.getImage(e), i, j, h, l, d.x, d.y, n, t)
              } else c.drawImage(jsGame.getImage(e), i, j, h, l, q, m, n, t);
          else {
            d = o.getAnchor(i, j, jsGame.getImage(e).width, jsGame.getImage(e).height, h);
            c.drawImage(jsGame.getImage(e), d.x, d.y)
          } else c.drawImage(jsGame.getImage(e), i, j);
          return b
        },
        drawRotate: function(e, i, j, h, l, q, m, n, t, u) {
          var y = parseInt(n >> 1),
            z = parseInt(t >> 1),
            A = jsGame.getImage(e);
          e = A ? A : a.canvas.cavansDoms[e];
          q -= y;
          m -= z;
          c.save();
          c.translate(q + y, m + z);
          c.rotate(u * Math.PI / 180);
          c.translate(-(q + y), -(m + z));
          c.drawImage(e, i, j, h, l, q, m, n, t);
          c.restore();
          return b
        },
        drawCache: function(e, i, j, h, l, q, m, n, t, u) {
          if (e = a.canvas.cavansDoms[e])
            if (h)
              if (l)
                if (u) {
                  d = o.getAnchor(q, m, n, t, u);
                  c.drawImage(e, i, j, h, l, d.x, d.y, n, t)
                } else c.drawImage(e, i, j, h, l, q, m, n, t);
          else {
            d = o.getAnchor(i, j, e.width, e.height, h);
            c.drawImage(e, d.x, d.y)
          } else c.drawImage(e, i, j);
          return b
        },
        drawRegion: function(e, i, j, h, l, q, m, n) {
          switch (q) {
            default: c.setTransform(1, 0, 0, 1, m, n);
            break;
            case g.canvas.trans.TRANS_ROT90:
                c.setTransform(0,
                1, -1, 0, l + m, n);
              break;
            case g.canvas.trans.TRANS_ROT180:
                c.setTransform(-1, 0, 0, -1, h + m, l + n);
              break;
            case g.canvas.trans.TRANS_ROT270:
                c.setTransform(0, -1, 1, 0, m, h + n);
              break;
            case g.canvas.trans.TRANS_MIRROR:
                c.setTransform(-1, 0, 0, 1, h + m, n);
              break;
            case g.canvas.trans.TRANS_MIRROR_ROT90:
                c.setTransform(0, -1, -1, 0, l + m, h + n);
              break;
            case g.canvas.trans.TRANS_MIRROR_ROT180:
                c.setTransform(1, 0, 0, -1, m, l + n);
              break;
            case g.canvas.trans.TRANS_MIRROR_ROT270:
                c.setTransform(0, 1, 1, 0, m, n)
          }(jsGame.getImage(e) ? b.drawImage : b.drawCache)(e,
            i, j, h, l, 0, 0, h, l);
          c.setTransform(1, 0, 0, 1, 0, 0);
          return b
        },
        drawNumber: function(e, i, j, h, l, q, m, n, t) {
          e = e.toString();
          var u = e.length;
          n = n ? n : j;
          t = t ? t : h;
          if (m)
            for (m = 0; m < u; m++) b.drawImage(i, parseInt(e.charAt(m)) * j, 0, j, h, l + m * n, q, n, t);
          else
            for (m = u - 1; m >= 0; m--) b.drawImage(i, parseInt(e.charAt(m)) * j, 0, j, h, l - (u - 1 - m) * n, q, n, t, jsGame.graphics.ANCHOR_RT);
          return b
        },
        moveTo: function(e, i) {
          c.moveTo(e, i);
          return b
        },
        lineTo: function(e, i) {
          c.lineTo(e, i);
          return b
        },
        stroke: function() {
          c.stroke();
          return b
        },
        fill: function() {
          c.fill();
          return b
        },
        beginPath: function() {
          c.beginPath();
          return b
        },
        closePath: function() {
          c.closePath();
          return b
        },
        arc: function(e, i, j, h, l, q) {
          c.arc(e, i, j, h, l, q);
          return b
        },
        quadraticCurveTo: function(e, i, j, h) {
          c.quadraticCurveTo(e, i, j, h);
          return b
        },
        bezierCurveTo: function(e, i, j, h, l, q) {
          c.bezierCurveTo(e, i, j, h, l, q);
          return b
        },
        measureText: function(e) {
          var i = c.measureText(e),
            j = i.width;
          i = i.height ? i.height : parseInt(c.font);
          return {
            width: b.screen.getDevice() == "j2me" ? c.measureText(e) : j,
            height: i
          }
        },
        translate: function(e, i) {
          c.translate(e, i);
          return b
        },
        drawLine: function(e, i, j, h) {
          return b.beginPath().moveTo(e, i).lineTo(j, h).closePath().stroke()
        },
        drawRect: function(e, i, j, h, l) {
          return b.strokeRect(e, i, j, h, l)
        },
        drawString: function(e, i, j, h, l, q, m, n) {
          s.x = i;
          s.y = j;
          c.font = n || a.canvas.defaultFont;
          if (h) switch (h) {
            case g.canvas.graphics.LEFT:
              s.x = 0;
              break;
            case g.canvas.graphics.VCENTER:
              s.x = parseInt(b.screen.getWidth() - b.measureText(e).width >> 1);
              break;
            case g.canvas.graphics.RIGHT:
              s.x = b.screen.getWidth() - b.measureText(e).width
          }
          if (l) {
            s.fillStyle = q ? q : "#000000";
            s.strokeStyle =
              m ? m : "#CCCCCC";
            b.fillStyle(s.strokeStyle).fillText(e, s.x + 1, s.y + 1, n).fillStyle(s.fillStyle)
          }
          return b.fillText(e, s.x, s.y, n).fillStyle(a.canvas.defaultColor)
        },
        drawSubstring: function(e, i, j, h, l, q, m, n, t, u) {
          return b.drawString(e.substring(i, i + j), h, l, q, m, n, t, u)
        },
        clip: function() {
          c.clip();
          return b
        },
        save: function() {
          c.save();
          return b
        },
        restore: function() {
          c.restore();
          return b
        },
        rect: function(e, i, j, h) {
          c.rect(e, i, j, h);
          return b
        },
        rotate: function(e) {
          c.rotate(e);
          return b
        },
        setTransform: function(e, i, j, h, l, q) {
          c.setTransform(e,
            i, j, h, l, q);
          return b
        },
        scale: function(e, i) {
          c.scale(e, i);
          return b
        },
        globalAlpha: function(e) {
          c.globalAlpha = e || 1;
          return b
        },
        getContext: function() {
          return c
        },
        base: function() {
          return jsGame
        }
      }
    }(),
    initImage: function(b) {
      a.image.imgs = [];
      a.image.imgs[a.image.loadImgId] = jsGame.classes.getImage();
      a.image.imgs[a.image.loadImgId].id = a.image.loadImgId;
      a.image.imgs[a.image.loadImgId].src = "img/9gloading.png";
      if (b.length > 0) {
        jsGame.pushImage(b);
        for (b = 0; b < a.image.imgObjs.length; b++)
          if (a.image.imgObjs[b].id !=
            a.image.loadImgId) {
            a.image.imgs[a.image.imgObjs[b].id] = jsGame.classes.getImage();
            a.image.imgs[a.image.imgObjs[b].id].onload = function() {
              a.image.countLoaded++
            };
            a.image.imgs[a.image.imgObjs[b].id].onerror = function() {
              var c = jsGame.args.getError("img");
              a.image.tips = [c.msg];
              c.callBack()
            };
            a.image.imgs[a.image.imgObjs[b].id].src = a.image.imgObjs[b].src;
            a.image.imgs[a.image.imgObjs[b].id].id = a.image.imgObjs[b].id;
            a.image.imgs[a.image.imgObjs[b].id].url = a.image.imgObjs[b].src
          } else {
            a.image.countLoaded++;
            if (a.image.imgs[a.image.loadImgId].src !=
              a.image.imgObjs[b].src) {
              a.image.imgs[a.image.loadImgId].src = a.image.imgObjs[b].src;
              a.image.imgs[a.image.loadImgId].url = a.image.imgObjs[b].src
            }
          }
      }
      a.image.imgs[a.image.loadImgId].onload = function() {
        a.image.loadedImg = true;
        a.image.loadFrame = [{
          x: 14,
          y: 0,
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          step: 0
        }, {
          x: 23,
          y: 1,
          frames: [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          step: 0
        }, {
          x: 31,
          y: 6,
          frames: [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          step: 0
        }, {
          x: 35,
          y: 15,
          frames: [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
          step: 0
        }, {
          x: 34,
          y: 24,
          frames: [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
          step: 0
        }, {
          x: 28,
          y: 32,
          frames: [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
          step: 0
        }, {
          x: 20,
          y: 35,
          frames: [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
          step: 0
        }, {
          x: 11,
          y: 34,
          frames: [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4],
          step: 0
        }, {
          x: 3,
          y: 29,
          frames: [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
          step: 0
        }, {
          x: 0,
          y: 21,
          frames: [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],
          step: 0
        }, {
          x: 1,
          y: 12,
          frames: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
          step: 0
        }, {
          x: 6,
          y: 4,
          frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
          step: 0
        }]
      };
      return this
    },
    loadImage: function(b) {
      if (a.system.gameFlow != g.system.gameFlowType.loadImage && b.length > 0) {
        a.system.gameFlow = g.system.gameFlowType.loadImage;
        a.image.imgObjs = b;
        a.image.imgCount = a.image.imgObjs.length;
        a.image.countLoaded = 0
      }
    },
    pushImage: function(b) {
      for (var c = 0; c < b.length; c++) a.image.imgObjs.push(b[c]);
      return this
    },
    initImageCallBack: function(b) {
      if (typeof b == "function") o.initImageCallBack = b;
      return this
    },
    loadImageCallBack: function(b) {
      if (typeof b == "function") o.loadImageCallBack = b;
      return this
    },
    getImage: function(b) {
      if (a.image.imgs[b]) return a.image.imgs[b]
    },
    delImage: function(b) {
      if (a.image.imgs[b]) {
        a.image.imgs[b] = null;
        delete a.image.imgs[b]
      }
      return this
    },
    audio: function() {
      var b = null;
      return {
        init: function() {
          return b = this
        },
        play: function(c) {
          if (a.audio.audios[c]) try {
            a.audio.audios[c].paused && a.audio.audios[c].play()
          } catch (d) {}
          return b
        },
        pause: function(c) {
          if (a.audio.audios[c]) try {
            a.audio.audios[c].pause()
          } catch (d) {}
          return b
        },
        noSound: function() {
          for (var c in a.audio.audios) a.audio.audios[c].pause();
          return b
        },
        load: function(c) {
          if (a.audio.audios[c]) try {
            a.audio.audios[c].load()
          } catch (d) {}
          return b
        },
        replay: function(c) {
          b.pause(c);
          b.load(c);
          b.play(c);
          return b
        },
        fuckAudio: function(c) {
          if (a.audio.audios[c] &&
            a.audio.audios[c].paused) {
            a.audio.fuckSkip++;
            if (a.audio.fuckSkip == 10) {
              b.replay(c);
              a.audio.fuckSkip = 0
            }
          }
          return b
        },
        getAudio: function(c) {
          return a.audio.audios[c]
        }
      }
    }(),
    initAudio: function(b) {
      if (b.length > 0) {
        a.audio.audios = [];
        for (var c, d, f, k, r = 0; r < b.length; r++)
          if ((c = b[r]) && c.id != "" && c.src != "") {
            d = c.loop;
            f = c.preload;
            k = c.autoplay;
            a.audio.audios[c.id] = new Audio(c.src);
            a.audio.audios[c.id].id = c.id;
            a.audio.audios[c.id].loop = d;
            a.audio.audios[c.id].preload = f;
            a.audio.audios[c.id].autoplay = k
          }
      }
      return this
    },
    setRunFrequency: function(b) {
      a.system.timeout =
        b;
      return this
    },
    events: function() {
      var b;
      return {
        init: function() {
          return b = this
        },
        keyDown: function(c) {
          if (!a.event.keyDownGo) a.event.keyDownGo = true;
          if (!a.event.keyUpGo) a.event.keyUpGo = true;
          if (!a.event.keyPressedGo) a.event.keyPressedGo = true;
          a.event.keyDownCallBack = c;
          return b
        },
        keyUp: function(c) {
          if (!a.event.keyDownGo) a.event.keyDownGo = true;
          if (!a.event.keyUpGo) a.event.keyUpGo = true;
          if (!a.event.keyPressedGo) a.event.keyPressedGo = true;
          a.event.keyUpCallBack = c;
          return b
        },
        orientationChange: function(c) {
          a.event.orientationChange =
            c;
          return b
        },
        touchStart: function(c) {
          a.event.touchStart = c;
          return b
        },
        touchEnd: function(c) {
          a.event.touchEnd = c;
          return b
        },
        touchMove: function(c) {
          a.event.touchMove = c;
          return b
        },
        touchCancel: function(c) {
          a.event.touchCancel = c;
          return b
        },
        click: function(c) {
          a.event.clickCallBack = c;
          return b
        },
        mouseDown: function(c) {
          a.event.mouseDownCallBack = c;
          return b
        },
        mouseUp: function(c) {
          a.event.mouseUpCallBack = c;
          return b
        },
        mouseMove: function(c) {
          a.event.mouseMoveCallBack = c;
          return b
        },
        base: function() {
          return jsGame
        }
      }
    }(),
    ui: {},
    graphics: {
      HCENTER: g.canvas.graphics.HCENTER,
      VCENTER: g.canvas.graphics.VCENTER,
      LEFT: g.canvas.graphics.LEFT,
      RIGHT: g.canvas.graphics.RIGHT,
      TOP: g.canvas.graphics.TOP,
      BOTTOM: g.canvas.graphics.BOTTOM
    },
    trans: {
      TRANS_NONE: g.canvas.trans.TRANS_NONE,
      TRANS_ROT90: g.canvas.trans.TRANS_ROT90,
      TRANS_ROT180: g.canvas.trans.TRANS_ROT180,
      TRANS_ROT270: g.canvas.trans.TRANS_ROT270,
      TRANS_MIRROR: g.canvas.trans.TRANS_MIRROR,
      TRANS_MIRROR_ROT90: g.canvas.trans.TRANS_MIRROR_ROT90,
      TRANS_MIRROR_ROT180: g.canvas.trans.TRANS_MIRROR_ROT180,
      TRANS_MIRROR_ROT270: g.canvas.trans.TRANS_MIRROR_ROT270
    },
    request: function() {
      return {
        init: function() {
          o.initUrlParams(location.href)
        },
        get: function(b) {
          return a.request.gets[b] ? a.request.gets[b] : ""
        }
      }
    }()
  }.init()
})();
