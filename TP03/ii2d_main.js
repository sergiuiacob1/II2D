var canvas;
var ctx; // !!! context 2D (drawing)
var engine;

var mouseIsPressed = false;


window.addEventListener("load", main);

function addGenerators(engine) {
  var gen1 = new GeneratorBox(0, 3);
  gen1.min.setXY(50, 50); // setXY à faire dans la classe Vector
  gen1.max.setXY(80, 80);

  var gen2 = new GeneratorBox(0, 10);
  gen2.min.setXY(150, 300);
  gen2.max.setXY(180, 330);
  engine.particleManager.addGenerators([gen1, gen2]);
}

function addEventListeners() {
  canvas.addEventListener('mousedown', handleMouseDown, false);
  canvas.addEventListener('mousemove', handleMouseMove, false);
  canvas.addEventListener('mouseup', handleMouseUp, false);
  canvas.addEventListener('mouseleave', handleMouseLeave, false);
}

function addObstacles() {
  var obs1 = new Circle(new Vector(100, 100), 50);
  var obs2 = new Segment(new Vector(100, 300), new Vector(250, 500));
  engine.obstacleManager.all.push(obs1, obs2);
}

function main() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  engine = new Engine();
  addGenerators(engine);
  addEventListeners();
  addObstacles();
  engine.start();
}


