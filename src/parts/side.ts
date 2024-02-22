import { BoxGeometry, Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";
import { TerrariumPart } from "./terrarium-part";

export class Side implements TerrariumPart {
    constructor(private direction: -1 | 1) {}

    generate(options: TerrariumOptions, material: Material): Mesh {
        const side = new Mesh(
            new BoxGeometry(
                options.glassThickness,
                options.height - options.glassThickness,
                options.depth - options.glassThickness * 2
            ),
            material
        );
        side.position.y = options.height / 2 - options.glassThickness / 2;
        side.position.x =
            this.direction * (options.width / 2 - options.glassThickness / 2 + options.offset);

        return side;
    }
}
