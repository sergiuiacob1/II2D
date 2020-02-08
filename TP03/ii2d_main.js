var canvas;
var ctx; // !!! context 2D (drawing)
var engine;

var mouseIsPressed = false;

CANVAS_WIDTH = 800;
CANVAS_HEIGHT = 600;


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

function init() {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}


function toggleRepulsor(element) {
  engine.toggleRepulseur();
}

function addRandomCircle() {
  var obs = new Circle(new Vector(randInt(0, CANVAS_WIDTH - 50), randInt(0, CANVAS_HEIGHT - 50)), randInt(50, 100));
  engine.obstacleManager.all.push(obs);
}

function addRandomSegment() {
  let x1 = randInt(0, CANVAS_WIDTH - 50);
  let x2 = randInt(0, CANVAS_WIDTH - 50);
  let y1 = randInt(0, CANVAS_HEIGHT - 50);
  let y2 = randInt(0, CANVAS_HEIGHT - 50);
  var obs = new Segment(new Vector(x1, y1), new Vector(x2, y2));
  engine.obstacleManager.all.push(obs);
}

function addRandomGenerator() {
  engine.particleManager.shouldAddRandomGenerator = true;
}

function main() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  init();

  engine = new Engine();
  addGenerators(engine);
  addEventListeners();
  addObstacles();
  engine.start();
}


