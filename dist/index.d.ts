export interface Coords {
    lat: number;
    long: number;
}
export interface PointData extends Coords {
    title?: string;
    balloonContent?: string;
}
export interface MapOptions {
    rootSelector?: string;
    pointSelector?: string;
    containerClass?: string;
    initialZoom?: number;
}
export declare class Map {
    static init(options?: MapOptions): void;
    static initMap(root: Element, options?: MapOptions): Map | null;
    static fromRoot(elem: Element): Map | null;
    readonly root: Element;
    readonly mapContainer: Element;
    readonly initialCenter: Coords | null;
    readonly initialZoom: number;
    readonly points: PointData[];
    /** Protected area **/
    protected _root: Element;
    protected _mapContainer: Element;
    protected _initialCenter: Coords | null;
    protected _initialZoom: number | null;
    protected _points: PointData[];
    protected _options: MapOptions;
    protected constructor(root: Element, options?: MapOptions);
    protected _parseMap(): void;
    protected _parsePoint(point: Element): PointData;
}
