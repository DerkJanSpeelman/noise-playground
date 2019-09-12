"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpenSimplexConstants_1 = require("./OpenSimplexConstants");
class Contribution2 {
    constructor(multiplier, xsb, ysb) {
        this.dx = -xsb - multiplier * OpenSimplexConstants_1.SQUISH_2D;
        this.dy = -ysb - multiplier * OpenSimplexConstants_1.SQUISH_2D;
        this.xsb = xsb;
        this.ysb = ysb;
    }
}
class Contribution3 {
    constructor(multiplier, xsb, ysb, zsb) {
        this.dx = -xsb - multiplier * OpenSimplexConstants_1.SQUISH_3D;
        this.dy = -ysb - multiplier * OpenSimplexConstants_1.SQUISH_3D;
        this.dz = -zsb - multiplier * OpenSimplexConstants_1.SQUISH_3D;
        this.xsb = xsb;
        this.ysb = ysb;
        this.zsb = zsb;
    }
}
class Contribution4 {
    constructor(multiplier, xsb, ysb, zsb, wsb) {
        this.dx = -xsb - multiplier * OpenSimplexConstants_1.SQUISH_4D;
        this.dy = -ysb - multiplier * OpenSimplexConstants_1.SQUISH_4D;
        this.dz = -zsb - multiplier * OpenSimplexConstants_1.SQUISH_4D;
        this.dw = -wsb - multiplier * OpenSimplexConstants_1.SQUISH_4D;
        this.xsb = xsb;
        this.ysb = ysb;
        this.zsb = zsb;
        this.wsb = wsb;
    }
}
function shuffleSeed(seed) {
    const newSeed = new Uint32Array(1);
    newSeed[0] = seed[0] * 1664525 + 1013904223;
    return newSeed;
}
class OpenSimplex {
    constructor(clientSeed) {
        this.initialize();
        this.perm = new Uint8Array(256);
        this.perm2D = new Uint8Array(256);
        this.perm3D = new Uint8Array(256);
        this.perm4D = new Uint8Array(256);
        const source = new Uint8Array(256);
        for (let i = 0; i < 256; i++)
            source[i] = i;
        let seed = new Uint32Array(1);
        seed[0] = clientSeed;
        seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)));
        for (let i = 255; i >= 0; i--) {
            seed = shuffleSeed(seed);
            const r = new Uint32Array(1);
            r[0] = (seed[0] + 31) % (i + 1);
            if (r[0] < 0)
                r[0] += i + 1;
            this.perm[i] = source[r[0]];
            this.perm2D[i] = this.perm[i] & 0x0e;
            this.perm3D[i] = (this.perm[i] % 24) * 3;
            this.perm4D[i] = this.perm[i] & 0xfc;
            source[r[0]] = source[i];
        }
    }
    array2D(width, height) {
        const output = new Array(width);
        for (let x = 0; x < width; x++) {
            output[x] = new Array(height);
            for (let y = 0; y < height; y++) {
                output[x][y] = this.noise2D(x, y);
            }
        }
        return output;
    }
    array3D(width, height, depth) {
        const output = new Array(width);
        for (let x = 0; x < width; x++) {
            output[x] = new Array(height);
            for (let y = 0; y < height; y++) {
                output[x][y] = new Array(depth);
                for (let z = 0; z < depth; z++) {
                    output[x][y][z] = this.noise3D(x, y, z);
                }
            }
        }
        return output;
    }
    array4D(width, height, depth, wLength) {
        const output = new Array(width);
        for (let x = 0; x < width; x++) {
            output[x] = new Array(height);
            for (let y = 0; y < height; y++) {
                output[x][y] = new Array(depth);
                for (let z = 0; z < depth; z++) {
                    output[x][y][z] = new Array(wLength);
                    for (let w = 0; w < wLength; w++) {
                        output[x][y][z][w] = this.noise4D(x, y, z, w);
                    }
                }
            }
        }
        return output;
    }
    noise2D(x, y) {
        const stretchOffset = (x + y) * OpenSimplexConstants_1.STRETCH_2D;
        const xs = x + stretchOffset;
        const ys = y + stretchOffset;
        const xsb = Math.floor(xs);
        const ysb = Math.floor(ys);
        const squishOffset = (xsb + ysb) * OpenSimplexConstants_1.SQUISH_2D;
        const dx0 = x - (xsb + squishOffset);
        const dy0 = y - (ysb + squishOffset);
        const xins = xs - xsb;
        const yins = ys - ysb;
        const inSum = xins + yins;
        const hash = (xins - yins + 1) |
            (inSum << 1) |
            ((inSum + yins) << 2) |
            ((inSum + xins) << 4);
        let value = 0;
        for (let c = this.lookup2D[hash]; c !== undefined; c = c.next) {
            const dx = dx0 + c.dx;
            const dy = dy0 + c.dy;
            const attn = 2 - dx * dx - dy * dy;
            if (attn > 0) {
                const px = xsb + c.xsb;
                const py = ysb + c.ysb;
                const indexPartA = this.perm[px & 0xff];
                const index = this.perm2D[(indexPartA + py) & 0xff];
                const valuePart = OpenSimplexConstants_1.gradients2D[index] * dx + OpenSimplexConstants_1.gradients2D[index + 1] * dy;
                value += attn * attn * attn * attn * valuePart;
            }
        }
        return value * OpenSimplexConstants_1.NORM_2D;
    }
    noise3D(x, y, z) {
        const stretchOffset = (x + y + z) * OpenSimplexConstants_1.STRETCH_3D;
        const xs = x + stretchOffset;
        const ys = y + stretchOffset;
        const zs = z + stretchOffset;
        const xsb = Math.floor(xs);
        const ysb = Math.floor(ys);
        const zsb = Math.floor(zs);
        const squishOffset = (xsb + ysb + zsb) * OpenSimplexConstants_1.SQUISH_3D;
        const dx0 = x - (xsb + squishOffset);
        const dy0 = y - (ysb + squishOffset);
        const dz0 = z - (zsb + squishOffset);
        const xins = xs - xsb;
        const yins = ys - ysb;
        const zins = zs - zsb;
        const inSum = xins + yins + zins;
        const hash = (yins - zins + 1) |
            ((xins - yins + 1) << 1) |
            ((xins - zins + 1) << 2) |
            (inSum << 3) |
            ((inSum + zins) << 5) |
            ((inSum + yins) << 7) |
            ((inSum + xins) << 9);
        let value = 0;
        for (let c = this.lookup3D[hash]; c !== undefined; c = c.next) {
            const dx = dx0 + c.dx;
            const dy = dy0 + c.dy;
            const dz = dz0 + c.dz;
            const attn = 2 - dx * dx - dy * dy - dz * dz;
            if (attn > 0) {
                const px = xsb + c.xsb;
                const py = ysb + c.ysb;
                const pz = zsb + c.zsb;
                const indexPartA = this.perm[px & 0xff];
                const indexPartB = this.perm[(indexPartA + py) & 0xff];
                const index = this.perm3D[(indexPartB + pz) & 0xff];
                const valuePart = OpenSimplexConstants_1.gradients3D[index] * dx +
                    OpenSimplexConstants_1.gradients3D[index + 1] * dy +
                    OpenSimplexConstants_1.gradients3D[index + 2] * dz;
                value += attn * attn * attn * attn * valuePart;
            }
        }
        return value * OpenSimplexConstants_1.NORM_3D;
    }
    noise4D(x, y, z, w) {
        const stretchOffset = (x + y + z + w) * OpenSimplexConstants_1.STRETCH_4D;
        const xs = x + stretchOffset;
        const ys = y + stretchOffset;
        const zs = z + stretchOffset;
        const ws = w + stretchOffset;
        const xsb = Math.floor(xs);
        const ysb = Math.floor(ys);
        const zsb = Math.floor(zs);
        const wsb = Math.floor(ws);
        const squishOffset = (xsb + ysb + zsb + wsb) * OpenSimplexConstants_1.SQUISH_4D;
        const dx0 = x - (xsb + squishOffset);
        const dy0 = y - (ysb + squishOffset);
        const dz0 = z - (zsb + squishOffset);
        const dw0 = w - (wsb + squishOffset);
        const xins = xs - xsb;
        const yins = ys - ysb;
        const zins = zs - zsb;
        const wins = ws - wsb;
        const inSum = xins + yins + zins + wins;
        const hash = (zins - wins + 1) |
            ((yins - zins + 1) << 1) |
            ((yins - wins + 1) << 2) |
            ((xins - yins + 1) << 3) |
            ((xins - zins + 1) << 4) |
            ((xins - wins + 1) << 5) |
            (inSum << 6) |
            ((inSum + wins) << 8) |
            ((inSum + zins) << 11) |
            ((inSum + yins) << 14) |
            ((inSum + xins) << 17);
        let value = 0;
        for (let c = this.lookup4D[hash]; c !== undefined; c = c.next) {
            const dx = dx0 + c.dx;
            const dy = dy0 + c.dy;
            const dz = dz0 + c.dz;
            const dw = dw0 + c.dw;
            const attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;
            if (attn > 0) {
                const px = xsb + c.xsb;
                const py = ysb + c.ysb;
                const pz = zsb + c.zsb;
                const pw = wsb + c.wsb;
                const indexPartA = this.perm[px & 0xff];
                const indexPartB = this.perm[(indexPartA + py) & 0xff];
                const indexPartC = this.perm[(indexPartB + pz) & 0xff];
                const index = this.perm4D[(indexPartC + pw) & 0xff];
                const valuePart = OpenSimplexConstants_1.gradients4D[index] * dx +
                    OpenSimplexConstants_1.gradients4D[index + 1] * dy +
                    OpenSimplexConstants_1.gradients4D[index + 2] * dz +
                    OpenSimplexConstants_1.gradients4D[index + 3] * dw;
                value += attn * attn * attn * attn * valuePart;
            }
        }
        return value * OpenSimplexConstants_1.NORM_4D;
    }
    initialize() {
        const contributions2D = [];
        for (let i = 0; i < OpenSimplexConstants_1.p2D.length; i += 4) {
            const baseSet = OpenSimplexConstants_1.base2D[OpenSimplexConstants_1.p2D[i]];
            let previous = null;
            let current = null;
            for (let k = 0; k < baseSet.length; k += 3) {
                current = new Contribution2(baseSet[k], baseSet[k + 1], baseSet[k + 2]);
                if (previous === null)
                    contributions2D[i / 4] = current;
                else
                    previous.next = current;
                previous = current;
            }
            if (current === null) {
                continue;
            }
            current.next = new Contribution2(OpenSimplexConstants_1.p2D[i + 1], OpenSimplexConstants_1.p2D[i + 2], OpenSimplexConstants_1.p2D[i + 3]);
        }
        this.lookup2D = [];
        for (let i = 0; i < OpenSimplexConstants_1.lookupPairs2D.length; i += 2) {
            this.lookup2D[OpenSimplexConstants_1.lookupPairs2D[i]] = contributions2D[OpenSimplexConstants_1.lookupPairs2D[i + 1]];
        }
        const contributions3D = [];
        for (let i = 0; i < OpenSimplexConstants_1.p3D.length; i += 9) {
            const baseSet = OpenSimplexConstants_1.base3D[OpenSimplexConstants_1.p3D[i]];
            let previous = null;
            let current = null;
            for (let k = 0; k < baseSet.length; k += 4) {
                current = new Contribution3(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3]);
                if (previous === null)
                    contributions3D[i / 9] = current;
                else
                    previous.next = current;
                previous = current;
            }
            if (current === null) {
                continue;
            }
            current.next = new Contribution3(OpenSimplexConstants_1.p3D[i + 1], OpenSimplexConstants_1.p3D[i + 2], OpenSimplexConstants_1.p3D[i + 3], OpenSimplexConstants_1.p3D[i + 4]);
            current.next.next = new Contribution3(OpenSimplexConstants_1.p3D[i + 5], OpenSimplexConstants_1.p3D[i + 6], OpenSimplexConstants_1.p3D[i + 7], OpenSimplexConstants_1.p3D[i + 8]);
        }
        this.lookup3D = [];
        for (let i = 0; i < OpenSimplexConstants_1.lookupPairs3D.length; i += 2) {
            this.lookup3D[OpenSimplexConstants_1.lookupPairs3D[i]] = contributions3D[OpenSimplexConstants_1.lookupPairs3D[i + 1]];
        }
        const contributions4D = [];
        for (let i = 0; i < OpenSimplexConstants_1.p4D.length; i += 16) {
            const baseSet = OpenSimplexConstants_1.base4D[OpenSimplexConstants_1.p4D[i]];
            let previous = null;
            let current = null;
            for (let k = 0; k < baseSet.length; k += 5) {
                current = new Contribution4(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3], baseSet[k + 4]);
                if (previous === null)
                    contributions4D[i / 16] = current;
                else
                    previous.next = current;
                previous = current;
            }
            if (current === null) {
                continue;
            }
            current.next = new Contribution4(OpenSimplexConstants_1.p4D[i + 1], OpenSimplexConstants_1.p4D[i + 2], OpenSimplexConstants_1.p4D[i + 3], OpenSimplexConstants_1.p4D[i + 4], OpenSimplexConstants_1.p4D[i + 5]);
            current.next.next = new Contribution4(OpenSimplexConstants_1.p4D[i + 6], OpenSimplexConstants_1.p4D[i + 7], OpenSimplexConstants_1.p4D[i + 8], OpenSimplexConstants_1.p4D[i + 9], OpenSimplexConstants_1.p4D[i + 10]);
            current.next.next.next = new Contribution4(OpenSimplexConstants_1.p4D[i + 11], OpenSimplexConstants_1.p4D[i + 12], OpenSimplexConstants_1.p4D[i + 13], OpenSimplexConstants_1.p4D[i + 14], OpenSimplexConstants_1.p4D[i + 15]);
        }
        this.lookup4D = [];
        for (let i = 0; i < OpenSimplexConstants_1.lookupPairs4D.length; i += 2) {
            this.lookup4D[OpenSimplexConstants_1.lookupPairs4D[i]] = contributions4D[OpenSimplexConstants_1.lookupPairs4D[i + 1]];
        }
    }
}
exports.default = OpenSimplex;
//# sourceMappingURL=OpenSimplex.js.map