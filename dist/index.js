!function(t,e){for(var n in e)t[n]=e[n]}(exports,function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,n){"use strict";var o=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),i=55.753742,a=37.620032,l={rootSelector:".js-map",pointSelector:".js-map__point",containerClass:"js-map__map",templateSelector:".js-map__point-template",initialZoom:15,disableScrollZoom:!0},u=function(){function t(t,e){this._initialCenter=null,this._initialZoom=null,this._points=[],this._options=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return Object.assign?Object.assign.apply(this,t):r.apply(this,t)}(e||{},l),this._root=t,t.__hidden_map=this;var n=this._root.querySelector("."+this._options.containerClass||"");n||((n=document.createElement("div")).classList.add(this._options.containerClass||""),this._root.appendChild(n)),this._mapContainer=n,this._parseMap();for(var o=this._root.querySelectorAll(this._options.pointSelector),i=0;i<o.length;++i)try{this._points.push(this._parsePoint(o[i]))}catch(t){console.warn("Error while processing point element",o[i],": ",t)}if(this._options.templateSelector)for(var a=this._root.querySelectorAll(this._options.templateSelector),i=0;i<a.length;++i)try{var u=this._parseTemplate(a[i]);this._options.pointTemplates?this._options.pointTemplates.push(u):this._options.pointTemplates=[u]}catch(t){console.warn("Error while processing template element",a[i],": ",t)}}return t.init=function(t,e){for(var n=t&&t.rootSelector?t.rootSelector:l.rootSelector||"",o=document.querySelectorAll(n),r=0;r<o.length;++r)this.initMap(o[r],t,e)},t.initMap=function(e,n,o){return this.fromRoot(e)||(e?o?o(e,n):new t(e,n):null)},t.fromRoot=function(t){return t?t.__hidden_map||null:null},Object.defineProperty(t.prototype,"root",{get:function(){return this._root},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"mapContainer",{get:function(){return this._mapContainer},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"initialCenter",{get:function(){return this._initialCenter},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"initialZoom",{get:function(){return this._initialZoom||this._options.initialZoom||15},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"points",{get:function(){return this._points},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"pointTemplates",{get:function(){return this._options.pointTemplates||[]},enumerable:!0,configurable:!0}),t.prototype.getPointTemplate=function(t){if(this._options.pointTemplates)for(var e=this._options.pointTemplates,n=0;n<e.length;++n)if(e[n].name===t)return e[n];return null},t.prototype.getPoint=function(t){if(!t)return null;for(var e=0;e<this._points.length;++e)if(this._points[e].name===t)return this._points[e];return null},t.prototype.panToPoint=function(t){var e=this.getPoint(t);e&&this._panToPoint(e)},t.prototype._parseMap=function(){var t=this._root.getAttribute("data-lat"),e=this._root.getAttribute("data-long");t&&e&&!isNaN(+t)&&!isNaN(+e)&&(this._initialCenter={lat:+t,long:+e});var n=this._root.getAttribute("data-zoom");n&&!isNaN(+n)&&(this._initialZoom=+n)},t.prototype._parsePoint=function(t){var e=t.getAttribute("data-lat"),n=t.getAttribute("data-long");if(!e||!n||isNaN(+e)||isNaN(+n))throw new Error("Broken coordinates, please provide data-lat and data-long attributes");return{lat:+e,long:+n,title:t.getAttribute("data-title")||t.getAttribute("title")||void 0,balloonContent:t.innerHTML||void 0,template:t.getAttribute("data-template")||void 0,name:t.getAttribute("data-name")||void 0}},t.prototype._parseTemplate=function(t){var e=t.getAttribute("data-name"),n=t.getAttribute("data-image-url"),o=t.getAttribute("data-image-width"),r=t.getAttribute("data-image-height"),i=t.getAttribute("data-image-offset-x"),a=t.getAttribute("data-image-offset-y");if(!e)throw new Error("Invalid point template data: element should have a non-empty data-name attribute");var l=function(t){return t&&!isNaN(+t)?+t:void 0};return{name:e,imageUrl:n||void 0,imageWidth:l(o),imageHeight:l(r),imageOffsetX:l(i),imageOffsetY:l(a)}},t.prototype._panToPoint=function(t){},t}();e.Map=u;var p=function(t){function e(e,n){var o=t.call(this,e,n)||this;if(o.mapContainer){var r=o.initialCenter||{lat:i,long:a};o._ymap=new ymaps.Map(o.mapContainer,{center:[r.lat,r.long],zoom:o.initialZoom}),o._options.disableScrollZoom&&o._ymap.behaviors.disable("scrollZoom");for(var l=0;l<o._points.length;++l){var u=o._points[l];o._addPlacemark(u)}}return o}return o(e,t),e.init=function(t){if(!window.ymaps)throw new Error("Yandex maps api is not detected, make sure you have plugged the scripts in");ymaps.ready(function(){u.init(t,function(t,n){return new e(t,n)})})},e.prototype._addPlacemark=function(t){var e=void 0;if(t.template){var n=this.getPointTemplate(t.template);n&&n.imageUrl&&n.imageHeight&&n.imageWidth&&(e={iconLayout:"default#image",iconImageHref:n.imageUrl,iconImageSize:[n.imageWidth,n.imageHeight],iconImageOffset:[n.imageOffsetX,n.imageOffsetY]})}var o=new ymaps.Placemark([t.lat,t.long],{balloonContent:t.balloonContent||t.title,hintContent:t.title||""},e);t.placemark=o,this._ymap.geoObjects.add(o)},e.prototype._parsePoint=function(e){var n=t.prototype._parsePoint.call(this,e);return n.placemark=null,n},e.prototype._panToPoint=function(t){t&&this._ymap.panTo([t.lat,t.long])},e}(u);e.YandexMap=p},function(t,e){function n(t,e){var n=j(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&l(t)}(t)&&d.call(t,"callee")&&(!v.call(t,"callee")||_.call(t)==c)}(t)?function(t,e){for(var n=-1,o=Array(t);++n<t;)o[n]=e(n);return o}(t.length,String):[],o=n.length,i=!!o;for(var a in t)!e&&!d.call(t,a)||i&&("length"==a||r(a,o))||n.push(a);return n}function o(t,e,n){var o=t[e];d.call(t,e)&&a(o,n)&&(void 0!==n||e in t)||(t[e]=n)}function r(t,e){return!!(e=null==e?s:e)&&("number"==typeof t||h.test(t))&&t>-1&&t%1==0&&t<e}function i(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||g)}function a(t,e){return t===e||t!=t&&e!=e}function l(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=s}(t.length)&&!function(t){var e=u(t)?_.call(t):"";return e==f||e==m}(t)}function u(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function p(t){return l(t)?n(t):function(t){if(!i(t))return y(t);var e=[];for(var n in Object(t))d.call(t,n)&&"constructor"!=n&&e.push(n);return e}(t)}var s=9007199254740991,c="[object Arguments]",f="[object Function]",m="[object GeneratorFunction]",h=/^(?:0|[1-9]\d*)$/,g=Object.prototype,d=g.hasOwnProperty,_=g.toString,v=g.propertyIsEnumerable,y=function(t,e){return function(n){return t(e(n))}}(Object.keys,Object),b=Math.max,O=!v.call({valueOf:1},"valueOf"),j=Array.isArray,P=function(t){return function(t,e){return e=b(void 0===e?t.length-1:e,0),function(){for(var n=arguments,o=-1,r=b(n.length-e,0),i=Array(r);++o<r;)i[o]=n[e+o];o=-1;for(var a=Array(e+1);++o<e;)a[o]=n[o];return a[e]=i,function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}(t,this,a)}}(function(e,n){var o=-1,i=n.length,p=i>1?n[i-1]:void 0,s=i>2?n[2]:void 0;for(p=t.length>3&&"function"==typeof p?(i--,p):void 0,s&&function(t,e,n){if(!u(n))return!1;var o=typeof e;return!!("number"==o?l(n)&&r(e,n.length):"string"==o&&e in n)&&a(n[e],t)}(n[0],n[1],s)&&(p=i<3?void 0:p,i=1),e=Object(e);++o<i;){var c=n[o];c&&t(e,c,o,p)}return e})}(function(t,e){if(O||i(e)||l(e))!function(t,e,n,r){n||(n={});for(var i=-1,a=e.length;++i<a;){var l=e[i],u=r?r(n[l],t[l],l,n,t):void 0;o(n,l,void 0===u?t[l]:u)}}(e,p(e),t);else for(var n in e)d.call(e,n)&&o(t,n,e[n])});t.exports=P}]));