/// <reference types="yandex-maps" />
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
    imageOffsetX?: number;
    imageOffsetY?: number;
}
export interface MapOptions {
    rootSelector?: string;
    pointSelector?: string;
    templateSelector?: string;
    containerClass?: string;
    initialZoom?: number;
    disableScrollZoom?: boolean;
    pointTemplates?: PointTemplate[];
}
export declare class Map {
    static init(options?: MapOptions, factory?: MapFactory): void;
    static initMap(root: Element, options?: MapOptions, factory?: MapFactory): Map | null;
    static fromRoot(elem: Element): Map | null;
    readonly root: Element;
    readonly mapContainer: Element;
    readonly initialCenter: Coords | null;
    readonly initialZoom: number;
    readonly points: PointData[];
    readonly pointTemplates: PointTemplate[];
    getPointTemplate(name: string): PointTemplate | null;
    getPoint(name: string): PointData | null;
    panToPoint(pointName: string): void;
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
    protected _parseTemplate(elem: Element): PointTemplate;
    protected _panToPoint(point: PointData): void;
}
export declare type MapFactory = (root: Element, options?: MapOptions) => Map;
export interface YandexMapPointData extends PointData {
    placemark: ymaps.Placemark | null;
}
export declare class YandexMap extends Map {
    static init(options?: MapOptions): void;
    /** Protected area **/
    protected constructor(root: Element, options?: MapOptions);
    protected _addPlacemark(point: YandexMapPointData): void;
    protected _parsePoint(elem: Element): YandexMapPointData;
    protected _panToPoint(point: YandexMapPointData): void;
    protected _ymap: ymaps.Map;
}
