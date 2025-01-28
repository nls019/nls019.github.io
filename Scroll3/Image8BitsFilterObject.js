import ImageFilterObject from "/Scroll3/ImageFilterObject.js"

export default class Image8BitsFilterObject extends ImageFilterObject {
  async createShaders() {
    let shaderCode = await this.loadShader("/Scroll3/shaders/8bit.wgsl");
    this._shaderModule = this._device.createShaderModule({
      label: " Shader " + this.getName(),
      code: shaderCode,
    }); 
  }
}