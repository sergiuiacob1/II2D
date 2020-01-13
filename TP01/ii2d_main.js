var canvas;
var ctx; // !!! context 2D (drawing)

var engine;


window.addEventListener("load", main);

function addGenerators(engine) {
  var gen1 = new GeneratorBox(0, 200);
  gen1.min.setXY(50, 50); // setXY à faire dans la classe Vector
  gen1.max.setXY(100, 200);

  var gen2 = new GeneratorBox(0, 100);
  gen2.min.setXY(150, 300);
  gen2.max.setXY(200, 450);
  engine.particleManager.generatorList.push(gen1, gen2); // ajoute au tableau generatorList
}

function main() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  engine = new Engine();
  addGenerators(engine);
  engine.start();
}


