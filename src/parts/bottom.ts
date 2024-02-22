import { BoxGeometry, Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";
import { TerrariumPart } from "./terrarium-part";

export class Bottom implements TerrariumPart {
    generate(options: TerrariumOptions, material: Material): Mesh {
        const bottom = new Mesh(
            new BoxGeometry(
                options.width - options.glassThickness * 2,
                options.glassThickness,
                options.depth - options.glassThickness * 2
            ),
            material
        );
        bottom.position.y = options.glassThickness / 2 - options.offset;

        return bottom;
    }
}
