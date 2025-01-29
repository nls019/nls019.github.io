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
    // x, y, (r, g, b, a)
    0, 0.5, 1, 0, 0, 1,
    -0.5, 0, 0, 1, 0, 1,
    0.5,  0, 0, 0, 1, 1,
  ]);
  let applyRotorToRotor = (dr, r) => {
    // r = cS + s exey
    // dr = ccS + ss exey
    // dr r = (c * cc - s * ss)S + (cc * s + ss * s) e01
    return [dr[0] * r[0] - dr[1] * r[1], dr[0] * r[1] + dr[1] * r[0]];
  };
  var pose = [1, 0, 0, 0, 1, 1]; // rotor, translator, scales
  pose = new Float32Array(pose);
  await renderer.appendSceneObject(new Standard2DPGAPosedVertexColorObject(renderer._device, renderer._canvasFormat, vertices, pose));

  // algebra functions
  let geometricProduct = (a, b) => {
    // ref: https://geometricalgebratutorial.com/pga/
    // eoo = 0, e00 = 1 e11 = 1
    // s + e01 + eo0 + eo1
    // ss   = s   , se01   = e01  , seo0            = eo0  , seo1          = eo1
    // e01s = e01 , e01e01 = -s   , e01eo0 = e10e0o = -eo1 , e01eo1 = -e0o = eo0
    // eo0s = eo0 , eo0e01 = eo1  , eo0eo0          = 0    , eo0eo1        = 0
    // e01s = e01 , eo1e01 = -eo0 , eo1eo0          = 0    , eo1eo1        = 0
    return [
      a[0] * b[0] - a[1] * b[1] , // scalar
      a[0] * b[1] + a[1] * b[0] , // e01
      a[0] * b[2] + a[1] * b[3] + a[2] * b[0] - a[3] * b[1], // eo0
      a[0] * b[3] - a[1] * b[2] + a[2] * b[1] + a[3] * b[0]  // eo1
    ];
  };
  let reverse = (a) => {
    return [ a[0], -a[1], -a[2], -a[3] ];
  };
  let motorNorm =  (m) => {
    return Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2] + m[3] * m[3]);
  };
  let normaliozeMotor = (m) => {
    let mnorm = motorNorm(m);
    if (mnorm == 0.0) {
      return [1, 0, 0, 0];
    }
    return [m[0] / mnorm, m[1] / mnorm, m[2] / mnorm, m[3] / mnorm];
  };

  // delta motor
  let angle = Math.PI / 100;
  // rotate about p
  let center = [0, 0];
  let dr = normaliozeMotor([Math.cos(angle / 2), -Math.sin(angle / 2), -center[0] * Math.sin(angle / 2), -center[1] * Math.sin(angle / 2)]);
  let dt = normaliozeMotor([1, 0, 0.01 / 2, 0 / 2]);
  let dm = normaliozeMotor(geometricProduct(dt, dr));

  // animate
  setInterval(() => { 
    renderer.render();
    // update pose
    let newmotor = normaliozeMotor(geometricProduct(dm, [pose[0], pose[1], pose[2], pose[3]]));
    pose[0] = newmotor[0];
    pose[1] = newmotor[1];
    pose[2] = newmotor[2];
    pose[3] = newmotor[3];
  }, 30); // call every 30 ms
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