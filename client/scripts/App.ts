export default class App {
    public container: HTMLElement;
    public canvas: HTMLCanvasElement;

    public ctx: CanvasRenderingContext2D | null;

    public width!: number;
    public height!: number;

    public maxWidth?: number;
    public maxHeight?: number;

    constructor() {
        let container: HTMLElement | null = document.querySelector('.canvas-container');
        this.container = container || document.body;

        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');

        this.resize();
    }

    public resize = (): void => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.maxSize();

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    private maxSize = (): void => {
        if (this.maxWidth && this.maxWidth < this.width) {
            this.width = this.maxWidth;
        }
        if (this.maxHeight && this.maxHeight < this.height) {
            this.height = this.maxHeight;
        }
    }
}