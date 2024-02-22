import { BoxGeometry, Material, Mesh } from "three";
import { TerrariumOptions } from "../terrarium-options";
import { MultiTerrariumPart } from "./multi-terrarium-part";

export class Door implements MultiTerrariumPart {
    generate(options: TerrariumOptions, materials: Material[]): Mesh[] {
        let doors = [];

        const door1 = new Mesh(
            new BoxGeometry(options.width / 2, options.door.height, options.glassThickness),
            materials[0]
        );

        door1.position.x = -options.width / 4;
        door1.position.y = options.door.offset + options.door.height / 2;

        door1.position.z = options.depth / 2 - options.glassThickness / 2 + options.offset;
        if (options.door.height != 0) doors.push(door1);

        // DOOR 2
        const door2 = door1.clone();
        door2.material = materials[1];
        door2.position.x = options.width / 4;
        if (options.door.height != 0) doors.push(door2);

        return doors;
    }
}
