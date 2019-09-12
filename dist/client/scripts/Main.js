"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const Stats_1 = __importDefault(require("./Stats"));
const Noise_1 = __importDefault(require("./Noise"));
const PRNG_1 = __importDefault(require("./PRNG"));
const dat = __importStar(require("dat.gui"));
class Main {
    constructor() {
        this.gui = new dat.GUI();
        this.noise = [];
        this.algorithms = [
            'Random',
            'Perlin',
            'OpenSimplex'
        ];
        this.algorithm = 'Random';
        this.scale = 30;
        this.octaves = 3;
        this.seed = 1;
        this.lacunarity = 2;
        this.invert = false;
        this.posterize = 0;
        this.brightness = 50;
        this.update = () => {
            this.stats.begin();
            requestAnimationFrame(this.update);
            // this.draw();
            this.stats.end();
        };
        this.draw = () => {
            for (let x = 0; x < this.app.width; x++) {
                const xStep = x * 3;
                for (let y = 0; y < this.app.height; y++) {
                    const yStep = y * 4 * this.app.height;
                    const step = xStep + yStep;
                    let noiseValue = this.noise[x][y];
                    let b = (this.brightness / 100);
                    if (b < 0.5) {
                        b = noiseValue * (2 * b);
                    }
                    if (b >= 0.5) {
                        b = noiseValue * (2 - 2 * b) + (2 * b - 1);
                    }
                    let value = (((noiseValue + (b * 2 - 1)) - (.5 * (this.posterize / 100))) * 256);
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
        };
        this.generate = () => {
            this.prng = new PRNG_1.default(this.seed);
            switch (this.algorithm) {
                case 'Random':
                    this.noise = Noise_1.default.Random(this.app.width, this.app.height);
                    break;
                case 'Perlin':
                    this.noise = Noise_1.default.Improved('Perlin', this.prng, this.app.width, this.app.height, this.scale, this.octaves, this.seed, this.lacunarity);
                    break;
                case 'OpenSimplex':
                    this.noise = Noise_1.default.Improved('OpenSimplex', this.prng, this.app.width, this.app.height, this.scale, this.octaves, this.seed, this.lacunarity);
                default:
                    break;
            }
        };
        this.resize = () => {
            this.app.resize();
        };
        this._addEventListeners = () => {
            window.addEventListener('resize', this.resize);
        };
        this.configGUI = () => {
            let t = this;
            this.gui.add(this, 'algorithm', this.algorithms).onFinishChange(() => {
                t.generate();
                t.draw();
            });
            ;
            this.gui.add(this, 'scale', 0, 500).onFinishChange(() => {
                t.generate();
                t.draw();
            });
            ;
            this.gui.add(this, 'octaves', 1, 20).step(1).onFinishChange(() => {
                t.generate();
                t.draw();
            });
            ;
            this.gui.add(this, 'seed').onFinishChange(() => {
                t.generate();
                t.draw();
            });
            ;
            this.gui.add(this, 'lacunarity', 0, 3).onFinishChange(() => {
                t.generate();
                t.draw();
            });
            ;
            const adjustmentsFolder = this.gui.addFolder('Adjustments');
            adjustmentsFolder.add(this, 'brightness', 0, 100).onChange(() => {
                t.draw();
            });
            adjustmentsFolder.add(this, 'posterize', 0, 100).onChange(() => {
                t.draw();
            });
            adjustmentsFolder.add(this, 'invert').onChange(() => {
                t.draw();
            });
            ;
            const debuggingFolder = this.gui.addFolder('Debugging');
            debuggingFolder.add(this.stats, 'logs');
        };
        this.app = new App_1.default({
            maxWidth: 770,
            maxHeight: 1600,
        });
        this.stats = new Stats_1.default();
        this.stats.logs = false;
        this.configGUI();
        this.generate();
        this._addEventListeners();
        this.update();
        this.draw();
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map