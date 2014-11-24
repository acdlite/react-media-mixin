react-media-mixin
=================

A React mixin to update state in response to media query events.

```
npm install --save react-media-mixin
```

Usage
-----

```jsx
var MediaMixin = require('react-media-mixin')

// Add some media queries.
MediaMixin.addMediaQueries({
  tablet: 'screen and (min-width:768)',
  desktop: 'screen and (min-width:1024)',
});

// Mixin to a component.
var MyComponent = React.createClass({
  mixins: [MediaMixin],
  
  render() {
    // Use `this.state.media`.
    // State will update whenever a media query matches or unmatches
    if (this.state.media.desktop) {
      return <div>Big screen</div>;
    }
    else if (this.state.media.tablet) {
      return <div>Medium screen</div>;
    }
    else {
      return <div>Small screen</div>;
    }
  }
});
```

## Requirements

[Like React](http://facebook.github.io/react/docs/working-with-the-browser.html#browser-support-and-polyfills), react-media-mixin uses `Object.keys`, which isn't supported in IE<9.

## License
MIT
