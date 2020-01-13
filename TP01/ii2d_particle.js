/**
 * 
 * 
 * 
 * */

class GeneratorBox {
  constructor(nbBirth = 0, birthRate = 1) {
    this.nbBirth = nbBirth;
    this.birthRate = birthRate;
    this.min = new Vector(0, 0);
    this.max = new Vector(500, 500);
    this.minTimeToLive = 0;
    this.maxTimeToLive = 10;
  }


  initParticle(p) {
    p.position.setRandInt(this.min, this.max);
    p.color.r = randInt(0, 255);
    p.color.g = randInt(0, 255);
    p.color.b = randInt(0, 255);
    p.timeToLive = randInt(this.minTimeToLive, this.maxTimeToLive);
  }
};



/**
 * 
 * 
 * 
 *  */
class Particle {
  constructor() {
    this.position = new Vector(0, 0);
    this.color = { r: 0, g: 0, b: 0 }
    this.isAlive = false;
    this.timeToLive = 0;
  }

  draw() {
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
    ctx.fillRect(this.position.x, this.position.y, 5, 5);
  }

};

/**
 * 
 * 
 * 
 * 
 * */


class ParticleManager {
  constructor() {
    this.all = []
    this.nbAliveMax = 1000;
    this.generatorList = []

    for (var i = 0; i < this.nbAliveMax; ++i) {
      this.all.push(new Particle());
    }
  }

  updateGenerator(generator, start, end) {
    // kill particles
    var no_killed = 0;
    for (var i = start; i < start + generator.nbBirth; ++i) {
      if (this.all[i].timeToLive <= 0) {
        // this particle must die
        this.all[i].isAlive = false;
        swap(this.all[i], this.all[start + generator.nbBirth - 1 - no_killed]);
        ++no_killed;
      }
    }
    generator.nbBirth -= no_killed;

    // give birth to new particles
    generator.nbBirth += generator.birthRate;
    generator.nbBirth = Math.min(generator.nbBirth, end - start - 1);

    for (var i = Math.floor(start + generator.nbBirth); i >= start; --i) {
      if (this.all[i].isAlive)
        break;
      this.all[i].isAlive = true;
      generator.initParticle(this.all[i]);
    }
  }

  update() {
    // update the time to live
    this.all.forEach(element => {
      if (element.isAlive)
        --element.timeToLive;
    });

    // each generator takes care of a portion of the particles
    this.updateGenerator(this.generatorList[0], 0, this.nbAliveMax / 2);
    this.updateGenerator(this.generatorList[1], this.nbAliveMax / 2, this.nbAliveMax);
  }

  draw() {
    for (var i = 0; i < this.generatorList[0].nbBirth; ++i)
      this.all[i].draw();

    for (var i = 0; i < this.generatorList[1].nbBirth; ++i)
      this.all[this.nbAliveMax / 2 + i].draw();
  }
};


function swap(x, y) {
  var t = x;
  x = y;
  y = t;
}