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

import Renderer from '/Quest5/lib/Viz/2DRenderer.js'
import PolygonObject from '/Quest5/lib/DSViz/PolygonObject.js'
import StandardTextObject from '/Quest5/lib/DSViz/StandardTextObject.js'
import TwoDGridSegmented from '/Quest5/lib/DS/TwoDGridSegmented.js';

async function changePolygon(renderer, polygons, curShape, grids) {
  renderer._objects = [];
  await renderer.appendSceneObject(polygons[curShape]);
  console.log(polygons[curShape]._polygon);
  grids[curShape] = new TwoDGridSegmented(polygons[curShape]._polygon, 4);
}

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);
  // Create a 2d animated renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();
  var curShape = 0;
  const polygon = [new PolygonObject(renderer._device, renderer._canvasFormat, '/Quest5/assets/box.polygon'), new PolygonObject(renderer._device, renderer._canvasFormat, '/Quest5/assets/circle.polygon'),
    new PolygonObject(renderer._device, renderer._canvasFormat, '/Quest5/assets/star.polygon'), new PolygonObject(renderer._device, renderer._canvasFormat, '/Quest5/assets/human.polygon')];
  var grids = [];
  var inOut = "Unknown";
  changePolygon(renderer, polygon, curShape, grids);
  let fps = '??';
  var fpsText = new StandardTextObject('S: change shape' + 'Status: ' + inOut);

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 's':
        if (curShape < 3) {
          curShape++;
        }
        else {
          curShape = 0;
        }
        changePolygon(renderer, polygon, curShape, grids);
        break;
      }
  });
  // mouse interactions
    canvasTag.addEventListener('mousemove', (e) => {
      var mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      var mouseY = (-e.clientY / window.innerHeight) * 2 + 1;
      let p = [mouseX, mouseY];
      if (curShape == 0 || curShape == 1) {
        for (var i = 0; i < polygon[curShape]._polygon._polygon.length - 1; ++i) {
          if (!polygon[curShape]._polygon.isInside(polygon[curShape]._polygon._polygon[i], polygon[curShape]._polygon._polygon[i+1], p)) {
            console.log("outside");
            if (inOut != "Outside") {
              inOut = "Outside";
            }
            break;
          }
          else if (i == polygon[curShape]._polygon._polygon.length - 2) {
            console.log("inside");
            if (inOut != "Inside") {
              inOut = "Inside";
            }
          }
        }
      }
      else {
        if (grids[curShape].isInsideWindingNumber(p)) {
          console.log("inside");
          if (inOut != "Inside") {
            inOut = "Inside";
          }
        }
        else {
          console.log("outside");
          if (inOut != "Outside") {
            inOut = "Outside";
          }
        }
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
      renderer.render();
    }
    requestAnimationFrame(renderFrame);
  };
  lastCalled = Date.now();
  renderFrame();
  setInterval(() => { 
    fpsText.updateText('S: change shape' + 'Status: ' + inOut);
  }, 100); // call every 100s ms
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