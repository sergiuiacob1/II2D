/**
 * 
 * Vector
 * 
 *  */
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /// @return p1+p2
  static add(p1, p2) {
    return new Vector(p1.x + p2.x, p1.y + p2.y);
  }

  static subtract(p1, p2) {
    return new Vector(p2.x - p1.x, p2.y - p1.y);
  }

  // distance between 2 vectors
  static distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  static dot(u, v) {
    return u.x * v.x + u.y * v.y;
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /// add u to this
  add(u) {
    this.x += u.x;
    this.y += u.y;
    return this;
  }

  /// @return a copy of this
  clone() {
    return new Vector(this.x, this.y);
  }

  /// copy p to this
  set(p) {
    this.x = p.x;
    this.y = p.y;
    return this;
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }

  setRandInt(p1, p2) {
    this.x = randInt(p1.x, p2.x);
    this.y = randInt(p1.y, p2.y);
  }

};



