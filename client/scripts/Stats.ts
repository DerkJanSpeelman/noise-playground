interface VisibleStats {
    miliseconds?: number,
    fps?: number,
    memory?: number
}

export default class Stats {
    public logs: boolean = false;

    private beginTime: number;
    private prevTime: number;
    private frames: number = 0;

    public visibleStats: VisibleStats = {};

    constructor() {
        this.beginTime = (performance || Date).now();
        this.prevTime = this.beginTime;
    }

    public begin = (): void => {
        this.beginTime = (performance || Date).now();
    }

    public end = (): void => {
        this.frames++;

        const time: number = (performance || Date).now();

        this.visibleStats.miliseconds = Math.round((time - this.beginTime) * 100 * 10) / 10;

        if (time > this.prevTime + 1000) {

            this.visibleStats.fps = Math.round((this.frames * 1000 ) / (time - this.prevTime));

            this.prevTime = time;
            this.frames = 0;

            if (self.performance) {
                // @ts-ignore
                let memory: MemoryInfo = performance.memory;
                if (memory) {
                    this.visibleStats.memory = Math.round((memory.usedJSHeapSize / 1048576) * 10) / 10;
                }
            }

            if (this.logs) {
                console.log(this.visibleStats);
            }
        }
    }
}