import { BoxGeometry, Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";
import { TerrariumPart } from "./terrarium-part";

export class Top implements TerrariumPart {
    generate(options: TerrariumOptions, material: Material): Mesh {
        const top = new Mesh(
            new BoxGeometry(options.width, options.glassThickness, options.depth - options.glassThickness),
            material
        );
        top.position.y = options.height - options.glassThickness / 2 + options.offset;
        top.position.z = -options.glassThickness / 2;

        return top;
    }
}
