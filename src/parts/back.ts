import { BoxGeometry, Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";
import { TerrariumPart } from "./terrarium-part";

export class Back implements TerrariumPart {
    generate(options: TerrariumOptions, material: Material): Mesh {
        const back = new Mesh(
            new BoxGeometry(options.width, options.height - options.glassThickness, options.glassThickness),
            material
        );
        back.position.y = options.height / 2 - options.glassThickness / 2;
        back.position.z = -options.depth / 2 + options.glassThickness / 2 - options.offset;

        return back;
    }
}
