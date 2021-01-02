import path from './path.js';


export class Girl {
    constructor(scale) {
        this.girl = [new Path2D(path.girl[0]), new Path2D(path.girl[1])];
        this.hair = new Path2D(path.hair);
        this.legs = new Path2D(path.legs);
        
        this.scale = scale;
    }

    animate(ctx, isDown, angle, ropeLength) {
        ctx.translate(-150 * this.scale, (ropeLength - 140 * this.scale));

        ctx.scale(this.scale, this.scale);
        // girl
        ctx.save();
        ctx.fill();
        // ctx.fill(this.girl);
        isDown ? ctx.fill(this.girl[1]) : ctx.fill(this.girl[0]);
        ctx.restore();

        ctx.save();
        ctx.translate(153, 195);
        ctx.rotate(0.4);
        isDown ? ctx.rotate(-0.5): ctx.rotate(angle * 0.5);
        ctx.fill(this.legs);
        ctx.restore();

        // hair
        ctx.save();
        ctx.translate(140, 70);
        ctx.rotate(-angle * 1.2 + 1.7);
        ctx.fill(this.hair);
        ctx.restore();
    }
}