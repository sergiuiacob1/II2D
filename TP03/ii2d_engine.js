/**
 * 
 * 
 * */


var randInt = function (a, b) {
  return Math.floor(Math.random() * (b - a) + a);
}

var setAttributes = function (v, lAttrib) {
  for (var k in lAttrib) {
    v[k] = lAttrib[k];
  }
}



class Engine {
  constructor() {
    this.particleManager = new ParticleManager();
    this.obstacleManager = new ObstacleManager();
    this.time = 0;
    this.deltaTime = 0.01;
  }

  draw() {
    // ctx.clearRect(0, 0, 500, 500);
    ctx.fillStyle = '#ffa577';
    ctx.fillRect(0, 0, 500, 500);
    this.particleManager.draw();
    this.obstacleManager.draw();
  }

  updateData() {
    this.particleManager.update();
    this.motion();
    this.collision();
  }

  loop() {
    this.time += this.deltaTime;
    this.updateData();
    this.draw();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  start() {
    this.loop();
  }

  motion() {
    this.particleManager.motion(this.deltaTime);
  }

  updateRepulseur(mouse) {
    this.particleManager.updateRepulseurs(mouse);
  }

  collision() {
    var currentGenerator = 0;
    for (var i = 0; i < this.particleManager.nbAliveMax; ++i) {
      if (this.particleManager.all[i].isAlive == false) {
        i = currentGenerator * this.particleManager.nbAliveMax / this.particleManager.generatorList.length;
        --i;
        ++currentGenerator;
        continue;
      }

      this.obstacleManager.all.forEach(obstacle => {
        this.solveCollision(this.particleManager.all[i], obstacle);
      });
    }
  }

  solveCollision(particle, obstacle) {
    var res = obstacle.intersect(particle.oldPosition, particle.position);
    if (res.isIntersect == true) {
      particle.position = particle.oldPosition;
      // this.impulse (particle, res.ncol, res.pcol);
    }
  }

  impulse(particle, ncol, pcol){

  }
}
