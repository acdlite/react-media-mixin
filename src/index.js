'use strict';

var {EventEmitter} = require('events');

class Responsive extends EventEmitter {
  constructor(mediaQueries = {}) {
    this.state = {
      media: {},
    };

    this.mediaQueryLists = {};

    if (Responsive.supportsMatchMedia) {
      this.addMediaQueries(mediaQueries);
    }
  }

  addMediaQueries(mediaQueries) {
    Object.keys(mediaQueries).forEach(
      key => {
        this.mediaQueryLists[key] = {};

        var mediaQuery = mediaQueries[key];
        var mediaQueryList = matchMedia(mediaQuery);
        this.mediaQueryLists[key].mediaQueryList = mediaQueryList;

        // Create handler
        var handler = this.handleMediaChange.bind(this, key);
        this.mediaQueryLists[key].handler = handler;

        // Set intial value
        handler(mediaQueryList);

        // Listen for changes
        mediaQueryList.addListener(handler);
      });
  }

  setMediaQueryState(key, doesMatch, emitChange = true) {
    if (this.state.media[key] !== doesMatch) {
      this.state.media[key] = doesMatch;

      if (emitChange) {
        this.emit('change');
      }

      return true;
    }

    return false;
  }

  handleMediaChange(key, mediaQueryList = this.mediaQueryLists[key]) {
    this.setMediaQueryState(key, mediaQueryList.matches);
  }

  destroy() {
    Object.keys(this.mediaQueryLists).forEach(
      key => {
        var {mediaQueryList, handler} = this.mediaQueryLists[key];
        mediaQueryList.removeListener(handler);
      }
    );
  }

  getMediaState() {
    return this.state.media;
  }

  static supportsMatchMedia() {
    return window && typeof window.matchMedia === 'function';
  }
}

var responsive = new Responsive();

var MediaMixin = {
  getInitialState() {
    return {
      media: {},
    };
  },

  componentDidMount() {
    this.updateMediaState();
    responsive.addListener('change', this.updateMediaState);
  },

  componentWillUnmount() {
    responsive.removeListener('change', this.updateMediaState);
  },

  updateMediaState() {
    this.setState({
      media: responsive.getMediaState(),
    });
  },
};

exports = module.exports = MediaMixin;
exports.addMediaQueries = responsive.addMediaQueries.bind(responsive);
exports.destroy = responsive.destroy.bind(responsive);
