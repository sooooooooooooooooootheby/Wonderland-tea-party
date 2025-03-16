/*
 * 一个JavaScript实现的安全哈希算法SHA-256，遵循FIPS 180-2标准
 * 版本2.2 版权所有 Angel Marin, Paul Johnston 2000 - 2009
 * 其他贡献者：Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * 基于BSD协议发布
 * 详细信息请访问 http://pajhome.org.uk/crypt/md5
 * 或 http://anmar.eu.org/projects/jssha2/
 *
 * [2025 3-16] s22y 删减只保留需要的加密方法
 */

/*
 * 可配置变量。可能需要调整这些值以与服务器端兼容，但默认值适用于大多数情况。
 */
var b64pad = ""; /* Base-64填充字符。严格遵循RFC标准需使用"="   */

/*
 * 通常需要调用的函数
 * 使用密钥 k 对数据 d 进行 HMAC-SHA256 计算，并将结果以 Base-64 编码的字符串形式返回。
 */
export default function b64_hmac_sha256(k, d) {
    return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
}

/*
 * 计算密钥和数据的HMAC-SHA256（原始字符串）
 */
function rstr_hmac_sha256(key, data) {
    var bkey = rstr2binb(key);
    if (bkey.length > 16) bkey = binb_sha256(bkey, key.length * 8);

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5c5c5c5c;
    }

    var hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
    return binb2rstr(binb_sha256(opad.concat(hash), 512 + 256));
}

/*
 * 将原始字符串转换为Base-64字符串
 */
function rstr2b64(input) {
    try {
        b64pad;
    } catch (e) {
        b64pad = "";
    }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for (var i = 0; i < len; i += 3) {
        var triplet =
            (input.charCodeAt(i) << 16) |
            (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
            (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8) output += b64pad;
            else output += tab.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
        }
    }
    return output;
}

/*
 * 将字符串编码为UTF-8。
 * 为提升效率，假设输入是有效的UTF-16。
 */
function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;

    while (++i < input.length) {
        /* 解码UTF-16代理对 */
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
            x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
            i++;
        }

        /* 将输出编码为UTF-8 */
        if (x <= 0x7f) output += String.fromCharCode(x);
        else if (x <= 0x7ff) output += String.fromCharCode(0xc0 | ((x >>> 6) & 0x1f), 0x80 | (x & 0x3f));
        else if (x <= 0xffff)
            output += String.fromCharCode(0xe0 | ((x >>> 12) & 0x0f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
        else if (x <= 0x1fffff)
            output += String.fromCharCode(
                0xf0 | ((x >>> 18) & 0x07),
                0x80 | ((x >>> 12) & 0x3f),
                0x80 | ((x >>> 6) & 0x3f),
                0x80 | (x & 0x3f)
            );
    }
    return output;
}

/*
 * 将原始字符串转换为大端序字数组
 * 大于255的字符其高位字节将被静默忽略。
 */
function rstr2binb(input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++) output[i] = 0;
    for (var i = 0; i < input.length * 8; i += 8) output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
    return output;
}

/*
 * 将大端序字数组转换为字符串
 */
function binb2rstr(input) {
    var output = "";
    for (var i = 0; i < input.length * 32; i += 8) output += String.fromCharCode((input[i >> 5] >>> (24 - (i % 32))) & 0xff);
    return output;
}

/*
 * SHA-256主函数及其辅助函数
 */
function sha256_S(X, n) {
    return (X >>> n) | (X << (32 - n));
}
function sha256_R(X, n) {
    return X >>> n;
}
function sha256_Ch(x, y, z) {
    return (x & y) ^ (~x & z);
}
function sha256_Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
}
function sha256_Sigma0256(x) {
    return sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22);
}
function sha256_Sigma1256(x) {
    return sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25);
}
function sha256_Gamma0256(x) {
    return sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3);
}
function sha256_Gamma1256(x) {
    return sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10);
}

var sha256_K = new Array(
    1116352408,
    1899447441,
    -1245643825,
    -373957723,
    961987163,
    1508970993,
    -1841331548,
    -1424204075,
    -670586216,
    310598401,
    607225278,
    1426881987,
    1925078388,
    -2132889090,
    -1680079193,
    -1046744716,
    -459576895,
    -272742522,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    -1740746414,
    -1473132947,
    -1341970488,
    -1084653625,
    -958395405,
    -710438585,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    -2117940946,
    -1838011259,
    -1564481375,
    -1474664885,
    -1035236496,
    -949202525,
    -778901479,
    -694614492,
    -200395387,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    -2067236844,
    -1933114872,
    -1866530822,
    -1538233109,
    -1090935817,
    -965641998
);

function binb_sha256(m, l) {
    var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h;
    var i, j, T1, T2;

    /* 添加填充 */
    m[l >> 5] |= 0x80 << (24 - (l % 32));
    m[(((l + 64) >> 9) << 4) + 15] = l;

    for (i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];

        for (j = 0; j < 64; j++) {
            if (j < 16) W[j] = m[j + i];
            else
                W[j] = safe_add(
                    safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]), sha256_Gamma0256(W[j - 15])),
                    W[j - 16]
                );

            T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)), sha256_K[j]), W[j]);
            T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
        }

        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
}

function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
}
