/*!
 * Copyright (c) 2025 SingChun LEE @ Bucknell University. CC BY-NC 4.0.
 * 
 * This code is provided mainly for educational purposes at Bucknell University.
 *
 * This code is licensed under the Creative Commons Attribution-NonCommerical 4.0
 * International License. To view a copy of the license, visit 
 *   https://creativecommons.org/licenses/by-nc/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 *  - Share: copy and redistribute the material in any medium or format.
 *  - Adapt: remix, transform, and build upon the material.
 *
 * Under the following terms:
 *  - Attribution: You must give appropriate credit, provide a link to the license,
 *                 and indicate if changes where made.
 *  - NonCommerical: You may not use the material for commerical purposes.
 *  - No additional restrictions: You may not apply legal terms or technological 
 *                                measures that legally restrict others from doing
 *                                anything the license permits.
 */

// Check your browser supports: https://github.com/gpuweb/gpuweb/wiki/Implementation-Status#implementation-status
// Need to enable experimental flags chrome://flags/
// Chrome & Edge 113+ : Enable Vulkan, Default ANGLE Vulkan, Vulkan from ANGLE, Unsafe WebGPU Support, and WebGPU Developer Features (if exsits)
// Firefox Nightly: sudo snap install firefox --channel=latext/edge or download from https://www.mozilla.org/en-US/firefox/channel/desktop/

import RayTracer from '/Quest6/lib/Viz/RayTracer.js'
import StandardTextObject from '/Quest6/lib/DSViz/StandardTextObject.js'
import RayTracingBoxObject from '/Quest6/lib/DSViz/RayTracingBoxObject.js'
import Camera from '/Quest6/lib/Viz/3DCamera.js'

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);
  // Create a ray tracer
  const tracer = new RayTracer(canvasTag);
  await tracer.init();
  // Create a 3D Camera
  var camera = new Camera();
  // Create an object to trace
  var tracerObj = new RayTracingBoxObject(tracer._device, tracer._canvasFormat, camera);
  await tracer.setTracerObject(tracerObj);
  
  //let fps = '??';
  //var fpsText = new StandardTextObject('fps: ' + fps);

  var helpText = new StandardTextObject('W: Move +Y\nS: Move -Y\nD: Move +X\nA: Move -X\nE: Move +Z\nQ: Move -Z\nT: Rotate +Y\nG: Rotate -Y\nH: Rotate +X\nF: Rotate -X\nY: Rotate +Z\nR: Rotate -Z');
  
  var movespeed = 0.05;
  var moveangle = Math.PI / 128;
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 'w': case 'W':
        camera.moveY(-movespeed);
        tracerObj.updateCameraPose();
        tracerObj.updateBoxPose();
        break;
      case 's': case 'S':   
        camera.moveY(movespeed);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 'a': case 'A':  
        camera.moveX(-movespeed);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 'd': case 'D': 
        camera.moveX(movespeed);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 'q': case 'Q':
        camera.moveZ(-movespeed);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();  
        break;
      case 'e': case 'E':
        camera.moveZ(movespeed);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 't': case 'T': 
        camera.rotateY(moveangle);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 'g': case 'G':
        camera.rotateY(-moveangle);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 'f': case 'F':
        camera.rotateX(-moveangle);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 'h': case 'H':
        camera.rotateX(moveangle);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 'r': case 'R':
        camera.rotateZ(-moveangle);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
      case 'y': case 'Y':
        camera.rotateZ(moveangle);
        tracerObj.updateBoxPose();
        tracerObj.updateCameraPose();
        break;
    }
  });


  // run animation at 60 fps
  var frameCnt = 0;
  var tgtFPS = 60;
  var secPerFrame = 1. / tgtFPS;
  var frameInterval = secPerFrame * 1000;
  var lastCalled;
  let renderFrame = () => {
    let elapsed = Date.now() - lastCalled;
    if (elapsed > frameInterval) {
      ++frameCnt;
      lastCalled = Date.now() - (elapsed % frameInterval);
      tracer.render();
    }
    requestAnimationFrame(renderFrame);
  };
  lastCalled = Date.now();
  renderFrame();
  //setInterval(() => { 
    //fpsText.updateText('fps: ' + frameCnt);
    //frameCnt = 0;
  //}, 1000); // call every 1000 ms
  return tracer;
}

init().then( ret => {
  console.log(ret);
}).catch( error => {
  const pTag = document.createElement('p');
  pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
  document.body.appendChild(pTag);
  document.getElementById("renderCanvas").remove();
});