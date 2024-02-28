import { BoxGeometry, Material, Mesh } from "three";
import { TerrariumOptions } from "../../terrarium-options";
import { RNG } from "../../rng";
import { Spacer } from "./spacer";

export class Door extends Spacer {
    generate(options: TerrariumOptions, materialGenerator: (rng: RNG) => Material, rng: RNG): Mesh[] {
        // TODO - Add Rails
        let doors = [...super.generate(options, materialGenerator, rng)];

        // DOOR 1
        const door1 = new Mesh(
            new BoxGeometry(options.width / 2, this.height, options.glassThickness),
            materialGenerator(rng)
        );

        door1.position.x = -options.width / 4;
        door1.position.y = this.getBottom() + this.height / 2;

        door1.position.z = options.depth / 2 - options.glassThickness / 2 + options.offset;
        if (options.door.height != 0) doors.push(door1);

        // DOOR 2
        const door2 = door1.clone();
        door2.material = materialGenerator(rng);
        door2.position.x = options.width / 4;
        if (options.door.height != 0) doors.push(door2);

        return doors;
    }
}
