import lodash_assign = require('lodash.assign');

const DEF_INITIAL_ZOOM = 15;
const DEF_CENTER_LAT = 55.753742,
    DEF_CENTER_LONG = 37.620032;

const DEF_OPTIONS: MapOptions = {
  rootSelector: '.js-map',
  pointSelector: '.js-map__point',
  containerClass: 'js-map__map',
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
}

export interface MapOptions {
  rootSelector?: string;
  pointSelector?: string;
  containerClass?: string;
  initialZoom?: number;
  disableScrollZoom?: boolean;
}

export class Map {
  static init(options?: MapOptions, factory?: MapFactory): void {
    let rootSelector = options && options.rootSelector ? options.rootSelector : DEF_OPTIONS.rootSelector || '';
    let maps = document.querySelectorAll(rootSelector);
    for (let q = 0; q < maps.length; ++q) {
      this.initMap(maps[q] as Element, options, factory);
    }
  }

  static initMap(root: Element, options?: MapOptions, factory?: MapFactory): Map|null {
    return this.fromRoot(root) || (root ? (factory ? factory(root, options) : new Map(root, options)) : null);
  }

  static fromRoot(elem: Element): Map|null {
    return elem ? (elem as any).__hidden_map || null : null;
  }

  get root(): Element { return this._root; }

  get mapContainer(): Element { return this._mapContainer; }

  get initialCenter(): Coords|null { return this._initialCenter; }

  get initialZoom(): number { return this._initialZoom || this._options.initialZoom || DEF_INITIAL_ZOOM; }

  get points(): PointData[] { return this._points; }

  /** Protected area **/

  protected _root: Element;
  protected _mapContainer: Element;
  protected _initialCenter: Coords|null = null;
  protected _initialZoom: number|null = null;
  protected _points: PointData[] = [];
  protected _options: MapOptions;

  protected constructor(root: Element, options?: MapOptions) {
    this._options = assign(options || {}, DEF_OPTIONS) as MapOptions;
    this._root = root;
    (root as any).__hidden_map = this;

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
  }

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

    return {
      lat: +lat,
      long: +long,
      title,
      balloonContent
    };
  }
}

export type MapFactory = (root: Element, options?: MapOptions) => Map;

function assign<T>(...objs: T[]): T {
  if ((Object as any).assign) {
    return (Object as any).assign.apply(this, objs);
  } else {
    return lodash_assign.apply(this, objs);
  }
}

export interface YandexMapPointData extends PointData {
  placemark: ymaps.Placemark|null;
}

export class YandexMap extends Map {
  static init(options?: MapOptions): void {
    if (!(window as any).ymaps) {
      throw new Error('Yandex maps api is not detected, make sure you have plugged the scripts in');
    }

    ymaps.ready(() => {
      Map.init(options, (root, options) => new YandexMap(root, options));
    });
  }

  /** Protected area **/

  protected constructor(root: Element, options?: MapOptions) {
    super(root, options);

    if (this.mapContainer) {
      let center = this.initialCenter || { lat: DEF_CENTER_LAT, long: DEF_CENTER_LONG } as Coords;
      this._ymap = new ymaps.Map(this.mapContainer as HTMLElement, {
        center: [ center.lat, center.long ],
        zoom: this.initialZoom
      });

      if (this._options.disableScrollZoom) {
        this._ymap.behaviors.disable('scrollZoom');
      }

      for (let q = 0; q < this._points.length; ++q) {
        let point = this._points[q] as YandexMapPointData;
        this._addPlacemark(point);
      }
    }
  }

  protected _addPlacemark(point: YandexMapPointData): void {
    let placemark = new ymaps.Placemark([ point.lat, point.long ], {
      balloonContent: point.balloonContent || point.title,
      hintContent: point.title || ''
    });
    point.placemark = placemark;
    this._ymap.geoObjects.add(placemark);
  }

  protected _parsePoint(elem: Element): YandexMapPointData {
    let point = super._parsePoint(elem) as YandexMapPointData;
    point.placemark = null;
    return point;
  }

  protected _ymap: ymaps.Map;
}
