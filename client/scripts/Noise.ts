import Perlin from './Algorithms/Perlin';
import OpenSimplexNoise from './Algorithms/OpenSimplex';
import PRNG from './PRNG';

export default class Noise {

    // Random Noise
    // Perlin Noise

    /**
     * Random Noise function
     *
     * @param  {number} width
     * @param  {number} height
     * @returns {number[][]} noise
     */
    public static Random = (
        width: number,
        height: number
    ): number[][] => {

        let noise: number[][] = [];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (noise[x] === undefined) {
                    noise[x] = []
                }
                noise[x][y] = Math.random();
            }
        }

        return noise;
    }

    /**
     * Improved Noise function
     *
     * @param  {number} width
     * @param  {number} height
     * @returns {number[][]} noise
     */
    public static Improved = (
        algorithm: string,
        prng: PRNG,
        width: number,
        height: number,
        scale: number,
        octaves: number,
        seed: number,
        lacunarity: number,
    ): number[][] => {

        let noise: number[][] = [];

        let openSimplex: OpenSimplexNoise = new OpenSimplexNoise(seed);

        let octaveOffset: {
            x: number,
            y: number
        }[] = [];

        for (let i = 0; i < octaves; i++) {
            octaveOffset[i] = {
                x: prng.next(-10000, 10000),
                y: prng.next(-10000, 10000),
            };
        }

        if (scale <= 0) scale = 0.001;

        for (let x = 0; x < width; x++) {
            if (noise[x] === undefined) {
                noise[x] = [];
            }

            for (let y = 0; y < height; y++) {

                let height: number = 0,
                    frequency: number = 1,
                    amplitude: number = 1;

                for (let i = 0; i < octaves; i++) {

                    const X: number = (x + octaveOffset[i].x) / scale * frequency;
                    const Y: number = (y + octaveOffset[i].y) / scale * frequency;

                    switch (algorithm) {
                        case 'Perlin':
                            height += Perlin.noise(seed, X, Y) * amplitude;
                            break;
                        case 'OpenSimplex':
                            height += openSimplex.noise2D(X, Y);
                            break;
                        default:
                            height += Perlin.noise(seed, X, Y) * amplitude;
                            break;
                    }

                    frequency *= lacunarity;
                }
                noise[x][y] = height / 2 + .5;
            }
        }

        return noise;
    }

    public static OpenSimplex = (
        width: number,
        height: number
    ): number[][] => {

        let openSimiplex = new OpenSimplexNoise(1);

        let noise: number[][] = [];

        for (let x = 0; x < width; x++) {
            if (noise[x] === undefined) {
                noise[x] = [];
            }

            for (let y = 0; y < height; y++) {
                const X: number = (x + 0) / 30;
                const Y: number = (y + 0) / 30;

                noise[x][y] = openSimiplex.noise2D(X, Y);
            }
        }

        return noise;
    }
}