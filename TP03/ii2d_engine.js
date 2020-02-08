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
    this.epsilon = 0.5;
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
    this.obstacleManager.update();
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
        // I'm finished with the alive particles for this generator
        i = currentGenerator * this.particleManager.nbAliveMax / this.particleManager.generatorList.length;
        --i;
        ++currentGenerator;
        continue;
      }

      var adjustments = {
        "position": new Vector(0, 0),
        "velocity": new Vector(0, 0)
      };

      this.obstacleManager.all.forEach(obstacle => {
        let res = this.solveCollision(this.particleManager.all[i], obstacle);
        adjustments["position"].add(res["position"]);
        adjustments["velocity"].add(res["velocity"]);
      });

      // after treating all obstacles, adjust the particle's position and velocity
      this.particleManager.all[i].position.add(adjustments["position"]);
      this.particleManager.all[i].velocity.add(adjustments["velocity"]);
    }
  }

  solveCollision(particle, obstacle) {
    var originalValues = {
      "position": particle.position.clone(),
      "velocity": particle.velocity.clone()
    };
    var correctOldPosition = obstacle.getOldCorrectPosition(particle);
    var res = obstacle.intersect(correctOldPosition, particle.position);
    if (res.isIntersect == true) {
      this.impulse(particle, res.ncol, res.pcol);

      if (obstacle.constructor.name == 'Circle') {
        if (obstacle.pointIsInside(correctOldPosition) == true && obstacle.pointIsInside(particle.position) == false) {
          let pc = Vector.subtract(particle.position, obstacle.center);
          let pcLength = pc.length();
          let distance = obstacle.distance(particle.position) + 1;
          particle.position.add(Vector.scalarProduct(pc, distance / pcLength));
        }
      }

      // augment speed
      let vitesse = obstacle.getVitesse(this.deltaTime);
      particle.velocity.add(vitesse);
    }

    // return the difference that it should be made
    var res = {
      "position": Vector.subtract(originalValues["position"], particle.position),
      "velocity": Vector.subtract(originalValues["velocity"], particle.velocity),
    };

    particle.position = originalValues["position"];
    particle.velocity = originalValues["velocity"];

    return res;
  }

  impulse(particle, ncol, pcol) {
    var vcol, vn_new;
    // make the normal unitary (length = 1)
    ncol.divide(ncol.length());

    // change the velocity
    // vcol = vn_col + vt_col;

    // vn_col = -epsilon * vn_new
    // vn_new = (v_new * ncol) * ncol, with ncol being unitary

    // vt_col = vt_new, vt_new = v_new - vn_new

    // so, in the end:
    // vcol = v_new - (1 + epsilon)*vn_new

    vn_new = Vector.scalarProduct(ncol, Vector.dot(particle.velocity, ncol));
    vcol = Vector.subtract(Vector.scalarProduct(vn_new, 1 + this.epsilon), particle.velocity);
    particle.velocity = vcol;


    // correct position
    // xcol = xnew + (1 + epsilon) * H
    // H = ((m - xnew)*ncol)*ncol
    var H = Vector.scalarProduct(ncol, Vector.dot(Vector.subtract(particle.position, pcol), ncol));
    var xcol = Vector.add(particle.position, Vector.scalarProduct(H, 1 + this.epsilon));
    particle.position = xcol;
  }
}
