import { BoxGeometry, Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";
import { TerrariumPart } from "./terrarium-part";

export class FrontBottom implements TerrariumPart {
    generate(options: TerrariumOptions, material: Material): Mesh {
        const frontBottom = new Mesh(
            new BoxGeometry(options.width, options.door.offset, options.glassThickness),
            material
        );

        frontBottom.position.y = options.door.offset / 2;
        frontBottom.position.z = options.depth / 2 - options.glassThickness / 2 + options.offset;

        return frontBottom;
    }
}
