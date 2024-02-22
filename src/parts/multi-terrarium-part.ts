import { Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";

export interface MuliTerrariumPart {
    generate(options: TerrariumOptions, materials: Material[]): Mesh[];
}
