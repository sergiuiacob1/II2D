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
    this.max = new Vector(CANVAS_WIDTH - 50, CANVAS_HEIGHT - 50);
    this.minTimeToLive = 60 * 2;
    this.maxTimeToLive = 60 * 5;
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
    this.oldVelocity = this.velocity.clone();
    this.oldPosition = this.position.clone();
  }

  isOutsideOfCanvas() {
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
    this.repulsorIsActivated = false;
    this.shouldAddRandomGenerator = false;

    this.resetParticles();
  }

  resetParticles() {
    delete this.all;
    this.all = [];
    for (var i = 0; i < this.nbAliveMax; ++i)
      this.all.push(new Particle());

    this.generatorList.forEach(generator => {
      generator.nbBirth = 0;
    });
  }

  toggleRepulseur() {
    this.repulsorIsActivated = !this.repulsorIsActivated;
  }

  addGenerators(generators) {
    generators.forEach(generator => {
      this.generatorList.push(generator);
      this.repulseurs.push(new Vector(0, 0));
    });

    this.resetParticles();
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
    let step = Math.floor(this.nbAliveMax / this.generatorList.length);
    let start = 0, end = step;
    for (var i = 0; i < this.generatorList.length; ++i) {
      if (i == this.generatorList.length - 1)
        end = this.nbAliveMax;

      for (var j = start; j < start + this.generatorList[i].nbBirth; ++j) {
        let forces = [];
        if (this.repulsorIsActivated)
          forces.push(this.repulseurs[i]);
        this.all[j].motion(deltaTime, forces);
      }

      start = end;
      end += step;
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
    if (this.nbAliveMax != parseInt(document.getElementById("nbAliveMax-value").value)) {
      this.nbAliveMax = parseInt(document.getElementById("nbAliveMax-value").value);
      this.resetParticles();
    }
    document.getElementById("label-nbAliveMax-value").innerHTML = `nbAliveMax: ${this.nbAliveMax}`;

    if (this.shouldAddRandomGenerator) {
      this.shouldAddRandomGenerator = false;
      let generator = new GeneratorBox(0, randInt(0, 10));
      let x = randInt(50, CANVAS_WIDTH - 200);
      let y = randInt(50, CANVAS_HEIGHT - 200);
      generator.min.setXY(x, y); // setXY à faire dans la classe Vector
      generator.max.setXY(x + randInt(20, 100), y + randInt(20, 100));
      this.addGenerators([generator]);
      return;
    }

    // MAJ du timeToLive
    this.all.forEach(element => {
      if (element.isAlive)
        --element.timeToLive;
    });

    // Chaque générateur se charge d'une partie des particules
    let step = Math.floor(this.nbAliveMax / this.generatorList.length);
    let start = 0, end = step;
    for (var i = 0; i < this.generatorList.length - 1; ++i) {
      this.updateGenerator(this.generatorList[i], start, end);
      start = end;
      end += step;
    }

    this.updateGenerator(this.generatorList[i], start, this.nbAliveMax);
  }

  draw() {
    for (var i = 0; i < this.generatorList[0].nbBirth; ++i)
      this.all[i].draw();

    for (var i = 0; i < this.generatorList[1].nbBirth; ++i)
      this.all[this.nbAliveMax / 2 + i].draw();
  }
};