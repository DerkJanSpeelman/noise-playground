import App from './App';
import Stats from './Stats';
import dat from 'dat.gui';

export default class Main {
    public app: App;

    public gui: dat.GUI = new dat.GUI();

    public stats: Stats;

    constructor() {
        this.app = new App();
        this.stats = new Stats();

        requestAnimationFrame(this.update);

        this._addEventListeners();
    }

    private update = (): void => {

        this.stats.begin();

        requestAnimationFrame(this.update);

        // code here

        this.stats.end();
    }

    private resize = (): void => {
        this.app.resize();
    }

    private _addEventListeners = (): void => {
        window.addEventListener('resize', this.resize);
    }
}