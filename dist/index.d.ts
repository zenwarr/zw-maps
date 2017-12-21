import { Component, ComponentFactory, ComponentOptions } from "@zcomp/base";
export declare const DefaultOptions: MapOptions;
export interface Coords {
    lat: number;
    long: number;
}
export interface PointData extends Coords {
    title?: string;
    balloonContent?: string;
    template?: string;
    name?: string;
}
export interface PointTemplate {
    name: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAnchorX?: number;
    imageAnchorY?: number;
}
export interface MapOptions extends ComponentOptions {
    rootSelector?: string;
    pointSelector?: string;
    templateSelector?: string;
    containerClass?: string;
    initialZoom?: number;
    disableScrollZoom?: boolean;
    pointTemplates?: PointTemplate[];
}
export declare abstract class Map extends Component<MapOptions> {
    constructor(root: Element, options: MapOptions);
    readonly mapContainer: Element;
    readonly initialCenter: Coords | null;
    readonly initialZoom: number;
    readonly points: PointData[];
    readonly pointTemplates: PointTemplate[];
    getPointTemplate(name: string): PointTemplate | null;
    getPoint(name: string): PointData | null;
    panToPoint(pointName: string): void;
    /** Protected area **/
    protected _mapContainer: Element;
    protected _initialCenter: Coords | null;
    protected _initialZoom: number | null;
    protected _points: PointData[];
    protected _parseMap(): void;
    protected _parsePoint(point: Element): PointData;
    protected _parseTemplate(elem: Element): PointTemplate;
    protected abstract _panToPoint(point: PointData): void;
}
export declare class DummyMap extends Map {
    protected _panToPoint(point: PointData): void;
}
export declare const MapFactory: ComponentFactory<Map, MapOptions>;
