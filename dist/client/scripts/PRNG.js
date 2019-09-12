"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PRNG {
    constructor(seed) {
        this.calc = (n) => {
            return Math.round(n * this.m - 1);
        };
        this.shift = () => {
            this.seed = this.seed * this.a % this.m;
        };
        this.next = (minOrMax, max) => {
            this.shift();
            let min = minOrMax;
            if (min === undefined)
                min = 0;
            if (max === undefined) {
                max = min;
                min = 0;
            }
            if (min === 0 || (max === undefined || max === 0 || max === 1)) {
                return this.seed / this.m;
            }
            if (min === max)
                return this.seed / this.m + min;
            if (min > max) {
                minOrMax = max;
                max = min;
                min = minOrMax;
            }
            return (this.seed / this.m) * (max - min) + min;
        };
        this.m = 2147483647;
        this.a = 16807;
        let s;
        if (seed === undefined) {
            s = this.calc(Math.random());
        }
        else {
            if (typeof seed === 'string') {
                let n = 0;
                for (let i = 0; i < seed.length; i++) {
                    n += seed.charCodeAt(i);
                }
                s = this.calc(n);
            }
            else {
                s = seed;
            }
        }
        this.seed = s % this.m;
        if (this.seed <= 0)
            this.seed += this.m - 1;
        this.shift();
    }
}
exports.default = PRNG;
//# sourceMappingURL=PRNG.js.map