import LineStrip2DVertexObject from '/Scroll3/LineStrip2DVertexObject.js';
import FilteredRenderer from '/Scroll3/FilterRenderer.js'
import Standard2DVertexColorObject from '/Scroll3/Standard2DVertexColorObject.js'
import Standard2DFullScreenObject from '/Scroll3/Standard2DFullScreenObject.js'
import Image8BitsFilterObject from '/Scroll3/Image8BitsFilterObject.js'
import ImageNoisifyFilterObject from '/Scroll3/ImageNoisifyFilterObject.js';

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
  await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "/Scroll3/assets/bucknell.jpg"));
  await renderer.appendSceneObject(new Standard2DVertexColorObject(renderer._device, renderer._canvasFormat, vertices));
  await renderer.appendFilterObject(new ImageNoisifyFilterObject(renderer._device, renderer._canvasFormat, canvasTag));
  //await renderer.appendFilterObject(new Image8BitsFilterObject(renderer._device, renderer._canvasFormat, canvasTag));
  renderer.render();
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