var INFINITE = 999999;
var MIN_NODES = 10000;
var MIN_TICK = 1000;
var EVAL_SCORES = [500, -150, 30, 10, 10, 30, -150, 500, -150, -250, 0, 0, 0, 0, -250, -150, 30, 0, 1, 2, 2, 1, 0, 30, 10, 0, 2, 16, 16, 2, 0, 10, 10, 0, 2, 16, 16, 2, 0, 10, 30, 0, 1, 2, 2, 1, 0, 30, -150, -250, 0, 0, 0, 0, -250, -150, 500, -150, 30, 10, 10, 30, -150, 500];
var BONUS_SCORE = 30;
var LIBERTY_SCORE = 8;

function Brain() {
    var b = 0;
    //难度等级 第一个值
    var f = 6;
    var c;
    //难度等级第二个值
    var i = 18;
    var g = function (n, w) {
        ++b;
        var v = 0, u = 0;
        var l = 0, k = 0;
        var D = n._getData();
        for (var p = 1; p <= BS; ++p) {
            for (var o = 1; o <= BS; ++o) {
                var z = (p - 1) + (o - 1) * BS;
                var m = D[z];
                if (m == 0) {
                    continue
                }
                var A = 0;
                for (var r = -1; r <= 1; ++r) {
                    for (var q = -1; q <= 1; ++q) {
                        var C = p + r;
                        var B = o + q;
                        var s = (C - 1) + (B - 1) * BS;
                        if (C >= 1 && C <= BS && B >= 1 && B <= BS && D[s] == 0) {
                            ++A
                        }
                    }
                }
                if (m == w) {
                    ++v;
                    l += EVAL_SCORES[z];
                    l -= A * LIBERTY_SCORE
                } else {
                    ++u;
                    k += EVAL_SCORES[z];
                    k -= A * LIBERTY_SCORE
                }
            }
        }
        if (v == 0) {
            return -INFINITE
        }
        if (u == 0) {
            return INFINITE
        }
        if (v + u == BS * BS) {
            if (v > u) {
                return INFINITE
            } else {
                if (u > v) {
                    return -INFINITE
                }
            }
        }
        var j = function (t) {
            var F = t[0];
            var G = D[F];
            if (G != 0) {
                for (var E = 1; E <= 3; ++E) {
                    var x = D[t[E]];
                    if (x == 0) {
                        continue
                    } else {
                        if (x == w) {
                            l -= EVAL_SCORES[t[E]]
                        } else {
                            k -= EVAL_SCORES[t[E]]
                        }
                    }
                }
                var y = F;
                for (var E = 0; E < BS - 2; ++E) {
                    y += t[4];
                    if (D[y] != G) {
                        break
                    }
                    if (w == G) {
                        l += BONUS_SCORE
                    } else {
                        k += BONUS_SCORE
                    }
                }
                y = F;
                for (var E = 0; E < BS - 2; ++E) {
                    y += (t[5] * BS);
                    if (D[y] != G) {
                        break
                    }
                    if (w == G) {
                        l += BONUS_SCORE
                    } else {
                        k += BONUS_SCORE
                    }
                }
            }
        };
        j([0, 1, 8, 9, 1, 1]);
        j([7, 6, 14, 15, -1, 1]);
        j([56, 48, 49, 57, 1, -1]);
        j([63, 54, 55, 62, -1, -1]);
        return (l - k)
    };
    var d = function (k, j) {
        ++b;
        var m = k.getChessCount();
        var l = 0;
        if (m[0] > m[1]) {
            l = INFINITE
        } else {
            if (m[0] < m[1]) {
                l = -INFINITE
            }
        }
        if (j == WHITE) {
            l = -l
        }
        return l
    };
    var a = function (k, j, l) {
        k.putChess(l[0], l[1]);
        var m = g(k, j);
        k.undo();
        return m
    };
    var e = function (q, v, n, l, t) {
        if (n == 0) {
            return {score: g(q, v), step: []}
        }
        var s = (q.getPlayer() == v);
        var k = s ? (-INFINITE - 1) : (INFINITE + 1);
        var r = q.getPutableList();
        var u = [0, 0];
        if (r.length > 0) {
            var o = {};
            for (var m = 0; m < r.length; ++m) {
                var j = r[m];
                o[j] = a(q, v, j)
            }
            r.sort(function (x, w) {
                return s ? (o[w] - o[x]) : (o[x] - o[w])
            });
            if (n == 1) {
                var j = r[0];
                k = o[j];
                u[0] = j[0];
                u[1] = j[1]
            } else {
                for (var m = 0; m < r.length; ++m) {
                    var j = r[m];
                    q.putChess(j[0], j[1]);
                    var p = e(q, v, n - 1, l, t);
                    q.undo();
                    if (n == c) {
                        console.debug("eval step:" + j + ",score:" + p.score + ",depth:" + n)
                    }
                    if (s) {
                        if (p.score > k) {
                            k = p.score;
                            u[0] = j[0];
                            u[1] = j[1]
                        }
                        l = (l > k ? l : k);
                        if (l >= t) {
                            break
                        }
                    } else {
                        if (p.score < k) {
                            k = p.score;
                            u[0] = j[0];
                            u[1] = j[1]
                        }
                        t = (t < k ? t : k);
                        if (l >= t) {
                            break
                        }
                    }
                }
            }
        } else {
            if (!q.isGameOver()) {
                q.skipPutChess();
                var p = e(q, v, n, l, t);
                k = p.score;
                u = [];
                q.undo()
            } else {
                k = d(q, v);
                u = []
            }
        }
        return {score: k, step: u}
    };
    var h = function (p, u, n, l, s) {
        if (n == 0) {
            return {score: d(p, u), step: []}
        }
        var r = (p.getPlayer() == u);
        var k = r ? (-INFINITE - 1) : (INFINITE + 1);
        var q = p.getPutableList();
        var t = [0, 0];
        if (q.length > 0) {
            for (var m = 0; m < q.length; ++m) {
                var j = q[m];
                p.putChess(j[0], j[1]);
                var o = h(p, u, n - 1, l, s);
                p.undo();
                if (n == c) {
                    console.debug("eval step:" + j + ",score:" + o.score + ",depth:" + n)
                }
                if (r) {
                    if (o.score > k) {
                        k = o.score;
                        t[0] = j[0];
                        t[1] = j[1]
                    }
                    l = (l > k ? l : k);
                    if (l >= s) {
                        break
                    }
                } else {
                    if (o.score < k) {
                        k = o.score;
                        t[0] = j[0];
                        t[1] = j[1]
                    }
                    s = (s < k ? s : k);
                    if (l >= s) {
                        break
                    }
                }
            }
        } else {
            if (!p.isGameOver()) {
                p.skipPutChess();
                var o = h(p, u, n, l, s);
                k = o.score;
                t = [];
                p.undo()
            } else {
                k = d(p, u);
                t = []
            }
        }
        return {score: k, step: t}
    };
    //设置难度等级
    this.setLevel = function (k, j) {
        f = k;
        i = j
    };
    this.findBestStep = function (p) {
        var q = p.getPutableList();
        var l = p.getChessCount();
        var s = p.getPlayer();
        var o = l[0] + l[1];
        if (q.length <= 0) {
            return []
        }
        if (o <= ((BS - 4) * (BS - 4))) {
            console.debug("random strategy");
            var j = [];
            for (var m = 0; m < q.length; ++m) {
                var k = q[m];
                if (k[0] >= 3 && k[0] <= (BS - 2) && k[1] >= 3 && k[1] <= (BS - 2)) {
                    j.push(k)
                }
            }
            if (j.length > 0) {
                var r = Math.floor((Math.random() * j.length));
                return j[r]
            }
        }
        if (o >= BS * BS - i) {
            console.debug("exact strategy");
            c = BS * BS - o;
            console.debug("try depth:" + c);
            b = 0;
            var n = (new Date()).getTime();
            t = h(p, s, c, -INFINITE, INFINITE);
            n = (new Date()).getTime() - n;
            console.debug("best step:" + t.step + ",eval nodeCount:" + b + ",cost:" + n + " ms");
            if (t.score != (-INFINITE)) {
                return t.step
            }
        }
        console.debug("heuristic strategy");
        c = f;
        var t;
        console.debug("try depth:" + c);
        b = 0;
        var n = (new Date()).getTime();
        t = e(p, s, c, -INFINITE, INFINITE);
        n = (new Date()).getTime() - n;
        console.debug("best step:" + t.step + ",eval nodeCount:" + b + ",cost:" + n + " ms");
        return t.step
    }
};
