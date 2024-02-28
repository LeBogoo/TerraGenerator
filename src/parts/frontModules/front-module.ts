import { Material, Mesh } from "three";
import { TerrariumOptions } from "../../terrarium-options";
import { RNG } from "../../rng";

export interface FrontModule {
    height: number;
    getTop(): number;
    getBottom(): number;
    getRoot(): FrontModule;
    setChild(child: FrontModule): FrontModule;
    generate(options: TerrariumOptions, materialGenerator: (rng: RNG) => Material, rng: RNG): Mesh[];
    parent?: FrontModule;
}
