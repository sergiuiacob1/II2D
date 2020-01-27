function handleMouseDown(event) {
    var mouseX = event.offsetX;
    var mouseY = event.offsetY;
    var mouse = new Vector(mouseX, mouseY);
    engine.particleManager.select(mouse);
    engine.obstacleManager.select(mouse);
    if (engine.obstacleManager.selected != null){
        engine.obstacleManager.selected.color = "green";
        engine.particleManager.selected = null;
    }
    mouseIsPressed = true;
}

function handleMouseUp(event) {
    mouseIsPressed = false;
    if (engine.obstacleManager.selected != null) {
        engine.obstacleManager.selected.color = "red";
        engine.obstacleManager.selected = null;
    }
}

function handleMouseMove(event) {
    if (mouseIsPressed == false)
        return;
    var mouseX = event.movementX;
    var mouseY = event.movementY;
    var mouse = new Vector(mouseX, mouseY);
    if (engine.particleManager.selected != null)
        engine.particleManager.selected.move(mouse);
    if (engine.obstacleManager.selected != null)
        engine.obstacleManager.selected.move(mouse);
}

function handleMouseLeave(event) {
    mouseIsPressed = false;
    if (engine.obstacleManager.selected != null)
        engine.obstacleManager.selected.color = "red";
}