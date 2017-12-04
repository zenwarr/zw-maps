export const DEF_MAP_SELECTOR = '.js-map';

export class Map {
  static init(selector: string = DEF_MAP_SELECTOR): void {
    let maps = document.querySelectorAll(selector);
    for (let q = 0; q < maps.length; ++q) {
      this.initMap(maps[q] as Element);
    }
  }

  static initMap(root: Element): Map|null {
    return this.fromRoot(root) || (root ? new Map(root) : null);
  }

  static fromRoot(elem: Element): Map|null {
    return elem ? (elem as any).__hidden_map || null : null;
  }

  get root(): Element { return this._root; }

  /** Protected area **/

  protected _root: Element;

  protected constructor(root: Element) {
    this._root = root;
    (root as any).__hidden_map = this;
  }
}
