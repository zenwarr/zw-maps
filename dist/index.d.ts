export declare const DEF_MAP_SELECTOR = ".js-map";
export declare class Map {
    static init(selector?: string): void;
    static initMap(root: Element): Map | null;
    static fromRoot(elem: Element): Map | null;
    readonly root: Element;
    /** Protected area **/
    protected _root: Element;
    protected constructor(root: Element);
}
