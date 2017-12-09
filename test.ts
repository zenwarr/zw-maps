import { expect } from 'chai';
import {Coords, Map, PointData} from './index';

describe("map", function () {
  function init(html: string): void {
    document.body.innerHTML = html;
  }

  function elem(id: string): Element {
    return document.getElementById(id) as Element;
  }

  it('should init map', function () {
    init(`<div class="js-map" id="map"></div>`);

    let map = Map.initMap(elem('map')) as Map;
    expect(map).to.not.be.null;
    expect(map.root).to.be.equal(elem('map'));
    expect(Map.fromRoot(elem('map'))).to.be.equal(map);
    expect(map.mapContainer).to.exist;
  });

  it('should parse map params', function () {
    init(`<div data-lat="50" data-long="30" data-zoom="10" id="map"></div>`);

    let map = Map.initMap(elem('map')) as Map;
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

    let map = Map.initMap(elem('map')) as Map;
    expect(map.points).to.be.deep.equal([
      {
        lat: 10,
        long: 15,
        title: 'some title',
        balloonContent: 'Balloon <span>content</span>'
      }
    ] as PointData[]);
  });
});
