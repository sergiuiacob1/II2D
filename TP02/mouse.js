function handleMouseDown(event) {
    var mouseX = event.offsetX;
    var mouseY = event.offsetY;
    var mouse = new Vector(mouseX, mouseY);
    engine.particleManager.select(mouse);
    engine.obstacleManager.select(mouse);
    mouseIsPressed = true;
}

function handleMouseUp(event) {
    mouseIsPressed = false;
}

function handleMouseMove(event) {
    if (engine.particleManager.selected == null || mouseIsPressed == false)
        return;
    var mouseX = event.movementX;
    var mouseY = event.movementY;
    var mouse = new Vector(mouseX, mouseY);
    engine.particleManager.selected.move(mouse);
    engine.objectManager.selected.move(mouse);
}
