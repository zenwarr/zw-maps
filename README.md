# What it it?

A small helper library that provides a tiny layer of abstraction above different map widget libraries.
It supports Google Maps and Yandex Maps.
It does not encapsulates any complex features, and only allows to embed a map and display some markers.
But you can easily extend its classes and create anything you want using specific Google or Yandex api.

# Installation

```
npm i --save zw-maps
```

# Usage

```
const maps = require('zw-maps');

maps.MapFactory.init(maps.GoogleMap);
```

By default, all elements with class `js-map` are used as map roots.
All classes can be changed with options object.
Option object can have the following attributes:
`rootSelector`, `pointSelector`, `templateSelector`, `containerClass`, `initialZoom`.
The meaning of these properties is clear from names.
Note that properties ending with `selector` are CSS selector as passed to `querySelector` method, but `containerClass` (which defaults to `js-map__map`) isn't a selector, but a class name.
`disableScrollZoom` can be set to `true` (it is by default) to disable zooming a map with mouse wheel or to `false` to allow it.
`pointTemplates` can be used to define templates without encoding them in HTML.
This property' value should contain an array of `PointTemplate` objects (see below for info on templates).
TypeScript definition of `PointTemplate` follows:

```ts
interface PointTemplate {
  name: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
}
```

The purpose of its attributes is clear from names.

## MapFactory.init(mapType, options)

Initialize all maps in the document.
It is safe to call this function multiple times.

## MapFactory.initMap(mapType, root, options)

Initialize a single map with given root.

## Map.fromRoot(root)

Get map object for the DOM element.
If no map object found, returns null.

## map.panToPoint(pointName)

Call this function to pan the map to the point with given name.

# HTML layout

To create a map widget, you should have the following block in your html file:

```html
<div class="js-map">
  <ul class="js-map__points">
    <li class="js-map__point" data-lat="20.123" data-long="30.123" data-name="first point" data-title="Some place">Popup content</li>
    <li class="js-map__point" data-lat="20.123" data-long="33.123" data-name="second point" data-title="Some place">Popup content</li>
  </ul>
  <div class="js-map__map"></div>
</div>
```

Here, each `.js-map` block will become a container for a map.
The map widget itself will be rooted under `.js-map__map` element.
`.js-map__point` element describes which markers should be shown on the map.
You do not need to wrap `.js-map__point` elements with `.js-map__points`, but it is convenient in many cases.

## `js-map`

Root element.
Can have `data-lat` and `data-long` attributes that define coordinates of initial map center, and `data-zoom` that defines its initial zoom level.
If no initial center defined, the position of first placemark is used.

## `js-map__point`

Elements with this class contain information about placemarks (in term of Yandex Maps API) or markers (in terms of Google Maps API).
The only required attributes are `data-lat` and `data-long`, that describe respective coordinates.
HTML content inside this element is used as content of a balloon (Yandex) or a InfoWindow (Google) — a small popup that opens when user clicks on a placemark.

### `data-name`

The name for this placemark.
Used to access placemark data and to identify them in some methods.

### `data-title`

Placemark title.
Usually is shown when mouse is hovered over a placemark.

### `data-template`

Name of a template that should be used for creating the placemark.

## `js-map__map`

The element with this class is replaces with map widget.
You should not have more than one element with this class inside `js-map`.
If no element with this class exists inside a `js-map`, a new one is created and appended to `js-map` (so you do not have to write it explicitly).

## `js-map-template`

Templates are used to change marker properties.
For example, you can have two types of markers: with red and green icons on the same map.
To use a template, create a HTML element with class `js-map-template` inside `js-map` and add `data-template` attribute to points that should use this template.
Attributes for `js-map-template`:

### `data-name`

The only required attribute.
Template name.

### `data-image-url`

Icon to be used for marker.

### `data-image-width` and `data-image-height`

Image size.

### `data-image-offset-x` and `data-image-offset-y`

By default, icon is displayed with top-left corner positioned on a place where it belongs.
To shift icon, use offset.

# Styling

The library does not enforce any CSS styles for your blocks.
So, for the map widget to show up, you should set size for `.js-map__map` element (do not forget that in most cases it has zero height by default).

```css
.js-map__map {
  height: 200px;
}
```

Also, you may want to hide elements that provide data for map.
So you can have the following styles:

```css
.js-map__points {
  display: none;
}
```

