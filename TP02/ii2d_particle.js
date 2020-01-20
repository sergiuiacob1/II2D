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
    this.minTimeToLive = 30;
    this.maxTimeToLive = 120;
  }


  initParticle(p) {
    p.position.setRandInt(this.min, this.max);
    p.color.r = randInt(0, 255);
    p.color.g = randInt(0, 255);
    p.color.b = randInt(0, 255);
    p.initialTimeToLive = randInt(this.minTimeToLive, this.maxTimeToLive);
    p.timeToLive = p.initialTimeToLive;
  }

  distance(mouse) {
    // mouse is a Vector
    return Vector.distance(this.min, mouse);
  }

  move(mouse) {
    engine.particleManager.selected.min.add(mouse);
    engine.particleManager.selected.max.add(mouse);
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
    this.initialTimeToLive = 0;
    this.timeToLive = 0;
  }

  draw() {
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.timeToLive / this.initialTimeToLive})`;
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
    this.nbAliveMax = 300;
    this.generatorList = [];
    this.selected = null;

    for (var i = 0; i < this.nbAliveMax; ++i) {
      this.all.push(new Particle());
    }
  }

  select(mouse) {
    var minDistance = Infinity;
    var currentDistance;
    for (var i = 0; i < this.generatorList.length; ++i) {
      currentDistance = this.generatorList[i].distance(mouse);
      if (currentDistance < minDistance) {
        this.selected = this.generatorList[i];
        minDistance = currentDistance;
      }
    }
  }

  updateGenerator(generator, start, end) {
    // slow version:
    // // kill
    // for (var i = start; i < end; ++i)
    //   if (this.all[i].timeToLive <= 0)
    //     this.all[i].isAlive = false;

    // //give birth
    // var count = 0;
    // for (var i = start; i < end; ++i)
    //   if (this.all[i].isAlive == false) {
    //     this.all[i].isAlive = true;
    //     generator.initParticle(this.all[i]);
    //     ++count;
    //     if (count > Math.floor(generator.birthRate))
    //       break;
    //   }
    // generator.nbBirth += count;
    // generator.nbBirth = Math.min(generator.nbBirth, end - start);
    // return;

    // kill particles
    for (var i = start; i < start + generator.nbBirth; ++i) {
      if (this.all[i].timeToLive <= 0) {
        // gotta kill it
        this.all[i].isAlive = false;
        // keep only the alive particles at the beginning of the array
        // swap with the last alive particle
        var aux = this.all[i];
        this.all[i] = this.all[start + generator.nbBirth - 1];
        this.all[start + generator.nbBirth - 1] = aux;
        --generator.nbBirth;
        --i;
      }
    }

    // give birth to new particles
    generator.nbBirth += generator.birthRate;
    generator.nbBirth = Math.min(generator.nbBirth, end - start);

    for (var i = Math.floor(start + generator.nbBirth) - 1; i >= start; --i) {
      // optimisation
      // we can do this because all of our alive particles are at the beginning of the array
      if (this.all[i].isAlive == true)
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