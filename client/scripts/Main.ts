import App from './App';
import Stats from './Stats';
import Noise from './Noise';
import PRNG from './PRNG';

import * as dat from 'dat.gui';

export default class Main {
    public app: App;

    public stats: Stats;
    public gui: dat.GUI = new dat.GUI();

    public noise: number[][] = [];

    public algorithms: string[] = [
        'Random',
        'Perlin',
        'OpenSimplex'
    ];
    public algorithm: any = 'Random';
    public scale: number = 30;
    public octaves: number = 3;
    public seed: number = 1;
    public prng!: PRNG;
    public lacunarity: number = 2;
    public invert: boolean = false;

    public posterize: number = 0;
    public brightness: number = 50;

    constructor() {
        this.app = new App({
            maxWidth: 400,
            maxHeight: 400,
        });

        this.stats = new Stats();
        this.stats.logs = false;

        this.configGUI();

        this.generate();

        this._addEventListeners();

        this.update();
        this.draw();
    }

    private update = (): void => {

        this.stats.begin();

        requestAnimationFrame(this.update);

        // this.draw();

        this.stats.end();
    }

    private draw = (): void => {
        for (let x = 0; x < this.app.width; x++) {
            const xStep: number = x * 3;

            for (let y = 0; y < this.app.height; y++) {
                const yStep: number = y * 4 * this.app.height;
                const step: number = xStep + yStep;

                let noiseValue: number = this.noise[x][y];
                let b: number = (this.brightness / 100);
                if (b < 0.5) {
                    b = noiseValue * (2 * b);
                }
                if (b >= 0.5) {
                    b = noiseValue * (2 - 2 * b) + (2 * b - 1);
                }

                let value: number = (((noiseValue + (b * 2 -1)) - (.5 * (this.posterize / 100))) * 256);

                if (this.invert) {
                    value = 255 - value;
                }

                this.app.values[step + x] = value;
                this.app.values[step + (x + 1)] = value;
                this.app.values[step + (x + 2)] = value;
                this.app.values[step + (x + 3)] = 255;
            }
        }
        this.app.ctx.putImageData(this.app.imageData, 0, 0);
    }

    public generate = (): void => {
        this.prng = new PRNG(this.seed);
        switch (this.algorithm) {
            case 'Random':
                this.noise = Noise.Random(this.app.width, this.app.height);
                break;
            case 'Perlin':
                this.noise = Noise.Improved('Perlin', this.prng, this.app.width, this.app.height, this.scale, this.octaves, this.seed, this.lacunarity);
                break;
            case 'OpenSimplex':
                this.noise = Noise.Improved('OpenSimplex', this.prng, this.app.width, this.app.height, this.scale, this.octaves, this.seed, this.lacunarity);
            default:
                break;
        }
    }

    private resize = (): void => {
        this.app.resize();
    }

    private _addEventListeners = (): void => {
        window.addEventListener('resize', this.resize);
    }

    private configGUI = (): void => {
        let t = this;

        this.gui.add(this, 'algorithm', this.algorithms).onFinishChange(() => {
            t.generate();
            t.draw();
        });;
        this.gui.add(this, 'scale', 0, 500).onFinishChange(() => {
            t.generate();
            t.draw();
        });;
        this.gui.add(this, 'octaves', 1, 20).step(1).onFinishChange(() => {
            t.generate();
            t.draw();
        });;
        this.gui.add(this, 'seed').onFinishChange(() => {
            t.generate();
            t.draw();
        });;
        this.gui.add(this, 'lacunarity', 0, 3).onFinishChange(() => {
            t.generate();
            t.draw();
        });;

        const adjustmentsFolder: any = this.gui.addFolder('Adjustments');
        adjustmentsFolder.add(this, 'brightness', 0, 100).onChange(() => {
            t.draw();
        });
        adjustmentsFolder.add(this, 'posterize', 0, 100).onChange(() => {
            t.draw();
        });
        adjustmentsFolder.add(this, 'invert').onChange(() => {
            t.draw();
        });;
        const debuggingFolder: any = this.gui.addFolder('Debugging');
        debuggingFolder.add(this.stats, 'logs');
    }
}