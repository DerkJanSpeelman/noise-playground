"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Perlin_1 = __importDefault(require("./Algorithms/Perlin"));
const OpenSimplex_1 = __importDefault(require("./Algorithms/OpenSimplex"));
class Noise {
}
exports.default = Noise;
// Random Noise
// Perlin Noise
/**
 * Random Noise function
 *
 * @param  {number} width
 * @param  {number} height
 * @returns {number[][]} noise
 */
Noise.Random = (width, height) => {
    let noise = [];
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (noise[x] === undefined) {
                noise[x] = [];
            }
            noise[x][y] = Math.random();
        }
    }
    return noise;
};
/**
 * Improved Noise function
 *
 * @param  {number} width
 * @param  {number} height
 * @returns {number[][]} noise
 */
Noise.Improved = (algorithm, prng, width, height, scale, octaves, seed, lacunarity) => {
    let noise = [];
    let openSimplex = new OpenSimplex_1.default(seed);
    let octaveOffset = [];
    for (let i = 0; i < octaves; i++) {
        octaveOffset[i] = {
            x: prng.next(-10000, 10000),
            y: prng.next(-10000, 10000),
        };
    }
    if (scale <= 0)
        scale = 0.001;
    for (let x = 0; x < width; x++) {
        if (noise[x] === undefined) {
            noise[x] = [];
        }
        for (let y = 0; y < height; y++) {
            let height = 0, frequency = 1, amplitude = 1;
            for (let i = 0; i < octaves; i++) {
                const X = (x + octaveOffset[i].x) / scale * frequency;
                const Y = (y + octaveOffset[i].y) / scale * frequency;
                switch (algorithm) {
                    case 'Perlin':
                        height += Perlin_1.default.noise(seed, X, Y) * amplitude;
                        break;
                    case 'OpenSimplex':
                        height += openSimplex.noise2D(X, Y);
                        break;
                    default:
                        height += Perlin_1.default.noise(seed, X, Y) * amplitude;
                        break;
                }
                frequency *= lacunarity;
            }
            noise[x][y] = height / 2 + .5;
        }
    }
    return noise;
};
Noise.OpenSimplex = (width, height) => {
    let openSimiplex = new OpenSimplex_1.default(1);
    let noise = [];
    for (let x = 0; x < width; x++) {
        if (noise[x] === undefined) {
            noise[x] = [];
        }
        for (let y = 0; y < height; y++) {
            const X = (x + 0) / 30;
            const Y = (y + 0) / 30;
            noise[x][y] = openSimiplex.noise2D(X, Y);
        }
    }
    return noise;
};
//# sourceMappingURL=Noise.js.map