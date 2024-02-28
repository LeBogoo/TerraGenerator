import { Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";
import { MultiTerrariumPart } from "./multi-terrarium-part";
import { FrontModule } from "./frontModules/front-module";
import { RNG } from "../rng";

export class Front implements MultiTerrariumPart {
    constructor(
        private rootModule: FrontModule,
        private materialGenerator: (rng: RNG) => THREE.MeshLambertMaterial,
        private rng: RNG
    ) {}

    generate(options: TerrariumOptions, materials: Material[]): Mesh[] {
        console.log("ROOT MODULE", this.rootModule);

        const meshes = this.rootModule.generate(options, this.materialGenerator, this.rng) as Mesh[];
        return meshes;
    }
}
