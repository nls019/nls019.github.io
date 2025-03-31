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

import RayTracer from '/Quest9/lib/Viz/RayTracer.js'
import StandardTextObject from '/Quest9/lib/DSViz/StandardTextObject.js'
import RayTracingBoxLightObject from '/Quest9/lib/DSViz/RayTracingBoxLightObject.js'
import Camera from '/Quest9/lib/Viz/3DCamera.js'
import PointLight from '/Quest9/lib/Viz/PointLight.js'
import DirectionalLight from '/Quest9/lib/Viz/DirectionalLight.js'
import SpotLight from '/Quest9/lib/Viz/SpotLight.js'

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
  // set a fixed pose for the starter code demo
  camera._pose[2] = 0.5;
  camera._pose[3] = 0.5;
  // Create an object to trace
  var tracerObj = new RayTracingBoxLightObject(tracer._device, tracer._canvasFormat, camera);
  await tracer.setTracerObject(tracerObj);
  // Create a light object and set it to our box light object
  // if you want to change light, you just need to change this object and upload it to the GPU by calling traceObje.updateLight(light)
  var lights = [new PointLight(), new DirectionalLight(), new SpotLight()];
  var curLight = 0;
  var lightText = "Point";
  var curShading = 0;
  var shadingText = "Lambertian";
  var curShadows = 0;
  var shadowText = "   Hard shadow   ";
  tracerObj.updateLight(lights[curLight]);
  let fps = '??';
  var fpsText = new StandardTextObject('fps: ' + fps + '\nL: Change light (' + lightText + ')\nS: Change shading (' + shadingText + ')\nH: Change shadows (' + shadowText + ')');
  
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 'l': case 'L':
        if (curLight < 2) {
          curLight++;
        }
        else {
          curLight = 0;
        }
        if (curLight == 0) {
          lightText = "Point";
          lights[curLight] = new PointLight([1, 1, 1], [0, 0, 0], [1, 0.1, 0.01], curShading, curShadows);
        }
        else if (curLight == 1) {
          lightText = "Directional";
          lights[curLight] = new DirectionalLight([1, 1, 1], [Math.sqrt(3), Math.sqrt(3), Math.sqrt(3)], curShading, curShadows);
        }
        else {
          lightText = "Spot";
          lights[curLight] = new SpotLight([1, 1, 1], [0, 0, 0], [0, 1, 0], [1, 0.1, 0.01], 0.785, curShading, curShadows);
        }
        tracerObj.updateLight(lights[curLight]);
        break;
      case 's': case 'S':   
        if (curShading < 2) {
          curShading++;
          if (curShading == 1) {
            shadingText = "Phong";
          }
          else {
            shadingText = "Tone";
          }
        }
        else {
          curShading = 0;
          shadingText = "Lambertian";
        }

        if (curLight == 0) {
          lights[curLight] = new PointLight([1, 1, 1], [0, 0, 0], [1, 0.1, 0.01], curShading, curShadows);
        }
        else if (curLight == 1) {
          lights[curLight] = new DirectionalLight([1, 1, 1], [Math.sqrt(3), Math.sqrt(3), Math.sqrt(3)], curShading, curShadows);
        }
        else {
          lights[curLight] = new SpotLight([1, 1, 1], [0, 0, 0], [0, 1, 0], [1, 0.1, 0.01], 0.785, curShading, curShadows);
        }
        tracerObj.updateLight(lights[curLight]);
        break;
      case 'h': case 'H':
        if (curShadows < 3) {
          curShadows++;
          if (curShadows == 1) {
            shadowText = "Light Sampling";
          }
          else if (curShadows == 2) {
            shadowText = "PCF";
          }
          else {
            shadowText = "Distance-based";
          }
        }
        else {
          curShadows = 0;
          shadowText = "Hard";
        }

        if (curLight == 0) {
          lights[curLight] = new PointLight([1, 1, 1], [0, 0, 0], [1, 0.1, 0.01], curShading, curShadows);
        }
        else if (curLight == 1) {
          lights[curLight] = new DirectionalLight([1, 1, 1], [Math.sqrt(3), Math.sqrt(3), Math.sqrt(3)], curShading, curShadows);
        }
        else {
          lights[curLight] = new SpotLight([1, 1, 1], [0, 0, 0], [0, 1, 0], [1, 0.1, 0.01], 0.785, curShading, curShadows);
        }
        tracerObj.updateLight(lights[curLight]);
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
  setInterval(() => { 
    fpsText.updateText('fps: ' + frameCnt + '\nL: Change light (' + lightText + ')\nS: Change shading (' + shadingText + ')\nH: Change shadows (' + shadowText + ')');
    frameCnt = 0;
  }, 1000); // call every 1000 ms
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
