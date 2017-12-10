import { expect } from 'chai';
import {Coords, DummyMap, Map, MapFactory, PointData, PointTemplate, YandexMap} from './index';

describe("map", function () {
  function init(html: string): void {
    document.body.innerHTML = html;
  }

  function elem(id: string): Element {
    return document.getElementById(id) as Element;
  }

  it('should init map', function () {
    init(`<div class="js-map" id="map"></div>`);

    let map = MapFactory.initMap(DummyMap, elem('map'));
    expect(map).to.not.be.null;
    expect(map.root).to.be.equal(elem('map'));
    expect(Map.fromRoot(elem('map'))).to.be.equal(map);
    expect(map.mapContainer).to.exist;
  });

  it('should parse map params', function () {
    init(`<div data-lat="50" data-long="30" data-zoom="10" id="map"></div>`);

    let map = MapFactory.initMap(DummyMap, elem('map'));
    expect(map.initialCenter).to.be.deep.equal({
      lat: 50,
      long: 30
    } as Coords);
    expect(map.initialZoom).to.be.equal(10);
  });

  it('should parse points', function () {
    init(`<div id="map">
      <div class="js-map__point" data-lat="10" data-long="15" data-title="some title">Balloon <span>content</span></div>
    </div>`);

    let map = MapFactory.initMap(DummyMap, elem('map'));
    expect(map.points).to.be.deep.equal([
      {
        lat: 10,
        long: 15,
        title: 'some title',
        balloonContent: 'Balloon <span>content</span>',
        template: undefined,
        name: undefined
      }
    ] as PointData[]);
  });

  it('should get points by name', function () {
    init(`<div id="map">
      <div class="js-map__point" data-lat="10" data-long="20" data-name="first"></div>
      <div class="js-map__point" data-lat="30" data-long="40" data-name="second"></div>
    </div>`);

    let map = MapFactory.initMap(DummyMap, elem('map'));
    expect(map.points).to.have.lengthOf(2);
    expect(map.getPoint('first')).to.have.property('name', 'first');
    expect(map.getPoint('first')).to.have.property('lat', 10);
    expect(map.getPoint('second')).to.have.property('name', 'second');
    expect(map.getPoint('third')).to.be.null;
  });

  it('should parse template', function () {
    init(`<div id="map">
      <div class="js-map__point-template" data-name="custom" data-image-url="/image.png" data-image-width="10" data-image-height="30"
          data-image-offset-x="4" data-image-offset-y="5"></div>
      <div class="js-map__point" data-template="custom" data-lat="10" data-long="10"></div>
    </div>`);

    let map = MapFactory.initMap(DummyMap, elem('map'));
    expect(map.pointTemplates).to.be.deep.equal([
      {
        name: 'custom',
        imageUrl: '/image.png',
        imageWidth: 10,
        imageHeight: 30,
        imageOffsetX: 4,
        imageOffsetY: 5
      }
    ] as PointTemplate[]);
    expect(map.getPointTemplate('custom')).to.exist;

    let point = map.points[0];
    expect(point.template).to.be.equal('custom');
  });
});
