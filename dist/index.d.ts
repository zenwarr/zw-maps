/// <reference types="yandex-maps" />
/// <reference types="googlemaps" />
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
export interface MapOptions {
    rootSelector?: string;
    pointSelector?: string;
    templateSelector?: string;
    containerClass?: string;
    initialZoom?: number;
    disableScrollZoom?: boolean;
    pointTemplates?: PointTemplate[];
}
export declare abstract class Map {
    constructor(root: Element, options?: MapOptions);
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
    protected _parseMap(): void;
    protected _parsePoint(point: Element): PointData;
    protected _parseTemplate(elem: Element): PointTemplate;
    protected abstract _panToPoint(point: PointData): void;
}
export interface MapType {
    new (root: Element, options?: MapOptions): Map;
}
export declare type MapFunctor = (root: Element, options?: MapOptions) => Map;
export declare abstract class MapFactory {
    static init(mapType: MapType, options?: MapOptions): void;
    static initWithFunctor(functor: MapFunctor, options?: MapOptions): void;
    static initMap(mapType: MapType, root: Element, options?: MapOptions): Map;
    static initMapWithFunctor(functor: MapFunctor, root: Element, options?: MapOptions): Map;
}
export declare class DummyMap extends Map {
    protected _panToPoint(point: PointData): void;
}
export interface YandexMapPointData extends PointData {
    placemark: ymaps.Placemark | null;
}
export declare class YandexMap extends Map {
    constructor(root: Element, options?: MapOptions);
    /** Protected area **/
    protected _addPlacemark(point: YandexMapPointData): void;
    protected _parsePoint(elem: Element): YandexMapPointData;
    protected _panToPoint(point: YandexMapPointData): void;
    protected _ymap: ymaps.Map;
}
export interface GoogleMapPointData extends PointData {
    marker: google.maps.Marker | null;
    infoWindow: google.maps.InfoWindow | null;
}
export declare class GoogleMap extends Map {
    constructor(root: Element, options?: MapOptions);
    /** Protected area **/
    protected _addMarker(point: GoogleMapPointData): void;
    protected _parsePoint(elem: Element): GoogleMapPointData;
    protected _panToPoint(point: GoogleMapPointData): void;
    protected _gmap: google.maps.Map;
}
