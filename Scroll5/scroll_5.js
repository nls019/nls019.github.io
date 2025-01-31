import FilteredRenderer from '/Scroll3/FilterRenderer.js'
import Standard2DGAPosedVertexObject from '/Scroll4/Standard2DGAPosedVertexObject.js'
import Standard2DPGAPosedVertexColorObject from '/Scroll4/Standard2DPGAPosedVertexColorObject.js'

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);
  // Create a 2d renderer
  const renderer = new FilteredRenderer(canvasTag);
  await renderer.init();
  // Create a triangle geometry
  var vertices = new Float32Array([
    // x, y,
    0, 0.25, 
    -0.25, 0,
    0.25,  0,
  ]);
  let pose0 = normalizeMotor([1, 0, -0.2, -0.25]);
  let pose1 = normalizeMotor([0, 1, -0.25, 0.4]);
  var pose = [pose0[0], pose0[1], pose0[2], pose0[3], 1, 1];
  pose = new Float32Array(pose);
  await renderer.appendSceneObject(new Standard2DPGAPosedVertexObject(renderer._device, renderer._canvasFormat, vertices, pose));

  let interval = 100;
  var t = 0;
  let easeineaseout = (t) => {
    if (t > 0.5) return t * (4 - 2 * t) -1;
    else return 2 * t * t;
  }
  let step = 1;
  setInterval(() => { 
    renderer.render();
    // linearly interpolate the motor
    let _t = easeineaseout(t / interval);
    pose[0] = pose0[0] * (1 - _t) + pose1[0] * _t;
    pose[1] = pose0[1] * (1 - _t) + pose1[1] * _t;
    pose[2] = pose0[2] * (1 - _t) + pose1[2] * _t;
    pose[3] = pose0[3] * (1 - _t) + pose1[3] * _t;
    t += step;
    if (t >= 100) {
      step = -1;
    }
    else if (t <= 0) {
    step = 1; 
    }
  }, interval); // call every 100 ms
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