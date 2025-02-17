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

import SceneObject from '/Quest4/lib/DSViz/SceneObject.js'

export default class MassSpringSystemObject extends SceneObject {
  constructor(device, canvasFormat, img, numParticles = 16) {
    super(device, canvasFormat);
    this._size = numParticles;
    this._numParticles = this._size * this._size;
    this._numSprings = [this._size * Math.ceil((this._size - 1) / 2), this._size * Math.floor((this._size - 1) / 2), this._size * Math.ceil((this._size - 1) / 2), this._size * Math.floor((this._size - 1) / 2)];
    this._step = 0;
    this._img = new Image();
    this._img.src = img;
  }
  
  async createGeometry() { 
    // Load img and create image bitmap
    await this._img.decode();
    this._bitmap = await createImageBitmap(this._img);
    // Create texture buffer to store the texture in GPU
    this._texture = this._device.createTexture({
      label: "Texture " + this.getName(),
      size: [this._bitmap.width, this._bitmap.height, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    // Copy from CPU to GPU
    this._device.queue.copyExternalImageToTexture({ source: this._bitmap }, { texture: this._texture }, [ this._bitmap.width, this._bitmap.height]);
    // Create the texture sampler
    this._sampler = this._device.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    });
    await this.createParticleGeometry();
    await this.createSpringGeometry();
  }
  
  async createParticleGeometry() {
    // Create particles
    this._particles = new Float32Array(this._numParticles * 8); // [x, y, vx, vy, dx, dy, m, -]
    // Create vertex+storage buffer to store the particles in GPU
    this._particleBuffers = [
      this._device.createBuffer({
        label: "Particles Buffer 1 " + this.getName(),
        size: this._particles.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      }),
      this._device.createBuffer({
        label: "Particles Buffer 2 " + this.getName(),
        size: this._particles.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })
    ];
    //this._forceUpdateBuffer = this._device.createBuffer({
    //  label: "Force Update " + this.getName(),
    //  size: this._particles[2].byteLength,
    //  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    //}); 
    // Copy from CPU to GPU
    //this._device.queue.writeBuffer(this._forceUpdateBuffer, 0, [0, 0]);
    this.resetParticles();
  }
    
  async createSpringGeometry() {
    // TODO 1: create the strings memory in both CPU and GPU
    // Use _numSprings to determine the size
    // Create a storage buffer in GPU for it
    // Name the CPU array as `_springs`
    this._springs = [new Float32Array(this._numSprings[0] * 4), new Float32Array(this._numSprings[1] * 4), new Float32Array(this._numSprings[2] * 4), new Float32Array(this._numSprings[3] * 4)];
    this._springBuffers = [
      this._device.createBuffer({
      label: "Spring Buffer 1 " + this.getName(),
      size: this._springs[0].byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }),
      this._device.createBuffer({
      label: "Spring Buffer 2 " + this.getName(),
      size: this._springs[1].byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }),
      this._device.createBuffer({
      label: "Spring Buffer 3 " + this.getName(),
      size: this._springs[2].byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    }),
      this._device.createBuffer({
      label: "Spring Buffer 4 " + this.getName(),
      size: this._springs[3].byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    })
  ];
     
    // call the resetSprings to initialize the springs and copy to GPU
    this.resetSprings();
  }
    
  resetParticles() {
    let edgeLength = 0.7;
    let delta = edgeLength / this._size;
    for (let j = 0; j < this._size; ++j) for (let i = 0; i < this._size; ++i) {
      let idx = j * this._size + i;
      this._particles[8 * idx + 0] = -0.25 + delta * i;
      this._particles[8 * idx + 1] = 0.5 - delta * j;
      this._particles[8 * idx + 2] = 0;
      this._particles[8 * idx + 3] = 0;
      this._particles[8 * idx + 4] = 0;
      this._particles[8 * idx + 5] = 0;
      this._particles[8 * idx + 6] = 0.0001 * this._numParticles;
      this._particles[8 * idx + 7] = (j == 0) ? 1 : 0;
    }
    // Copy from CPU to GPU
    this._step = 0;
    this._device.queue.writeBuffer(this._particleBuffers[this._step % 2], 0, this._particles);
  }
  
  resetSprings() {
    let edgeLength = 0.7;
    let delta = edgeLength / this._size;
    let stiffness = 0.5;
    let offset = this._size * (this._size - 1);
    // structral springs - in four groups
    // Group A and C: size * Math.ceil((size - 1) / 2)
    let ysize = Math.ceil((this._size - 1) / 2);
    for (let j = 0; j < this._size; ++j) for (let i = 0; i < ysize; ++i) {
      // ptA, ptB, rest length, stiffness
      let idx = j * ysize + i;
      // horizontal
      this._springs[0][4 * idx + 0] = j * this._size + i * 2 ; 
      this._springs[0][4 * idx + 1] = j * this._size + i * 2 + 1;
      this._springs[0][4 * idx + 2] = delta;
      this._springs[0][4 * idx + 3] = stiffness;
      // vertical
      this._springs[2][4 * idx + 0] = 2 * i * this._size + j; 
      this._springs[2][4 * idx + 1] = (2 * i + 1) * this._size + j;
      this._springs[2][4 * idx + 2] = delta;
      this._springs[2][4 * idx + 3] = stiffness;
    }
    // Group B and D: size * Math.floor((size - 1) / 2)
    ysize = Math.floor((this._size - 1) / 2);
    for (let j = 0; j < this._size; ++j) for (let i = 0; i < ysize; ++i) {
      // ptA, ptB, rest length, stiffness
      let idx = j * ysize + i;
      //  horizontal
      this._springs[1][4 * idx + 0] = j * this._size + i * 2 + 1; 
      this._springs[1][4 * idx + 1] = j * this._size + i * 2 + 2;
      this._springs[1][4 * idx + 2] = delta;
      this._springs[1][4 * idx + 3] = stiffness;
      // vertical
      this._springs[3][4 * idx + 0] = (2 * i + 1)* this._size + j; 
      this._springs[3][4 * idx + 1] = (2 * i + 2) * this._size + j;
      this._springs[3][4 * idx + 2] = delta;
      this._springs[3][4 * idx + 3] = stiffness;
    }
    // Copy from CPU to GPU
    this._step = 0;
    for (let i = 0; i < 4; ++i) {
      this._device.queue.writeBuffer(this._springBuffers[i], 0, this._springs[i]);
    }
  }
  
  updateGeometry() { }
  
  async createShaders() {
    let shaderCode = await this.loadShader("/Quest4/shaders/massspring.wgsl");
    this._shaderModule = this._device.createShaderModule({
      label: "Particles Shader " + this.getName(),
      code: shaderCode,
    });
    // TODO 2: Create the bind group layout for the three storage buffers
    this._bindGroupLayout = this._device.createBindGroupLayout({
      label: "Spring Bind Group Layout " + this.getName(),
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
        buffer: { type: "read-only-storage"} // Particle status input buffer
      }, {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: "storage"} // Particle status output buffer
      }, {
        binding: 2,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
        buffer: { type: "read-only-storage"}
      }, {
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 4,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }, //{
        //binding: 5,
        //visibility: GPUShaderStage.COMPUTE,
        //buffer: { type: "uniform" }
      //}
      ]
    });

    this._pipelineLayout = this._device.createPipelineLayout({
      label: "Particles Pipeline Layout",
      bindGroupLayouts: [ this._bindGroupLayout ],
    });
  }
  
  async createRenderPipeline() { 
    await this.createParticlePipeline();
    await this.createSpringPipeline();
  }
  
  async createParticlePipeline() {
    this._particlePipeline = this._device.createRenderPipeline({
      label: "Particles Render Pipeline " + this.getName(),
      layout: this._pipelineLayout,
      vertex: {
        module: this._shaderModule, 
        entryPoint: "vertexMain",
      },
      fragment: {
        module: this._shaderModule,
        entryPoint: "fragmentMain",
        targets: [{
          format: this._canvasFormat,
          blend: {
            color: {
              operation: 'add',
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha'
            },
            alpha: {
              operation: 'add',
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha'
            }
          }
        }]
      },
      primitives: {
        typology: 'line-strip'
      }
    }); 
    // TODO 3: Create bind group to bind the mass-spring systems
    this._bindGroups = [
      [this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 2,
            resource: { buffer: this._springBuffers[0] }
          },
          {
            binding: 3,
            resource: this._texture.createView(),
          },
          {
            binding: 4,
            resource: this._sampler,
          },
          //{
          //  binding: 5,
          //  resource: { buffer: this._forceUpdateBuffer }
          //}
        ]
      }),
      this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 2,
            resource: { buffer: this._springBuffers[0] }
          },
          {
            binding: 3,
            resource: this._texture.createView(),
          },
          {
            binding: 4,
            resource: this._sampler,
          },
          //{
          //  binding: 5,
          //  resource: { buffer: this._forceUpdateBuffer }
          //}
        ]
      })],
      [this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 2,
            resource: { buffer: this._springBuffers[1] }
          },
          {
            binding: 3,
            resource: this._texture.createView(),
          },
          {
            binding: 4,
            resource: this._sampler,
          },
          //{
          //  binding: 5,
          //  resource: { buffer: this._forceUpdateBuffer }
          //}
        ]
      }),
      this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 2,
            resource: { buffer: this._springBuffers[1] }
          },
          {
            binding: 3,
            resource: this._texture.createView(),
          },
          {
            binding: 4,
            resource: this._sampler,
          },
          //{
          //  binding: 5,
          //  resource: { buffer: this._forceUpdateBuffer }
          //}
        ]
      })],
      [this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 2,
            resource: { buffer: this._springBuffers[2] }
          },
          {
            binding: 3,
            resource: this._texture.createView(),
          },
          {
            binding: 4,
            resource: this._sampler,
          },
          //{
          //  binding: 5,
          //  resource: { buffer: this._forceUpdateBuffer }
          //}
        ]
      }),
      this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 2,
            resource: { buffer: this._springBuffers[2] }
          },
          {
            binding: 3,
            resource: this._texture.createView(),
          },
          {
            binding: 4,
            resource: this._sampler,
          },
          //{
          //  binding: 5,
          //  resource: { buffer: this._forceUpdateBuffer }
          //}
        ]
      })],
      [this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 2,
            resource: { buffer: this._springBuffers[3] }
          },
          {
            binding: 3,
            resource: this._texture.createView(),
          },
          {
            binding: 4,
            resource: this._sampler,
          },
          //{
          //  binding: 5,
          //  resource: { buffer: this._forceUpdateBuffer }
          //}
        ]
      }),
      this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 2,
            resource: { buffer: this._springBuffers[3] }
          },
          {
            binding: 3,
            resource: this._texture.createView(),
          },
          {
            binding: 4,
            resource: this._sampler,
          },
          //{
          //  binding: 5,
          //  resource: { buffer: this._forceUpdateBuffer }
          //}
        ]
      })]
    ];
  }
  
  async createSpringPipeline() {
    this._springPipeline = this._device.createRenderPipeline({
      label: "Spring Render Pipeline " + this.getName(),
      layout: this._pipelineLayout,
      vertex: {
        module: this._shaderModule, 
        entryPoint: "vertexSpringMain",
      },
      fragment: {
        module: this._shaderModule,
        entryPoint: "fragmentSpringMain",
        targets: [{
          format: this._canvasFormat
        }]
      },
      primitives: {
        typology: 'line-list'
      }
    }); 
  }
  
  render(pass) { 
    pass.setPipeline(this._springPipeline);
    for (let i = 0; i < 4; ++i) if (this._numSprings[i]) {
      pass.setBindGroup(0, this._bindGroups[i][this._step % 2]);
      pass.draw(12, this._numSprings[i]);
    }
    pass.setPipeline(this._particlePipeline); 
    pass.setBindGroup(0, this._bindGroups[0][this._step % 2]);
    pass.draw(128, this._numParticles);
  }
  
  async createComputePipeline() { 
    this._computePipeline = this._device.createComputePipeline({
      label: "Particles Compute Pipeline " + this.getName(),
      layout: this._pipelineLayout,
      compute: {
        module: this._shaderModule,
        entryPoint: "computeMain",
      }
    });
    this._updatePipeline = this._device.createComputePipeline({
      label: "Particles Update Pipeline " + this.getName(),
      layout: this._pipelineLayout,
      compute: {
        module: this._shaderModule,
        entryPoint: "updateMain",
      }
    });
  }
  
  compute(pass) { 
    for (let i = 0; i < 4; ++i) if (this._numSprings[i]) {
      pass.setPipeline(this._computePipeline);
      pass.setBindGroup(0, this._bindGroups[i][this._step % 2]);
      pass.dispatchWorkgroups(Math.ceil(this._numSprings[i] / 256));
    }
    pass.setPipeline(this._updatePipeline);
    pass.setBindGroup(0, this._bindGroups[0][this._step % 2]);
    pass.dispatchWorkgroups(Math.ceil(this._numParticles / 256));
    ++this._step;
  }

  updateForces(x, y) {
    this._device.queue.writeBuffer(this._forceUpdateBuffer, 0, [x, y]);
  }

  forceUp(f) {
    this.updateForces([0, f]);
  }

  forceDown() {

  }

  forceLeft() {

  }

  forceRight() {

  }
}
