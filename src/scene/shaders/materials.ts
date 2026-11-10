// Procedural ShaderMaterials for every body in the scene. No textures are loaded.
import {
  AdditiveBlending,
  BackSide,
  Color,
  DoubleSide,
  ShaderMaterial,
  Vector3,
  type Vector3Tuple,
} from 'three';
import type { PlanetSurface } from '../../data/types';
import { noiseGlsl } from './noise';

const SURFACE_INDEX: Record<PlanetSurface, number> = { rocky: 0, terran: 1, gas: 2, ringed: 3 };

export function createSunMaterial() {
  return new ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vPos;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vPos = position;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vPos;
      varying vec3 vNormal;
      varying vec3 vView;
      ${noiseGlsl}
      void main() {
        vec3 p = normalize(vPos);
        float granules = fbm(p * 3.0 + vec3(0.0, uTime * 0.04, 0.0));
        float cells = snoise(p * 12.0 - uTime * 0.08) * 0.5 + 0.5;
        float heat = clamp(0.55 + granules * 0.6 + cells * 0.2, 0.0, 1.0);
        vec3 deep = vec3(0.95, 0.32, 0.03);
        vec3 bright = vec3(1.0, 0.72, 0.22);
        vec3 core = vec3(1.0, 0.96, 0.82);
        vec3 color = mix(deep, bright, heat);
        color = mix(color, core, smoothstep(0.75, 1.0, heat));
        float facing = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
        color *= mix(0.75, 1.25, pow(facing, 0.6));
        color += vec3(1.0, 0.45, 0.08) * pow(1.0 - facing, 3.0) * 0.8;
        gl_FragColor = vec4(color * 1.25, 1.0);
      }`,
  });
}

export function createGlowMaterial(color = '#ffb347', intensity = 1) {
  return new ShaderMaterial({
    uniforms: { uColor: { value: new Color(color) }, uIntensity: { value: intensity } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float core = pow(max(1.0 - d, 0.0), 3.0);
        float halo = pow(max(1.0 - d, 0.0), 1.4) * 0.35;
        float alpha = (core + halo) * uIntensity;
        gl_FragColor = vec4(uColor * alpha, alpha);
      }`,
  });
}

export function createPlanetMaterial(
  surface: PlanetSurface,
  colors: [string, string],
  seed: number,
) {
  return new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSurface: { value: SURFACE_INDEX[surface] },
      uColorA: { value: new Color(colors[0]) },
      uColorB: { value: new Color(colors[1]) },
      uSeed: { value: seed },
    },
    vertexShader: /* glsl */ `
      varying vec3 vObj;
      varying vec3 vNormal;
      varying vec3 vWorld;
      void main() {
        vObj = position;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform int uSurface;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform float uSeed;
      varying vec3 vObj;
      varying vec3 vNormal;
      varying vec3 vWorld;
      ${noiseGlsl}
      void main() {
        vec3 p = normalize(vObj);
        vec3 s = p + vec3(uSeed);
        vec3 color;
        float rim = 0.0;
        vec3 rimColor = vec3(0.0);

        if (uSurface == 0) {
          float n = fbm(s * 4.0);
          float craters = smoothstep(0.55, 0.75, snoise(s * 10.0) * 0.5 + 0.5);
          color = mix(uColorB, uColorA, n * 0.5 + 0.55);
          color *= 1.0 - craters * 0.35;
        } else if (uSurface == 1) {
          float land = fbm(s * 2.2);
          float isLand = smoothstep(0.02, 0.08, land);
          vec3 ocean = uColorA * (0.75 + 0.25 * snoise(s * 6.0));
          vec3 ground = mix(uColorB, vec3(0.62, 0.52, 0.34), smoothstep(0.15, 0.4, land));
          color = mix(ocean, ground, isLand);
          float ice = smoothstep(0.8, 0.9, abs(p.y) + land * 0.1);
          color = mix(color, vec3(0.95), ice);
          float clouds = smoothstep(0.15, 0.6, fbm(s * 3.0 + vec3(uTime * 0.01, 0.0, 0.0)));
          color = mix(color, vec3(1.0), clouds * 0.7);
          rim = 1.0;
          rimColor = vec3(0.35, 0.6, 1.0);
        } else {
          float freq = uSurface == 2 ? 16.0 : 10.0;
          float turbulence = fbm(s * vec3(2.0, 6.0, 2.0) + vec3(uTime * 0.005, 0.0, 0.0));
          float bands = sin(p.y * freq + turbulence * 2.5) * 0.5 + 0.5;
          color = mix(uColorB, uColorA, bands);
          color = mix(color, vec3(1.0, 0.95, 0.85), smoothstep(0.7, 1.0, bands) * 0.25);
          if (uSurface == 2) {
            float storm = 1.0 - smoothstep(0.0, 0.12, length(vec2(p.x - 0.55, (p.y + 0.3) * 1.8)));
            color = mix(color, vec3(0.75, 0.35, 0.22), storm * 0.8);
          }
        }

        vec3 n = normalize(vNormal);
        vec3 lightDir = normalize(-vWorld);
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float diffuse = max(dot(n, lightDir), 0.0);
        vec3 lit = color * (0.05 + diffuse * 1.15);
        float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
        lit += rimColor * fresnel * rim * (0.25 + diffuse);
        gl_FragColor = vec4(lit, 1.0);
      }`,
  });
}

export function createRingMaterial(colors: [string, string], inner: number, outer: number) {
  return new ShaderMaterial({
    uniforms: {
      uColorA: { value: new Color(colors[0]) },
      uColorB: { value: new Color(colors[1]) },
      uInner: { value: inner },
      uOuter: { value: outer },
    },
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uInner;
      uniform float uOuter;
      varying float vR;
      void main() {
        vR = (length(position.xy) - uInner) / (uOuter - uInner);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vR;
      ${noiseGlsl}
      void main() {
        float bands = snoise(vec3(vR * 40.0, 0.0, 0.0)) * 0.5 + 0.5;
        float gap = smoothstep(0.6, 0.62, vR) * (1.0 - smoothstep(0.66, 0.68, vR));
        float edge = smoothstep(0.0, 0.08, vR) * (1.0 - smoothstep(0.9, 1.0, vR));
        float alpha = edge * (0.35 + bands * 0.55) * (1.0 - gap * 0.85);
        vec3 color = mix(uColorB, uColorA, bands);
        gl_FragColor = vec4(color, alpha);
      }`,
  });
}

export function createStarMaterial() {
  return new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute vec3 aColor;
      attribute float aTwinkle;
      uniform float uTime;
      uniform float uPixelRatio;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = aColor;
        vAlpha = 0.65 + 0.35 * sin(uTime * (0.5 + aTwinkle) + aTwinkle * 40.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPixelRatio * (300.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
        gl_FragColor = vec4(vColor * alpha, alpha);
      }`,
  });
}

export function createMilkyWayMaterial(bandNormal: Vector3Tuple = [0.25, 0.9, 0.35]) {
  return new ShaderMaterial({
    uniforms: { uBandNormal: { value: new Vector3(...bandNormal) } },
    side: BackSide,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uBandNormal;
      varying vec3 vDir;
      ${noiseGlsl}
      void main() {
        vec3 d = normalize(vDir);
        float h = dot(d, normalize(uBandNormal));
        float band = exp(-pow(h / 0.22, 2.0));
        float dust = fbm(d * 5.0) * 0.5 + 0.5;
        float lanes = smoothstep(0.45, 0.7, fbm(d * 9.0 + 3.0) * 0.5 + 0.5);
        vec3 haze = mix(vec3(0.16, 0.12, 0.28), vec3(0.55, 0.38, 0.5), dust);
        vec3 glow = vec3(1.0, 0.72, 0.45) * pow(max(dot(d, normalize(vec3(-0.8, 0.1, -0.6))), 0.0), 6.0);
        vec3 color = (haze * dust + glow * 0.6) * band * (1.0 - lanes * 0.6) * 0.45;
        color += vec3(0.008, 0.01, 0.025);
        gl_FragColor = vec4(color, 1.0);
      }`,
  });
}
