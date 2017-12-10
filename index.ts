import lodash_assign = require('lodash.assign');

const DEF_INITIAL_ZOOM = 15;
const DEF_CENTER_LAT = 55.753742,
    DEF_CENTER_LONG = 37.620032;

const DEF_OPTIONS: MapOptions = {
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

export abstract class Map {
  constructor(root: Element, options?: MapOptions) {
    this._options = assign(options || {}, DEF_OPTIONS) as MapOptions;
    this._root = root;
    if ((root as any).__hidden_map) {
      throw new Error('Cannot construct a map on the same object twice');
    }
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

  static fromRoot(elem: Element): Map|null {
    return elem ? (elem as any).__hidden_map || null : null;
  }

  get root(): Element { return this._root; }

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

  protected _root: Element;
  protected _mapContainer: Element;
  protected _initialCenter: Coords|null = null;
  protected _initialZoom: number|null = null;
  protected _points: PointData[] = [];
  protected _options: MapOptions;

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
        imageOffsetX = elem.getAttribute('data-image-offset-x'),
        imageOffsetY = elem.getAttribute('data-image-offset-y');

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
      imageOffsetX: checker(imageOffsetX),
      imageOffsetY: checker(imageOffsetY)
    };
  }

  protected abstract _panToPoint(point: PointData): void;
}

export interface MapType {
  new (root: Element, options?: MapOptions): Map;
}

export abstract class MapFactory {
  static init(mapType: MapType, options?: MapOptions): void {
    let rootSelector = options && options.rootSelector ? options.rootSelector : DEF_OPTIONS.rootSelector || '';
    let maps = document.querySelectorAll(rootSelector);
    for (let q = 0; q < maps.length; ++q) {
      this.initMap(mapType, maps[q] as Element, options);
    }
  }

  static initMap(mapType: MapType, root: Element, options?: MapOptions): Map {
    return Map.fromRoot(root) || new mapType(root, options);
  }
}

function assign<T>(...objs: T[]): T {
  if ((Object as any).assign) {
    return (Object as any).assign.apply(this, objs);
  } else {
    return lodash_assign.apply(this, objs);
  }
}

export class DummyMap extends Map {
  protected _panToPoint(point: PointData): void {
    // do nothing
  }
}

export interface YandexMapPointData extends PointData {
  placemark: ymaps.Placemark|null;
}

export class YandexMap extends Map {
  constructor(root: Element, options?: MapOptions) {
    super(root, options);

    if (!(window as any).ymaps) {
      throw new Error('Yandex maps api is not detected, make sure you have plugged the scripts in');
    }

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

  /** Protected area **/

  protected _addPlacemark(point: YandexMapPointData): void {
    let layout: any = undefined;
    if (point.template) {
      let templ = this.getPointTemplate(point.template);
      if (templ && templ.imageUrl && templ.imageHeight && templ.imageWidth) {
        layout = {
          iconLayout: 'default#image',
          iconImageHref: templ.imageUrl,
          iconImageSize: [ templ.imageWidth, templ.imageHeight ],
          iconImageOffset: [ templ.imageOffsetX, templ.imageOffsetY ]
        }
      }
    }

    let placemark = new ymaps.Placemark([ point.lat, point.long ], {
      balloonContent: point.balloonContent || point.title,
      hintContent: point.title || ''
    }, layout);
    point.placemark = placemark;
    this._ymap.geoObjects.add(placemark);
  }

  protected _parsePoint(elem: Element): YandexMapPointData {
    let point = super._parsePoint(elem) as YandexMapPointData;
    point.placemark = null;
    return point;
  }

  protected _panToPoint(point: YandexMapPointData): void {
    if (point) {
      this._ymap.panTo([point.lat, point.long]);
    }
  }

  protected _ymap: ymaps.Map;
}

export interface GoogleMapPointData extends PointData {
  marker: google.maps.Marker|null;
  infoWindow: google.maps.InfoWindow|null;
}

export class GoogleMap extends Map {
  constructor(root: Element, options?: MapOptions) {
    super(root, options);

    if (!(window as any).google || !google.maps) {
      throw new Error('Google maps api is not detected, make sure you have plugged the scripts in');
    }

    if (this.mapContainer) {
      let center = this.initialCenter as Coords;
      this._gmap = new google.maps.Map(this.mapContainer, {
        center: {
          lat: center.lat,
          lng: center.long
        },
        zoom: this.initialZoom,
        scrollwheel: !this._options.disableScrollZoom
      });

      for (let q = 0; q < this._points.length; ++q) {
        let point = this._points[q] as GoogleMapPointData;
        this._addMarker(point);
      }
    }
  }

  /** Protected area **/

  protected _addMarker(point: GoogleMapPointData): void {
    point.marker = new google.maps.Marker({
      position: {
        lat: point.lat,
        lng: point.long
      },
      map: this._gmap,
      title: point.title
    });

    if (point.balloonContent) {
      point.infoWindow = new google.maps.InfoWindow({
        content: point.balloonContent
      });
      point.marker.addListener('click', () => {
        if (point.infoWindow && point.marker) {
          point.infoWindow.open(this._gmap, point.marker);
        }
      });
    }
  }

  protected _parsePoint(elem: Element): GoogleMapPointData {
    let point = super._parsePoint(elem) as GoogleMapPointData;
    point.marker = null;
    point.infoWindow = null;
    return point;
  }

  protected _panToPoint(point: GoogleMapPointData): void {
    if (point && this._gmap) {
      this._gmap.panTo(new google.maps.LatLng(point.lat, point.long));
    }
  }

  protected _gmap: google.maps.Map;
}
