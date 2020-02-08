class Circle {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
        this.color = "red";
        this.oldCenter = center.clone();
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    distance(point) {
        var centerDistance = Vector.distance(this.center, point);
        if (centerDistance <= this.radius)
            // L'interieur du cercle
            return this.radius - centerDistance;
        return centerDistance - this.radius;
    }

    pointIsInside(point) {
        var centerDistance = Vector.distance(this.center, point);
        return centerDistance <= this.radius;
    }

    move(m) {
        this.center.add(m);
    }

    intersect(p1, p2) {
        var isIntersect;
        var ncol, pcol;
        var p1IsInside = this.pointIsInside(p1);
        var p2IsInside = this.pointIsInside(p2);

        if ((p1IsInside && !p2IsInside) || (!p1IsInside && p2IsInside))
            isIntersect = true;
        else
            isIntersect = false;

        if (isIntersect) {
            pcol = p1;
            ncol = Vector.subtract(p1, this.center);
            ncol.divide(ncol.length());
        }

        return {
            isIntersect: isIntersect,
            ncol: ncol,
            pcol: pcol
        };
    }

    getOldCorrectPosition(particle) {
        var difference = Vector.subtract(this.oldCenter, this.center);
        var oldCorrect = Vector.add(difference, particle.oldPosition);
        return oldCorrect;
    }

    getVitesse(deltaTime){
        return Vector.scalarProduct(Vector.subtract (this.oldCenter, this.center), deltaTime);
    }
}

class Segment {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.color = "red";
        this.zone = null;
        this.oldA = a.clone();
        this.oldB = b.clone();
    }

    move(m) {
        if (this.zone == "a")
            this.a.add(m);
        else
            if (this.zone == "b")
                this.b.add(m);
            else {
                this.a.add(m);
                this.b.add(m);
            }
    }

    intersect(p1, p2) {
        var isIntersect;
        var ncol;

        var ab = Vector.subtract(this.b, this.a);
        ncol = new Vector(-ab.y, ab.x);
        var firstAngle = Vector.dot(Vector.subtract(p1, this.a), ncol);
        var secondAngle = Vector.dot(Vector.subtract(p2, this.a), ncol);
        if (firstAngle * secondAngle < 0) {
            var ap2 = Vector.subtract(p2, this.a);
            var ab = Vector.subtract(this.b, this.a);
            var bp2 = Vector.subtract(p2, this.b);
            var ba = Vector.subtract(this.a, this.b);
            if (!(Vector.dot(ap2, ab) < 0 || Vector.dot(bp2, ba) < 0))
                isIntersect = true;
            else
                isIntersect = false;
        }
        else
            isIntersect = false;

        return {
            isIntersect: isIntersect,
            ncol: ncol,
            pcol: this.a
        };
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.stroke();
    }

    distance(m) {
        this.zone = this.getZone(m);
        if (this.zone == "a")
            return Vector.distance(this.a, m);
        else
            if (this.zone == "b")
                return Vector.distance(this.b, m);
        return this.getDistanceToLine(m);
    }

    getDistanceToLine(m) {
        var ab = Vector.subtract(this.b, this.a);
        var n = new Vector(-ab.y, ab.x);
        var am = Vector.subtract(m, this.a);
        return Math.abs(Vector.dot(n, am)) / n.length();
    }

    getZone(m) {
        // Dans la zone a
        var am = Vector.subtract(m, this.a);
        var ab = Vector.subtract(this.b, this.a);
        if (Vector.dot(am, ab) < 0)
            return "a";

        // Dans la zone b
        var bm = Vector.subtract(m, this.b);
        var ba = Vector.subtract(this.a, this.b);
        if (Vector.dot(bm, ba) < 0)
            return "b";

        // Dans la zone line
        // Pour une marge d'erreur
        var distanceToLine = this.getDistanceToLine(m);
        var distA = Vector.distance(this.a, m);
        var distB = Vector.distance(this.b, m);
        var minDist = Math.min(distA, distB);
        var distanceFromProjectionToSegmentEnd = Math.sqrt(Math.pow(minDist, 2), Math.pow(distanceToLine, 2));
        if (distanceFromProjectionToSegmentEnd <= Segment.errorMargin)
            if (distA < distB)
                return "a";
            else
                return "b";
        return "line";
    }

    getOldCorrectPosition(particle) {
        let oldMiddle = new Vector((this.oldA.x + this.oldB.x) / 2, (this.oldA.y + this.oldB.y) / 2);
        let middle = new Vector((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
        let difference = Vector.subtract(oldMiddle, middle);
        let oldCorrect = Vector.add(particle.oldPosition, difference);
        return oldCorrect;
    }

    getVitesse(deltaTime){
        let oldMiddle = new Vector((this.oldA.x + this.oldB.x) / 2, (this.oldA.y + this.oldB.y) / 2);
        let middle = new Vector((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
        let difference = Vector.subtract(oldMiddle, middle);
        return difference.divide(deltaTime);
    }
}

Segment.errorMargin = 25;

class ObstacleManager {
    constructor() {
        this.all = [];
        this.selected = null;
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
        // Select l'obstacle si il est dans la zone ObstacleManager.clickZone pixels
        if (minDistance > ObstacleManager.clickZone)
            this.selected = null;
    }

    update() {
        this.all.forEach(element => {
            if (element.constructor.name == 'Circle')
                element.oldCenter = element.center.clone();
            else {
                element.oldA = element.a.clone();
                element.oldB = element.b.clone();
            }
        });
    }
}

ObstacleManager.clickZone = 50;