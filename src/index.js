import makeCounter from './walt/counter.walt'

function isInTriangle_JS (px, py, ax, ay, bx, by, cx, cy) {
  let v0x = cx-ax;
  let v0y = cy-ay;
  let v1x = bx-ax;
  let v1y = by-ay;
  let v2x = px-ax;
  let v2y = py-ay;

  let dot00 = (v0x*v0x) + (v0y*v0y);
  let dot01 = (v0x*v1x) + (v0y*v1y);
  let dot02 = (v0x*v2x) + (v0y*v2y);
  let dot11 = (v1x*v1x) + (v1y*v1y);
  let dot12 = (v1x*v2x) + (v1y*v2y);

  let invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);

  let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  let ret = (u >= 0) && (v >= 0) && (u + v < 1);
  return ret;
}

function dumb_JS (px, py, ax, ay, bx, by, cx, cy) {
  return 0;
}



makeCounter().then(wasmModule => {
  let isInTriangle_ASM = wasmModule.instance.exports.isInTriangle;
  let dumb_ASM = wasmModule.instance.exports.dumb;

  let nbTest = 1000;
  let px = new Float32Array(nbTest);
  let py = new Float32Array(nbTest);
  let ax = new Float32Array(nbTest);
  let ay = new Float32Array(nbTest);
  let bx = new Float32Array(nbTest);
  let by = new Float32Array(nbTest);
  let cx = new Float32Array(nbTest);
  let cy = new Float32Array(nbTest);

  // filling with random coord
  for (let i=0; i<nbTest; i++) {
    px[i] = Math.random();
    py[i] = Math.random();
    ax[i] = Math.random();
    ay[i] = Math.random();
    bx[i] = Math.random();
    by[i] = Math.random();
    cx[i] = Math.random();
    cy[i] = Math.random();
  }

  var t0_ASM = performance.now();
  for (let i=0; i<nbTest; i++) {
    let a = isInTriangle_ASM(
    //let a = dumb_ASM(
      px[i], //px: f32,
      py[i], //py: f32,

      ax[i], //ax: f32,
      ay[i], //ay: f32,

      bx[i], //bx: f32,
      by[i], //by: f32,

      cx[i], //cx: f32,
      cy[i], //cy: f32
    )
    //console.log( a );
  }
  var t1_ASM = performance.now();

  var t0_JS = performance.now();
  for (let i=0; i<nbTest; i++) {
    let a = isInTriangle_JS(
    //let a = dumb_JS(
      px[i], //px: f32,
      py[i], //py: f32,

      ax[i], //ax: f32,
      ay[i], //ay: f32,

      bx[i], //bx: f32,
      by[i], //by: f32,

      cx[i], //cx: f32,
      cy[i], //cy: f32
    )
    //console.log( a );
  }
  var t1_JS = performance.now();

  console.log("ASM: " + (t1_ASM - t0_ASM) + " ms.")
  console.log("JS: " + (t1_JS - t0_JS) + " ms.")
})
