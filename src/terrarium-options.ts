export interface TerrariumOptions {
  width: number;
  height: number;
  depth: number;
  glassThickness: number;
  door: {
    height: number;
    offset: number;
    gap: number;
  };
}
