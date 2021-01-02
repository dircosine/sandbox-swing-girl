import { Girl } from "./girl.js";

const PI = Math.PI;

const MIN_SPEED = 0.2;
const MAX_SPEED = 0.9;

const DELTA = 180;
const DELTA_1Q = 0.25 * DELTA;
const DELTA_HALF = 0.5 * DELTA;
const DELTA_3Q = 0.75 * DELTA;

const COLORS = ['#55EEF4', '#3281F0', '#E201F8', '#ED2685', '#F3E52A', '#58FBD3', '#EB4B20'];

export class Swing {
    constructor(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.xCenter = stageWidth / 2;
        this.ropeLength = (stageHeight * 2) / 3;

        this.afterImageAngles = [0, 0, 0, 0, 0, 0];

        this.maxAngle = 0;
        this.t = 0;
        this.speed = MIN_SPEED;

        this.color = '#fff';

        this.didReachMaxAngle = false;
        this.needBox = false;
        this.needStamp = false;

        if (this.stageHeight >= 600) {
            this.scale = 1;
        } else {
            this.scale = (this.stageHeight / 600);
        }
        

        this.girl = new Girl(this.scale);

        this.box = {
            x: this.xCenter + Math.sin(MAX_SPEED) * (this.ropeLength - 210 *  this.scale),
            y: Math.cos(MAX_SPEED) * (this.ropeLength - 250 *  this.scale),
            w: 320 *  this.scale,
            h: 320 *  this.scale,
        };
    }

    animate(ctx, isMouseDown) {
        if (this.t < DELTA) {
            this.t += 1;

            if (isMouseDown && this.t > DELTA_1Q && this.t < DELTA_3Q) {
                // accel
                this.speed < MAX_SPEED && (this.speed += 0.0025);
            } else if (this.t < DELTA_HALF) {
                // deAccel
                this.speed > MIN_SPEED && (this.speed -= 0.0015);
            }

            if (Math.floor(this.t) === DELTA_HALF && this.speed >= MAX_SPEED) {
                this.needBox = true;
            }
        } else {
            this.t = 0;
            this.didReachMaxAngle = false;
        }

        const angle = Math.sin((PI / DELTA_HALF) * this.t) * this.speed;
        
        this.afterImageAngles.shift();
        this.afterImageAngles.push(angle);

        ctx.save();

        // flash
        this.didReachMaxAngle && this.drawFlash(ctx);

        { // style
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.lineWidth = 5;

            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
        }

        if (this.t > DELTA_HALF && this.needBox) {
            if (this.t > DELTA_3Q && !this.didReachMaxAngle && isMouseDown) {
                this.color = COLORS[Math.floor(Math.random() * 7)];
                this.maxAngle = angle;
                this.needBox = false;
                this.didReachMaxAngle = true;
                this.needStamp = true;
            }

            this.drawBoxAndClip(ctx);

            // draw after-images
            for (let i = 0; i < this.afterImageAngles.length; i++) {
                ctx.save();

                ctx.globalAlpha = 0.1 * i;

                this.drawRope(ctx, this.afterImageAngles[i]);

                this.girl.animate(ctx, isMouseDown, angle, this.ropeLength);

                ctx.restore();
            }

            // slow motion
            this.t -= 0.3;
        } else if (this.needStamp) {
            ctx.save();

            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.shadowBlur = 20;

            this.drawBoxAndClip(ctx);

            this.drawRope(ctx, this.maxAngle);
            this.girl.animate(ctx, true, this.maxAngle, this.ropeLength);

            ctx.restore();
        }
        
        
        { // style
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
        }
        
        ctx.globalAlpha = 0.6;
        this.drawRope(ctx, angle);

        ctx.globalAlpha = 1;
        this.girl.animate(ctx, isMouseDown, angle, this.ropeLength);

        ctx.restore();
    }

    drawRope(ctx, angle) {
        ctx.translate(this.xCenter, -10);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(-5, -10);
        ctx.lineTo(11 * this.scale, this.ropeLength);
        ctx.moveTo(-15 * this.scale, this.ropeLength);
        ctx.lineTo(5, 10);
        ctx.stroke();
        ctx.closePath();
    }

    drawFlash(ctx) {
        ctx.save()
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max((150 - this.t) / (160 - DELTA_3Q), 0);
        ctx.fillRect(0, 0, this.stageWidth, this.stageHeight);
        ctx.restore();
    }

    drawBoxAndClip(ctx) {
        ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);
        ctx.rect(this.box.x, this.box.y, this.box.w, this.box.h);
        ctx.clip();
    }
}
