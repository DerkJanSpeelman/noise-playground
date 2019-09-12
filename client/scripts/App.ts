interface AppOptions {
    containerSelector?: string,
    maxWidth?: number,
    maxHeight?: number,
}

export default class App {
    public container: HTMLElement;
    public canvas: HTMLCanvasElement;

    public ctx!: CanvasRenderingContext2D;

    public width!: number;
    public height!: number;
    public imageData!: ImageData;
    public values!: Uint8ClampedArray;

    public maxWidth?: number;
    public maxHeight?: number;

    constructor(opts?: AppOptions) {
        let containerSelector: string = '.canvas-container';

        if (opts) {
            if (opts.containerSelector) {
                containerSelector = opts.containerSelector;
            }

            this.maxWidth = opts.maxWidth;
            this.maxHeight = opts.maxHeight;
        }

        let container: HTMLElement | null = document.querySelector(containerSelector);
        this.container = container || document.body;

        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);

        let ctx = this.canvas.getContext('2d');
        if (ctx) {
            this.ctx = ctx;
        }

        this.resize();
    }

    public resize = (): void => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.maxSize();

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        this.values = this.imageData.data;
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