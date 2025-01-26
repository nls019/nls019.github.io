@vertex
fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
  return vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
}

@fragment
fn fragmentMain() -> @location(0) vec4f {
  return vec4f(0, 160.f/255, 30.f/255, 1); // (R, G, B, A)
}