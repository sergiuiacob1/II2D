class Circle {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
        this.color = "purple";
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    distance(point) {
        var centerDistance = Vector.distance(this.center, point);
        if (centerDistance < this.radius)
            //inside the circle
            return this.radius - centerDistance;
        return centerDistance - this.radius;
    }
}

class Segment {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.color = "red";
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.stroke();
    }

    distance() {

    }
}

class ObstacleManager {
    constructor() {
        this.all = [];
        this.select = null;
    }

    draw() {
        this.all.forEach(element => {
            element.draw();
        });
    }

    select(mouse) {
        var minDistance = Infinity;
        var currentDistance;
        for (var i = 0; i < this.all.length; ++i) {
            currentDistance = this.all[i].distance(mouse);
            if (currentDistance < minDistance) {
                this.selected = this.all[i];
                minDistance = currentDistance;
            }
        }
    }
}