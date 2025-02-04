import Renderer from '/Quest1/lib/Viz/2DRenderer.js'
import Camera from '/Scroll6/2DCamera.js'
import CameraLineStrip2DVertexObject from '/Scroll6/CameraLineStrip2DVertexObject.js'

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);
  // Create a 2d animated renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();
  var vertices2 = new Float32Array([
     // x, y
     0, -0.6,
     -0.5, -0.1,
     0.5,  -0.1,
     0, -0.6, // loop back to the first vertex
  ]);
  const camera = new Camera();
  const triangle = new CameraLineStrip2DVertexObject(renderer._device, renderer._canvasFormat, camera._pose, vertices2);
  await renderer.appendSceneObject(triangle);
  // run animation at 60 fps
  var frameCnt = 0;
  var tgtFPS = 60;
  var secPerFrame = 1. / tgtFPS;
  var frameInterval = secPerFrame * 1000;
  var lastCalled;
  var movespeed = 0.05;
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
            camera.moveUp(movespeed);
            triangle.updateCameraPose();
            console.log(triangle._cameraPose);
            break;
        case 'ArrowDown': case 's': case 'S':   
            camera.moveDown(movespeed);
            triangle.updateCameraPose();     
            break;
        case 'ArrowLeft': case 'a': case 'A':  
            camera.moveLeft(movespeed);
            triangle.updateCameraPose();
            break;
        case 'ArrowRight': case 'd': case 'D': 
            camera.moveRight(movespeed);
            triangle.updateCameraPose();       
            break;
        case 'q': case 'Q':  
            camera.zoomIn();
            triangle.updateCameraPose();       
            break;
        case 'e': case 'E':
            camera.zoomOut();
            triangle.updateCameraPose();  
            break;
        }
    });
  let renderFrame = () => {
    let elapsed = Date.now() - lastCalled;
    if (elapsed > frameInterval) {
      ++frameCnt;
      lastCalled = Date.now() - (elapsed % frameInterval);
      renderer.render();
    }
    requestAnimationFrame(renderFrame);
  };
  lastCalled = Date.now();
  renderFrame();
  setInterval(() => { 
    console.log(frameCnt);
    frameCnt = 0;
  }, 1000); // call every 1000 ms
  return renderer;
}

init().then( ret => {
  console.log(ret);
}).catch( error => {
  const pTag = document.createElement('p');
  pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
  document.body.appendChild(pTag);
  document.getElementById("renderCanvas").remove();
});