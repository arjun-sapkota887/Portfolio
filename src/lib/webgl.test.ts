import { isWebGLAvailable } from './webgl';

const canvasWith = (context: unknown) => () =>
  ({ getContext: vi.fn(() => context) }) as unknown as HTMLCanvasElement;

describe('isWebGLAvailable', () => {
  it('is true when a WebGL2 context can be created', () => {
    expect(isWebGLAvailable(canvasWith({}))).toBe(true);
  });

  it('is false when no context can be created', () => {
    expect(isWebGLAvailable(canvasWith(null))).toBe(false);
  });

  it('is false when creating a context throws', () => {
    const throwing = () =>
      ({
        getContext: () => {
          throw new Error('blocked');
        },
      }) as unknown as HTMLCanvasElement;
    expect(isWebGLAvailable(throwing)).toBe(false);
  });
});
