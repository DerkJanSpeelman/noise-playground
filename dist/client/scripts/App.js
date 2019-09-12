"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class App {
    constructor(opts) {
        this.resize = () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.maxSize();
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
            this.values = this.imageData.data;
        };
        this.maxSize = () => {
            if (this.maxWidth && this.maxWidth < this.width) {
                this.width = this.maxWidth;
            }
            if (this.maxHeight && this.maxHeight < this.height) {
                this.height = this.maxHeight;
            }
        };
        let containerSelector = '.canvas-container';
        if (opts) {
            if (opts.containerSelector) {
                containerSelector = opts.containerSelector;
            }
            this.maxWidth = opts.maxWidth;
            this.maxHeight = opts.maxHeight;
        }
        let container = document.querySelector(containerSelector);
        this.container = container || document.body;
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        let ctx = this.canvas.getContext('2d');
        if (ctx) {
            this.ctx = ctx;
        }
        this.resize();
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map