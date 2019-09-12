"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stats {
    constructor() {
        this.logs = false;
        this.frames = 0;
        this.visibleStats = {};
        this.begin = () => {
            this.beginTime = (performance || Date).now();
        };
        this.end = () => {
            this.frames++;
            const time = (performance || Date).now();
            this.visibleStats.miliseconds = Math.round((time - this.beginTime) * 100 * 10) / 10;
            if (time > this.prevTime + 1000) {
                this.visibleStats.fps = Math.round((this.frames * 1000) / (time - this.prevTime));
                this.prevTime = time;
                this.frames = 0;
                if (self.performance) {
                    // @ts-ignore
                    let memory = performance.memory;
                    if (memory) {
                        this.visibleStats.memory = Math.round((memory.usedJSHeapSize / 1048576) * 10) / 10;
                    }
                }
                if (this.logs) {
                    console.log(this.visibleStats);
                }
            }
        };
        this.beginTime = (performance || Date).now();
        this.prevTime = this.beginTime;
    }
}
exports.default = Stats;
//# sourceMappingURL=Stats.js.map