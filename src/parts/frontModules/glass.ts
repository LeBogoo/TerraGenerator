import { BoxGeometry, Material, Mesh } from "three";
import { Spacer } from "./spacer";
import { TerrariumOptions } from "../../terrarium-options";
import { RNG } from "../../rng";

export class Glass extends Spacer {
    generate(options: TerrariumOptions, materialGenerator: (rng: RNG) => Material, rng: RNG): Mesh[] {
        const elements = super.generate(options, materialGenerator, rng);
        const glassPane = new Mesh(
            new BoxGeometry(options.width, this.height, options.glassThickness),
            materialGenerator(rng)
        );

        glassPane.position.y = this.height / 2 + this.getBottom();
        glassPane.position.z = options.depth / 2 - options.glassThickness / 2 + options.offset;
        if (this.height != 0) elements.push(glassPane);
        return elements;
    }
}
