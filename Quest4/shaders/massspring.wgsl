/* 
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

struct Particle {
  p: vec2f,   // the particle position
  v: vec2f,   // the particle velocity
  dv: vec2f,  // the velocity update
  m: f32,     // the partilce mass
  dummy: f32, // a dummy value for memory alignment
};

struct Spring {
  pts: vec2f, // the indices of two connected partilces
  l: f32,     // the original spring length
  s: f32      // the stiffness coefficient
};

struct VertexOutput {
  @builtin(position) pos: vec4f,
  @location(0) texCoords: vec2f
};

// TODO 4: bind the storage buffer variables
@group(0) @binding(0) var<storage> particlesIn: array<Particle>;
@group(0) @binding(1) var<storage, read_write> particlesOut: array<Particle>;
@group(0) @binding(2) var<storage> springsIn: array<Spring>;
@group(0) @binding(3) var inTexture: texture_2d<f32>;
@group(0) @binding(4) var inSampler: sampler;
//@group(0) @binding(5) var<uniform> forceUpdates: vec2f;


@vertex
fn vertexMain(@builtin(instance_index) idx: u32, @builtin(vertex_index) vIdx: u32) -> VertexOutput {
  // draw circles to represent a particle
  let particle = particlesIn[idx];
  let r = particle.m;
  var pos = array<vec2f, 6>(
    vec2f(particle.p[0] - r, particle.p[1] - r), vec2f(particle.p[0] + r, particle.p[1] - r), vec2f(particle.p[0] - r, particle.p[1] + r),
    vec2f(particle.p[0] + r, particle.p[1] - r), vec2f(particle.p[0] + r, particle.p[1] + r), vec2f(particle.p[0] - r, particle.p[1] + r)
  );
  var texCoords = array<vec2f, 6>(
    vec2f(0, 1), vec2f(1, 1), vec2f(0, 0),
    vec2f(1, 1), vec2f(1, 0), vec2f(0, 0)
  );
  var out: VertexOutput;
  out.pos = vec4f(pos[vIdx], 0, 1);
  out.texCoords = texCoords[vIdx];
  return out;
}

@fragment
fn fragmentMain(@location(0) texCoords: vec2f) -> @location(0) vec4f {
  return textureSample(inTexture, inSampler, texCoords);
}

@vertex
fn vertexSpringMain(@builtin(instance_index) idx: u32, @builtin(vertex_index) vIdx: u32) -> @builtin(position) vec4f {
  //draw lines to present a spring - here is an ugly hack using an offset, which does not visualize nicely...
  // for better apperance, use texture mapping, by now, you should know how to use vertex_index/instance_index to draw the shapes you like in the vertex shader
  return vec4f(particlesIn[u32(springsIn[idx].pts[vIdx % 2])].p + 0.001 * f32(vIdx / 2), 0, 1);
}

@fragment
fn fragmentSpringMain() -> @location(0) vec4f {
  return vec4f(255.f/255, 163.f/255, 0.f/255, 1); // (R, G, B, A)
}

@compute @workgroup_size(256)
fn computeMain(@builtin(global_invocation_id) global_id: vec3u) {
  let idx = global_id.x;
  
  if (idx < arrayLength(&springsIn)) {
    // Get the spring using the invocation id
    var spring = springsIn[idx];
    let aIdx = u32(spring.pts[0]); // particle a
    let bIdx = u32(spring.pts[1]); // particle b
    
    let ptA = particlesIn[aIdx].p; // position a
    let ptB = particlesIn[bIdx].p; // position b
    let massA = particlesIn[aIdx].m; // mass a
    let massB = particlesIn[bIdx].m; // mass b
    
    // TODO 5a: compute the spring force using Hooke's Law
    let diff = ptB - ptA;
    let dist = length(diff);
    let force = spring.s * (dist - spring.l);
    
    // TODO 5b: compute the delta velocity using Netwon's law of motion
    let dir = normalize(diff);
    if (massA >= 0.000001) {
      particlesOut[aIdx].dv += (force * dir) / (massA * 1000); // mass in grams
    }
    if (massB >= 0.000001) {
      particlesOut[bIdx].dv -= (force * dir) / (massB * 1000); // opposite dir
    }
  }
}

@compute @workgroup_size(256)
fn updateMain(@builtin(global_invocation_id) global_id: vec3u) {
  let idx = global_id.x;
  
  if (idx < arrayLength(&particlesIn)) {
    var particle = particlesIn[idx];
    if (particle.dummy != 1) {
      particlesOut[idx].p = particle.p + particle.v + particlesOut[idx].dv; // update the position
      particlesOut[idx].v = (particle.v + particlesOut[idx].dv) * 0.95;     // damping
      particlesOut[idx].dv = vec2f(0, 0);                                   // reset delta velocity to zeros
      particlesOut[idx].m = particle.m;                                     // copy the mass over

      //particlesOut[idx].v[0] += forceUpdates[0];
      //particlesOut[idx].v[1] += forceUpdates[1];

      //particlesOut[idx].v += vec2f(0, -0.00001);                              // gravity
      let current = generateCurrent(f32(particlesIn[idx].p.y), f32(particlesIn[idx].p.x), 0.00005); // "Wind" effect based on y position
      particlesOut[idx].v[0] += current[0];
      particlesOut[idx].v[1] += current[1];
    }
  }
}

fn generateCurrent(time: f32, frequency: f32, strength: f32) -> vec2f {
  let angle = random(vec2f(time, frequency)) * 2 * 3.14159265;
  return vec2<f32>(cos(angle), sin(angle)) * strength;
}

fn random(st: vec2f) -> f32
{
    return fract(sin(dot(st.xy, vec2f(12.9898,78.233))) * 43758.5453123);
}