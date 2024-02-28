import { Material, Mesh } from "three";
import { FrontModule } from "./front-module";
import { TerrariumOptions } from "../../terrarium-options";
import { RNG } from "../../rng";

export class Spacer implements FrontModule {
    public parent?: FrontModule;
    private child?: FrontModule;

    constructor(public height: number) {}

    /**
     * Sets the Child of the module and returns the Child.
     * @param child The child to be set for this module
     * @returns The set Child
     */
    setChild(child: FrontModule): FrontModule {
        this.child = child;
        this.child.parent = this;
        return this.child;
    }

    getRoot(): FrontModule {
        return this.parent?.getRoot() || this;
    }

    getTop(): number {
        let top = this.height;
        if (this.parent) top += this.parent.getTop();
        return top;
    }

    getBottom(): number {
        console.log(this.parent?.getTop() || 0);

        return this.parent?.getTop() || 0;
    }

    generate(options: TerrariumOptions, materialGenerator: (rng: RNG) => Material, rng: RNG): Mesh[] {
        console.log("Generating");
        let childMeshes = this.child?.generate(options, materialGenerator, rng).flat();
        return childMeshes || [];
    }
}
