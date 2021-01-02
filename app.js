import { Swing } from './swing.js';

const PI = Math.PI;

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.isDown = false;
        this.showText = true;

        document.addEventListener('mousedown', this.onDown.bind(this), false);
        document.addEventListener('touchstart', this.onDown.bind(this), false);
        document.addEventListener('mouseup', this.onUp.bind(this), false);
        document.addEventListener('touchend', this.onUp.bind(this), false);

        window.oncontextmenu = function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        
        window.requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);
        
        if (this.stageWidth < this.stageHeight) { // 뷰포트 세로가 더 길면 캔버스 전체 90도 회전
            [this.stageHeight, this.stageWidth] = [this.stageWidth, this.stageHeight];
            this.ctx.translate(this.stageHeight, 0);
            this.ctx.rotate(Math.PI / 2);
        }

        if (this.stageWidth < this.stageHeight * 1.6) { // 종횡비 충분하지 않으면 height 제한
            this.stageHeight = this.stageWidth / 1.6;
        }
        
        this.swing = new Swing(this.stageWidth, this.stageHeight);
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        this.ctx.fillStyle = '#777';
        this.ctx.fillText("wwoong22", this.stageWidth - 70, this.stageHeight - 20);

        if (this.showText) {
            this.ctx.save();
            this.ctx.font = "30px Comic Sans MS";
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = "center";
            this.ctx.fillText("Click To Go Higher!", this.stageWidth / 2, this.stageHeight - 50);
            this.ctx.restore();
        }

        this.swing.animate(this.ctx, this.isDown);
    }

    onDown() {
        this.isDown = true;
        this.showText = false;
    }

    onUp() {
        this.isDown = false;
    }
}

window.onload = () => {
    new App();
};
