import { Material, Mesh, BoxGeometry } from "three";
import { RNG } from "../../rng";
import { TerrariumOptions } from "../../terrarium-options";
import { Spacer } from "./spacer";

export class Vent extends Spacer {
    generate(options: TerrariumOptions, materialGenerator: (rng: RNG) => Material, rng: RNG): Mesh[] {
        const elements = super.generate(options, materialGenerator, rng);
        const material = materialGenerator(rng);

        if (this.height == 0) return elements;

        const topVentRim = new Mesh(
            new BoxGeometry(
                options.width,
                Math.min(this.height, options.glassThickness),
                options.glassThickness
            ),
            material
        );

        const bottomVentRim = topVentRim.clone(true);

        topVentRim.position.y = this.getTop() - options.glassThickness / 2;
        bottomVentRim.position.y = this.getBottom() + options.glassThickness / 2;

        topVentRim.position.z = options.depth / 2 - options.glassThickness / 2 + options.offset;
        bottomVentRim.position.z = topVentRim.position.z;

        const leftRim = new Mesh(
            new BoxGeometry(
                options.glassThickness,
                this.height - options.glassThickness * 2,
                options.glassThickness
            ),
            material
        );

        const rightRim = leftRim.clone(true);

        leftRim.position.x = -options.width / 2 + options.glassThickness / 2;
        leftRim.position.y = this.getBottom() + this.height / 2;
        leftRim.position.z = options.depth / 2 - options.glassThickness / 2 + options.offset;

        rightRim.position.x = -leftRim.position.x;
        rightRim.position.y = leftRim.position.y;
        rightRim.position.z = leftRim.position.z;

        elements.push(topVentRim, bottomVentRim, leftRim, rightRim);

        return elements;
    }
}
