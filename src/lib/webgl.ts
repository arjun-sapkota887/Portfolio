const defaultCanvas = () => document.createElement('canvas');

/** True when the browser can create a WebGL context (some devices, VMs and privacy modes cannot). */
export function isWebGLAvailable(createCanvas: () => HTMLCanvasElement = defaultCanvas): boolean {
  try {
    const canvas = createCanvas();
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
