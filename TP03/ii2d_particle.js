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
    this.minTimeToLive = 600;
    this.maxTimeToLive = 6000;
  }


  initParticle(p) {
    p.position.setRandInt(this.min, this.max);
    p.color.r = randInt(0, 255);
    p.color.g = randInt(0, 255);
    p.color.b = randInt(0, 255);
    p.initialTimeToLive = randInt(this.minTimeToLive, this.maxTimeToLive);
    p.timeToLive = p.initialTimeToLive;
    p.velocity.setRandInt(new Vector(-100, -200), new Vector(100, 100));
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
    this.velocity = new Vector(0, 0);
    this.mass = 1;
    this.force = Vector.scalarProduct(new Vector(0, 9.81), this.mass);
    this.acceleration = Vector.scalarProduct(this.force, 100).divide(this.mass);
    this.oldVelocity = null;
    this.oldPosition = null;
  }

  isOutsideOfCanvas(){
    let x = this.position.x;
    let y = this.position.y
    return (x < 0 || x > CANVAS_WIDTH || y < 0 || y > CANVAS_HEIGHT);
  }

  draw() {
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.timeToLive / this.initialTimeToLive})`;
    ctx.fillRect(this.position.x, this.position.y, 5, 5);
  }

  motion(deltaTime, forces) {
    this.oldPosition = this.position.clone();
    this.oldVelocity = this.velocity.clone();

    var dp = Vector.scalarProduct(this.velocity, deltaTime);
    this.position.add(dp);

    // update velocity 
    this.velocity.add(Vector.scalarProduct(this.acceleration, deltaTime));

    forces.forEach(force => {
      this.position.add(force);
    });
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
    this.generatorList = [];
    this.repulseurs = [];
    this.selected = null;

    for (var i = 0; i < this.nbAliveMax; ++i) {
      this.all.push(new Particle());
    }
  }

  addGenerators(generators) {
    generators.forEach(generator => {
      this.generatorList.push(generator);
      this.repulseurs.push(new Vector(0, 0));
    });
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

  motion(deltaTime) {
    var start;
    for (var i = 0; i < this.generatorList.length; ++i) {
      start = i * (this.all.length / this.generatorList.length);
      for (var j = start; j < start + this.generatorList[i].nbBirth; ++j)
        this.all[j].motion(deltaTime, [this.repulseurs[i]]);
    }
  }

  updateRepulseurs(mouse) {
    for (var i = 0; i < this.generatorList.length; ++i) {
      var centerX = (this.generatorList[i].min.x + this.generatorList[i].max.x) / 2;
      var centerY = (this.generatorList[i].min.y + this.generatorList[i].max.y) / 2;
      var center = new Vector(centerX, centerY);
      this.repulseurs[i] = Vector.subtract(mouse, center).divide(100);
    }
  }

  updateGenerator(generator, start, end) {
    // Arrêter les particules
    for (var i = start; i < start + generator.nbBirth; ++i) {
      if (this.all[i].timeToLive <= 0 || (this.all[i].isOutsideOfCanvas())) {
        // On doit l'arrêter
        this.all[i].isAlive = false
        // Il garde juste les particles actives au debut du tableau
        // Swap avec la dernière particule active
        var aux = this.all[i];
        this.all[i] = this.all[start + generator.nbBirth - 1];
        this.all[start + generator.nbBirth - 1] = aux;
        --generator.nbBirth;
        --i;
      }
    }

    // Créer des nouvelle particules
    generator.nbBirth += generator.birthRate;
    generator.nbBirth = Math.min(generator.nbBirth, end - start);

    for (var i = Math.floor(start + generator.nbBirth) - 1; i >= start; --i) {
      // Optimisation
      // On peut faire ça parceque toutes les particules sont au debut du tableau
      if (this.all[i].isAlive == true)
        break;
      this.all[i].isAlive = true;
      generator.initParticle(this.all[i]);
    }
  }

  update() {
    // MAJ du timeToLive
    this.all.forEach(element => {
      if (element.isAlive)
        --element.timeToLive;
    });

    // Chaque générateur se charge d'une partie des particules
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