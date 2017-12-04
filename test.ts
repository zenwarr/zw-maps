import { expect } from 'chai';
import { Map } from './index';

describe("map", function () {
  function init(html: string): void {
    document.body.innerHTML = html;
  }

  function elem(id: string): Element {
    return document.getElementById(id) as Element;
  }

  it('should init map', function () {
    init(`<div class="js-map" id="map"></div>`);

    let map = Map.initMap(elem('map'));
    expect(map).to.not.be.null;
    if (map) {
      expect(map.root).to.be.equal(elem('map'));
      expect(Map.fromRoot(elem('map'))).to.be.equal(map);
    }
  });
});
