import { BoxGeometry, Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";
import { TerrariumPart } from "./terrarium-part";

export class FrontTop implements TerrariumPart {
    generate(options: TerrariumOptions, material: Material): Mesh {
        const frontTopHeight = options.height - (options.door.offset + options.door.height);
        const frontTop = new Mesh(
            new BoxGeometry(options.width, frontTopHeight, options.glassThickness),
            material
        );

        frontTop.position.y = options.height - frontTopHeight / 2;
        frontTop.position.z = options.depth / 2 - options.glassThickness / 2 + options.offset;

        return frontTop;
    }
}
