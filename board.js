// 边
var BS = 8;
// 中间位置
var CENTER = BS / 2;
// 黑
var BLACK = 1;
// 白
var WHITE = 2;

function pos(a, b) {
    return (a - 1) + (b - 1) * BS
}

function Board() {
    var c = new Array(BS * BS);
    var b = BLACK;
    var d = [];
    var e = function () {
        b = ((b == BLACK) ? WHITE : BLACK)
    };
    //重新设置棋局数组
    this.reset = function () {
        for (var f = 0; f < BS * BS; ++f) {
            c[f] = 0
        }
        //中间交错位置的棋子
        c[pos(CENTER, CENTER)] = c[pos(CENTER + 1, CENTER + 1)] = WHITE;
        c[pos(CENTER, CENTER + 1)] = c[pos(CENTER + 1, CENTER)] = BLACK;
        // ?
        b = BLACK;
        // ?
        d = []
    };
    this.isGameOver = function () {
        var f = false;
        if (!this.canPutAnyChess()) {
            e();
            if (!this.canPutAnyChess()) {
                f = true
            }
            e()
        }
        return f
    };
    this.getChess = function (f, g) {
        return c[pos(f, g)]
    };
    this.getPlayer = function () {
        return b
    };
    // 计算页面白棋黑棋数量 [0] [1]
    this.getChessCount = function (j) {
        var f = 0, g = 0;
        for (var h = 0; h < BS * BS; ++h) {
            if (c[h] == BLACK) {
                ++f
            } else {
                if (c[h] == WHITE) {
                    ++g
                }
            }
        }
        if (j == BLACK) {
            return f
        } else {
            if (j == WHITE) {
                return g
            } else {
                return [f, g]
            }
        }
    };
    // 判断放置棋子位置 ？？
    var a = function (k, j, n, l, h, g) {
        var m = false;
        var i = 0;
        while (true) {
            k += n;
            j += l;
            if (k < 1 || k > BS || j < 1 || j > BS) {
                break
            }
            var f = c[pos(k, j)];
            if (f == 0) {
                break
            } else {
                if (f == b) {
                    m = true;
                    break
                } else {
                    ++i
                }
            }
        }
        if (i > 0 && m) {
            if (h) {
                for (; i > 0; --i) {
                    k -= n;
                    j -= l;
                    c[pos(k, j)] = b;
                    g(k, j)
                }
            }
            return true
        }
        return false
    };
    //判断是否可以放棋子
    this.canPutChess = function (f, g) {
        if (c[pos(f, g)] == 0) {
            if (a(f, g, 1, 1) || a(f, g, 1, 0) || a(f, g, 1, -1) || a(f, g, 0, 1) || a(f, g, 0, -1) || a(f, g, -1, 1) || a(f, g, -1, 0) || a(f, g, -1, -1)) {
                return true
            }
        }
        return false
    };
    this.getPutableList = function () {
        var g = [];
        for (var f = 1; f <= BS; ++f) {
            for (var h = 1; h <= BS; ++h) {
                if (this.canPutChess(f, h)) {
                    g.push([f, h])
                }
            }
        }
        return g
    };
    //判断是不是无法放置棋子
    this.canPutAnyChess = function () {
        for (var f = 1; f <= BS; ++f) {
            for (var g = 1; g <= BS; ++g) {
                if (this.canPutChess(f, g)) {
                    return true
                }
            }
        }
        return false
    };
    this.putChess = function (f, i) {
        if (c[pos(f, i)] == 0) {
            var h = [];
            var g = function (k, j) {
                h.push([k, j])
            };
            a(f, i, 1, 1, true, g);
            a(f, i, 1, 0, true, g);
            a(f, i, 1, -1, true, g);
            a(f, i, 0, 1, true, g);
            a(f, i, 0, -1, true, g);
            a(f, i, -1, -1, true, g);
            a(f, i, -1, 0, true, g);
            a(f, i, -1, 1, true, g);
            if (h.length > 0) {
                c[pos(f, i)] = b;
                h.push([f, i]);
                d.push(h);
                e();
                return true
            }
        }
        return false
    };
    this.skipPutChess = function () {
        if (!this.canPutAnyChess()) {
            d.push([]);
            e();
            return true
        }
        return false
    };
    this.undo = function () {
        if (d.length > 0) {
            var j = (d.length % 2 == 0 ? BLACK : WHITE);
            var h = d.pop();
            if (h != null && h.length > 0) {
                for (var g = 0; g < h.length - 1; ++g) {
                    var f = h[g];
                    c[pos(f[0], f[1])] = j
                }
                var f = h[h.length - 1];
                c[pos(f[0], f[1])] = 0
            }
            e();
            return true
        }
        return false
    };
    this._getData = function () {
        return c
    };
    this.reset()
};
