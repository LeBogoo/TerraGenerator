import { Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";

export interface MultiTerrariumPart {
    generate(options: TerrariumOptions, materials: Material[]): Mesh[];
}
