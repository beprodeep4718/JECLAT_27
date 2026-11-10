import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * The hero mask: the logo texture cut into ~420 jittered triangles.
 * `progress` 0 → intact, 1 → every shard has burst outward, spun and fallen.
 * The crack starts at the closed right eye and spreads outward.
 * On each beat the shard edges flash, so the mask "cracks" in time with the kick.
 */
export type MaskSceneOptions = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  /** sRGB 0..1 colour for the crack glow */
  glow: [number, number, number];
};

export type MaskFrame = {
  /** Screen rect the mask should fill (the hero's mask slot) */
  rect: DOMRect;
  progress: number;
  beat: number;
  /** -1..1 pointer position */
  pointer: { x: number; y: number };
  crackGlow: number;
  dt: number;
};

const vertexShader = /* glsl */ `
  uniform float uP;
  uniform float uBeat;
  attribute vec3 aCen;
  attribute vec3 aRnd;
  attribute float aDel;
  attribute vec3 aBar;
  varying vec2 vUv;
  varying float vA;
  varying vec3 vBar;

  mat3 rot(vec3 ax, float a) {
    ax = normalize(ax);
    float s = sin(a), c = cos(a), oc = 1.0 - c;
    return mat3(oc*ax.x*ax.x + c,      oc*ax.x*ax.y + ax.z*s, oc*ax.z*ax.x - ax.y*s,
                oc*ax.x*ax.y - ax.z*s, oc*ax.y*ax.y + c,      oc*ax.y*ax.z + ax.x*s,
                oc*ax.z*ax.x + ax.y*s, oc*ax.y*ax.z - ax.x*s, oc*ax.z*ax.z + c);
  }

  void main() {
    vUv = uv;
    vBar = aBar;
    float t = clamp(uP * 1.8 - aDel * 0.8, 0.0, 1.0);
    vec3 local = position - aCen;
    local *= 1.0 - 0.08 * smoothstep(0.0, 0.1, uP) - 0.035 * uBeat;
    local = rot(aRnd + vec3(0.001), t * (2.5 + 3.5 * abs(aRnd.x))) * local;
    vec3 c = aCen;
    vec2 dir = normalize(aCen.xy + vec2(0.0001));
    c.xy += dir * t * (0.35 + 0.45 * abs(aRnd.y));
    c.z += t * (0.6 + 1.4 * aRnd.z) + uBeat * 0.04 * aRnd.z;
    c.y -= t * t * (2.4 + 1.4 * abs(aRnd.x));
    vA = 1.0 - smoothstep(0.55, 1.0, t);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(c + local, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uGlow;
  uniform vec3 uGlowCol;
  varying vec2 vUv;
  varying float vA;
  varying vec3 vBar;

  void main() {
    vec4 tx = texture2D(uTex, vUv);
    if (tx.a < 0.04) discard;
    float e = min(min(vBar.x, vBar.y), vBar.z);
    float line = 1.0 - smoothstep(0.0, 0.04, e);
    vec3 col = mix(tx.rgb, uGlowCol, line * uGlow);
    gl_FragColor = vec4(col, tx.a * vA);
  }
`;

function buildShards(aspect: number, cols = 14, rows = 15) {
  const pts: [number, number][] = [];
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      let x = i / cols;
      let y = j / rows;
      if (i > 0 && i < cols) x += ((Math.random() - 0.5) * 0.75) / cols;
      if (j > 0 && j < rows) y += ((Math.random() - 0.5) * 0.75) / rows;
      pts.push([x, y]);
    }
  }
  const P: number[] = [], UV: number[] = [], CEN: number[] = [], RND: number[] = [], DEL: number[] = [], BAR: number[] = [];
  const origin = [0.63, 0.53]; // the closed right eye

  const tri = (a: [number, number], b: [number, number], c: [number, number]) => {
    const cx = (a[0] + b[0] + c[0]) / 3;
    const cy = (a[1] + b[1] + c[1]) / 3;
    const r = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1];
    const d = Math.hypot(cx - origin[0], cy - origin[1]);
    const delay = Math.min(1, d / 0.8) * 0.85 + Math.random() * 0.15;
    [a, b, c].forEach((p, k) => {
      P.push((p[0] - 0.5) * aspect, p[1] - 0.5, 0);
      UV.push(p[0], p[1]);
      CEN.push((cx - 0.5) * aspect, cy - 0.5, 0);
      RND.push(r[0], r[1], r[2]);
      DEL.push(delay);
      BAR.push(k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0);
    });
  };

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const idx = j * (cols + 1) + i;
      const A = pts[idx], B = pts[idx + 1], C = pts[idx + cols + 1], D = pts[idx + cols + 2];
      if (Math.random() < 0.5) {
        tri(A, B, D);
        tri(A, D, C);
      } else {
        tri(A, B, C);
        tri(B, D, C);
      }
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(P, 3));
  geo.setAttribute("uv", new Float32BufferAttribute(UV, 2));
  geo.setAttribute("aCen", new Float32BufferAttribute(CEN, 3));
  geo.setAttribute("aRnd", new Float32BufferAttribute(RND, 3));
  geo.setAttribute("aDel", new Float32BufferAttribute(DEL, 1));
  geo.setAttribute("aBar", new Float32BufferAttribute(BAR, 3));
  return geo;
}

export function createMaskScene({ canvas, image, glow }: MaskSceneOptions) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 5;

  // Raw sampling: the shader writes texture colours straight through, so the logo keeps its exact sRGB values.
  const texture = new Texture(image);
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;

  const aspect = image.naturalWidth / image.naturalHeight || 0.924;
  const geometry = buildShards(aspect);
  const uniforms = {
    uTex: { value: texture },
    uP: { value: 0 },
    uBeat: { value: 0 },
    uGlow: { value: 0 },
    uGlowCol: { value: new Vector3(...glow) },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const tilt = { x: 0, y: 0 };
  let lastW = 0;
  let lastH = 0;

  function render({ rect, progress, beat, pointer, crackGlow, dt }: MaskFrame) {
    const vw = canvas.clientWidth;
    const vh = canvas.clientHeight;
    if (!vw || !vh) return;
    if (vw !== lastW || vh !== lastH) {
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      lastW = vw;
      lastH = vh;
    }
    // world units per CSS pixel on the z = 0 plane
    const upp = (2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)) / vh;
    mesh.scale.setScalar(rect.height * upp * (1 + beat * 0.025));
    mesh.position.set((rect.left + rect.width / 2 - vw / 2) * upp, -(rect.top + rect.height / 2 - vh / 2) * upp, 0);

    const k = 1 - Math.exp(-dt * 4);
    tilt.x += (pointer.y * 0.2 - tilt.x) * k;
    tilt.y += (pointer.x * 0.32 - tilt.y) * k;
    mesh.rotation.set(tilt.x, tilt.y, 0);

    uniforms.uP.value = progress;
    uniforms.uBeat.value = beat;
    uniforms.uGlow.value = Math.min(1, crackGlow);
    renderer.render(scene, camera);
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    texture.dispose();
    renderer.dispose();
  }

  return { render, dispose };
}
