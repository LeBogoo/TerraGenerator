import { Material, Mesh, BoxGeometry } from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { RNG } from "../../rng";
import { TerrariumOptions } from "../../terrarium-options";
import { Spacer } from "./spacer";

export class Vent extends Spacer {
    generate(options: TerrariumOptions, materialGenerator: (rng: RNG) => Material, rng: RNG): Mesh[] {
        const elements = super.generate(options, materialGenerator, rng);
        const material = materialGenerator(rng);

        if (this.height == 0) return elements;

        const topVentRim = new BoxGeometry(
            options.width,
            Math.min(this.height, options.glassThickness),
            options.glassThickness
        );

        const bottomVentRim = topVentRim.clone();

        const leftRim = new BoxGeometry(
            options.glassThickness,
            this.height - options.glassThickness * 2,
            options.glassThickness
        );

        const rightRim = leftRim.clone();

        topVentRim.translate(
            0,
            this.getTop() - options.glassThickness / 2,
            options.depth / 2 - options.glassThickness / 2 + options.offset
        );
        bottomVentRim.translate(
            0,
            this.getBottom() + options.glassThickness / 2,
            options.depth / 2 - options.glassThickness / 2 + options.offset
        );

        leftRim.translate(
            -options.width / 2 + options.glassThickness / 2,
            this.getBottom() + this.height / 2,
            options.depth / 2 - options.glassThickness / 2 + options.offset
        );
        rightRim.translate(
            options.width / 2 - options.glassThickness / 2,
            this.getBottom() + this.height / 2,
            options.depth / 2 - options.glassThickness / 2 + options.offset
        );

        let mergedGeometry = BufferGeometryUtils.mergeGeometries([
            topVentRim,
            bottomVentRim,
            leftRim,
            rightRim,
        ]);

        mergedGeometry = BufferGeometryUtils.mergeVertices(mergedGeometry);

        const ventMesh = new Mesh(mergedGeometry, material);

        elements.push(ventMesh);

        return elements;
    }
}
