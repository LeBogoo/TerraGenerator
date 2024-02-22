import { Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";

export interface TerrariumPart {
    generate(options: TerrariumOptions, material: Material): Mesh;
}
