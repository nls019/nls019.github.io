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

import FilteredRenderer from '/Quest2/lib/Viz/2DFilteredRenderer.js'
import Standard2DFullScreenObject from '/Quest2/lib/DSViz/Standard2DFullScreenObject.js'
import Standard2DPGAPosedVertexColorObject from '/Quest2/lib/DSViz/Standard2DPGAPosedVertexColorObject.js'
import LineStrip2DVertexObject from '/Quest2/lib/DSViz/LineStrip2DVertexObject.js'
import SpaceshipObject from '/Quest2/lib/DSViz/spaceship.js'
import PGA2D from '/Quest2/lib/Math/PGA2D.js'
import ImageGrayscaleFilterObject from '/Quest2/lib/DSViz/ImageGrayscaleFilterObject.js'

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);
  // Create a 2d animated renderer
  const renderer = new FilteredRenderer(canvasTag);
  await renderer.init();
  // Create a background
  await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "/Quest2/assets/stardust.jpg"));

  // orbits
  createLineObject(renderer, 0, 0, 0.2, 100);
  createLineObject(renderer, 0, 0, 0.3, 100);
  createLineObject(renderer, 0, 0, 0.4, 100);
  createLineObject(renderer, 0, 0, 0.475, 100);
  createLineObject(renderer, 0, 0, 0.625, 100);
  createLineObject(renderer, 0, 0, 0.75, 100);
  createLineObject(renderer, 0, 0, 0.85, 100);
  createLineObject(renderer, 0, 0, 0.95, 100);

  // sun + planets
  var sunPose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, 0, 0, 0.1, 1, 132./255, 0, 1, 30, sunPose);

  var onePose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.2, 0, 0.02, 110./255, 110./255, 110./255, 1, 30, onePose);

  var twoPose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.3, 0, 0.04, 1, 120./255, 235./255, 1, 30, twoPose);

  var threePose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.4, 0, 0.03, 0, 0, 1, 1, 30, threePose);

  var moonPose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.44, 0, 0.005, 1, 1, 1, 1, 30, moonPose)
  let moonTheta = 0;

  var fourPose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.475, 0, 0.02, 1, 0, 0, 1, 30, fourPose);

  var fivePose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.625, 0, 0.05, 1, 1, 0, 1, 30, fivePose);

  var sixPose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.75, 0, 0.02, 0, 0, 0, 1, 30, sixPose);

  var sevenPose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.85, 0, 0.03, 1, 1, 1, 1, 30, sevenPose);

  var eightPose = new Float32Array([1, 0, 0, 0, 1, 1]);
  createShapeObject(renderer, -0.95, 0, 0.01, 0, 1, 1, 1, 30, eightPose);

  // Add a spaceship to the scene - slingshots around the sun!
  await renderer.appendSceneObject(new SpaceshipObject(renderer._device, renderer._canvasFormat, new Float32Array([1, 0, 0, 0, 0.25, 0.25])));

  // run at every 100 ms
  let angle = Math.PI / 12;
  // use a rotor to rotate about an object around a center
  let center = [0, 0]; // set the center to (0, 0) - feel free to change it and see different results
  
  let oneM = PGA2D.normalizeMotor(PGA2D.createRotor(angle, center[0], center[1]));
  let twoM = PGA2D.normalizeMotor(PGA2D.createRotor(Math.PI / 30.5, center[0], center[1]));
  let threeM = PGA2D.normalizeMotor(PGA2D.createRotor(Math.PI / 50, center[0], center[1]));
  let moonM = PGA2D.normalizeMotor(PGA2D.createRotor(Math.PI / 50, center[0], center[1]));
  let fourM = PGA2D.normalizeMotor(PGA2D.createRotor(Math.PI / 94, center[0], center[1]));
  let fiveM = PGA2D.normalizeMotor(PGA2D.createRotor(Math.PI / 595, center[0], center[1]));
  let sixM = PGA2D.normalizeMotor(PGA2D.createRotor(Math.PI / 1470, center[0], center[1]));
  let sevenM = PGA2D.normalizeMotor(PGA2D.createRotor(Math.PI / 4185, center[0], center[1]));
  let eightM = PGA2D.normalizeMotor(PGA2D.createRotor(Math.PI / 8185, center[0], center[1]));

  // add grayscale filter and blur
  await renderer.appendFilterObject(new ImageGrayscaleFilterObject(renderer._device, renderer._canvasFormat));

  setInterval(() => { 
    renderer.render();
    // update the first planet pose by multiplying the delta motor to the current pose
    let newmotor1 = PGA2D.normalizeMotor(PGA2D.geometricProduct(oneM, [onePose[0], onePose[1], onePose[2], onePose[3]]));
    onePose[0] = newmotor1[0];
    onePose[1] = newmotor1[1];
    onePose[2] = newmotor1[2];
    onePose[3] = newmotor1[3];

    // update the second planet pose by multiplying the delta motor to the current pose
    let newmotor2 = PGA2D.normalizeMotor(PGA2D.geometricProduct(twoM, [twoPose[0], twoPose[1], twoPose[2], twoPose[3]]));
    twoPose[0] = newmotor2[0];
    twoPose[1] = newmotor2[1];
    twoPose[2] = newmotor2[2];
    twoPose[3] = newmotor2[3];

    // update the third planet pose by multiplying the delta motor to the current pose
    let newmotor3 = PGA2D.normalizeMotor(PGA2D.geometricProduct(threeM, [threePose[0], threePose[1], threePose[2], threePose[3]]));
    threePose[0] = newmotor3[0];
    threePose[1] = newmotor3[1];
    threePose[2] = newmotor3[2];
    threePose[3] = newmotor3[3];

    // update the moon rotation pose by multiplying the delta motor to the current pose
    let newmotorM = PGA2D.normalizeMotor(PGA2D.geometricProduct(moonM, [moonPose[0], moonPose[1], moonPose[2], moonPose[3]]));
    moonPose[0] = newmotorM[0];
    moonPose[1] = newmotorM[1];
    moonPose[2] = newmotorM[2];
    moonPose[3] = newmotorM[3];
    let new_moonTheta = moonTheta + Math.PI / 20;
    let dx = (Math.cos(new_moonTheta) - Math.cos(moonTheta))/(100./7);
    let dy = (Math.sin(new_moonTheta) - Math.sin(moonTheta))/(100./7);
    let dt = PGA2D.createTranslator(-dx, -dy);
    let newmotorM2 = PGA2D.normalizeMotor(PGA2D.geometricProduct(dt, moonPose));
    moonPose[0] = newmotorM2[0];
    moonPose[1] = newmotorM2[1];
    moonPose[2] = newmotorM2[2];
    moonPose[3] = newmotorM2[3];
    moonTheta = new_moonTheta;

    // update the fourth planet pose by multiplying the delta motor to the current pose
    let newmotor4 = PGA2D.normalizeMotor(PGA2D.geometricProduct(fourM, [fourPose[0], fourPose[1], fourPose[2], fourPose[3]]));
    fourPose[0] = newmotor4[0];
    fourPose[1] = newmotor4[1];
    fourPose[2] = newmotor4[2];
    fourPose[3] = newmotor4[3];

    // update the fifth planet pose by multiplying the delta motor to the current pose
    let newmotor5 = PGA2D.normalizeMotor(PGA2D.geometricProduct(fiveM, [fivePose[0], fivePose[1], fivePose[2], fivePose[3]]));
    fivePose[0] = newmotor5[0];
    fivePose[1] = newmotor5[1];
    fivePose[2] = newmotor5[2];
    fivePose[3] = newmotor5[3];

    // update the sixth planet pose by multiplying the delta motor to the current pose
    let newmotor6 = PGA2D.normalizeMotor(PGA2D.geometricProduct(sixM, [sixPose[0], sixPose[1], sixPose[2], sixPose[3]]));
    sixPose[0] = newmotor6[0];
    sixPose[1] = newmotor6[1];
    sixPose[2] = newmotor6[2];
    sixPose[3] = newmotor6[3];

    // update the seventh planet pose by multiplying the delta motor to the current pose
    let newmotor7 = PGA2D.normalizeMotor(PGA2D.geometricProduct(sevenM, [sevenPose[0], sevenPose[1], sevenPose[2], sevenPose[3]]));
    sevenPose[0] = newmotor7[0];
    sevenPose[1] = newmotor7[1];
    sevenPose[2] = newmotor7[2];
    sevenPose[3] = newmotor7[3];

    // update the eighth planet pose by multiplying the delta motor to the current pose
    let newmotor8 = PGA2D.normalizeMotor(PGA2D.geometricProduct(eightM, [eightPose[0], eightPose[1], eightPose[2], eightPose[3]]));
    eightPose[0] = newmotor8[0];
    eightPose[1] = newmotor8[1];
    eightPose[2] = newmotor8[2];
    eightPose[3] = newmotor8[3];
  }, 100); // call every 100 ms
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

async function createShapeObject(
  renderer,
  x,
  y,
  scale,
  r,
  g,
  b,
  a,
  segments,
  pose
) {
  const vertices = [];

  segments = Math.max(3, segments);

  for (let i = 0; i < segments; ++i) {
    let angle = (i * 2 * Math.PI) / segments;
    let nextAngle = ((i + 1) * 2 * Math.PI) / segments;

    let x1 = x + Math.cos(angle) * scale;
    let y1 = y + Math.sin(angle) * scale;

    let x2 = x + Math.cos(nextAngle) * scale;
    let y2 = y + Math.sin(nextAngle) * scale;

    // prettier-ignore
    vertices.push(
      x, y, r, g, b, a,
      x1, y1, r, g, b, a,
      x2, y2, r, g, b, a,
    );
  }

  const verticesArray = new Float32Array(vertices);

  await renderer.appendSceneObject(
    new Standard2DPGAPosedVertexColorObject(
      renderer._device,
      renderer._canvasFormat,
      verticesArray,
      pose
    )
  );
}

async function createLineObject(
  renderer,
  x,
  y,
  scale,
  segments
) {
  const vertices = [];

  segments = Math.max(3, segments);

  for (let i = 0; i < segments; ++i) {
    let angle = (i * 2 * Math.PI) / segments;
    let nextAngle = ((i + 1) * 2 * Math.PI) / segments;

    let x1 = x + Math.cos(angle) * scale;
    let y1 = y + Math.sin(angle) * scale;

    let x2 = x + Math.cos(nextAngle) * scale;
    let y2 = y + Math.sin(nextAngle) * scale;

    let x3 = x;
    let y3 = y;

    // prettier-ignore
    vertices.push(
      x1, y1,
      x2, y2,
    );
  }

  const verticesArray = new Float32Array(vertices);

  await renderer.appendSceneObject(
    new LineStrip2DVertexObject(
      renderer._device,
      renderer._canvasFormat,
      verticesArray
    )
  );
}