import {Component, ComponentFactory, ComponentOptions} from "@zcomp/base";

const DEF_INITIAL_ZOOM = 15;

export const DefaultOptions: MapOptions = {
  rootSelector: '.js-map',
  pointSelector: '.js-map__point',
  containerClass: 'js-map__map',
  templateSelector: '.js-map__point-template',
  initialZoom: DEF_INITIAL_ZOOM,
  disableScrollZoom: true
};

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

export abstract class Map extends Component<MapOptions> {
  constructor(root: Element, options: MapOptions) {
    super(root, options);

    if (this.options.rootSelector && this.root.querySelector(this.options.rootSelector)) {
      console.warn(`Unsupported nesting for selector ${this.options.rootSelector}`, this.root);
    }

    let container = this._root.querySelector('.' + this._options.containerClass || '');
    if (!container) {
      // create container itself
      container = document.createElement('div');
      container.classList.add(this._options.containerClass || '');
      this._root.appendChild(container);
    }
    this._mapContainer = container;

    this._parseMap();
    let points = this._root.querySelectorAll(this._options.pointSelector as string);
    for (let q = 0; q < points.length; ++q) {
      try {
        this._points.push(this._parsePoint(points[q]));
      } catch (err) {
        console.warn('Error while processing point element', points[q], ': ', err);
      }
    }

    if (this._options.templateSelector) {
      let templates = this._root.querySelectorAll(this._options.templateSelector);
      for (let q = 0; q < templates.length; ++q) {
        try {
          let templ = this._parseTemplate(templates[q]);
          if (this._options.pointTemplates) {
            this._options.pointTemplates.push(templ);
          } else {
            this._options.pointTemplates = [ templ ];
          }
        } catch (err) {
          console.warn(`Error while processing template element`, templates[q], ': ', err);
        }
      }
    }
  }

  get mapContainer(): Element { return this._mapContainer; }

  get initialCenter(): Coords|null { return this._initialCenter; }

  get initialZoom(): number { return this._initialZoom || this._options.initialZoom || DEF_INITIAL_ZOOM; }

  get points(): PointData[] { return this._points; }

  get pointTemplates(): PointTemplate[] { return this._options.pointTemplates || [] }

  getPointTemplate(name: string): PointTemplate|null {
    if (this._options.pointTemplates) {
      let tpls = this._options.pointTemplates;
      for (let q = 0; q < tpls.length; ++q) {
        if (tpls[q].name === name) {
          return tpls[q];
        }
      }
    }
    return null;
  }

  getPoint(name: string): PointData|null {
    if (!name) {
      return null;
    }

    for (let q = 0; q < this._points.length; ++q) {
      if (this._points[q].name === name) {
        return this._points[q];
      }
    }

    return null;
  }

  panToPoint(pointName: string): void {
    let point = this.getPoint(pointName);
    if (point) {
      this._panToPoint(point);
    }
  }

  /** Protected area **/

  protected _mapContainer: Element;
  protected _initialCenter: Coords|null = null;
  protected _initialZoom: number|null = null;
  protected _points: PointData[] = [];

  protected _parseMap(): void {
    let centerLat = this._root.getAttribute('data-lat'),
        centerLong = this._root.getAttribute('data-long');
    if (centerLat && centerLong && !isNaN(+centerLat) && !isNaN(+centerLong)) {
      this._initialCenter = {
        lat: +centerLat,
        long: +centerLong
      };
    }

    let zoom = this._root.getAttribute('data-zoom');
    if (zoom && !isNaN(+zoom)) {
      this._initialZoom = +zoom;
    }
  }

  protected _parsePoint(point: Element): PointData {
    let lat = point.getAttribute('data-lat'),
        long = point.getAttribute('data-long');
    if (!lat || !long || isNaN(+lat) || isNaN(+long)) {
      throw new Error('Broken coordinates, please provide data-lat and data-long attributes');
    }

    let title = point.getAttribute('data-title') || point.getAttribute('title') || undefined;

    let balloonContent = point.innerHTML || undefined;

    let template = point.getAttribute('data-template') || undefined;

    let name = point.getAttribute('data-name') || undefined;

    return {
      lat: +lat,
      long: +long,
      title,
      balloonContent,
      template,
      name
    };
  }

  protected _parseTemplate(elem: Element): PointTemplate {
    let name = elem.getAttribute('data-name'),
        imageUrl = elem.getAttribute('data-image-url'),
        imageWidth = elem.getAttribute('data-image-width'),
        imageHeight = elem.getAttribute('data-image-height'),
        imageAnchorX = elem.getAttribute('data-image-anchor-x'),
        imageAnchorY = elem.getAttribute('data-image-anchor-y');

    if (!name) {
      throw new Error('Invalid point template data: element should have a non-empty data-name attribute');
    }

    const checker = (x: string|null): number|undefined => {
      return x && !isNaN(+x) ? +x : undefined
    };

    return {
      name,
      imageUrl: imageUrl || undefined,
      imageWidth: checker(imageWidth),
      imageHeight: checker(imageHeight),
      imageAnchorX: checker(imageAnchorX),
      imageAnchorY: checker(imageAnchorY)
    };
  }

  protected abstract _panToPoint(point: PointData): void;
}

export class DummyMap extends Map {
  protected _panToPoint(point: PointData): void {
    // do nothing
  }
}

export const MapFactory = new ComponentFactory<Map, MapOptions>('map', DefaultOptions, DummyMap);
