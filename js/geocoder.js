import { NativeModules } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {
  apiKey: null,
  useGoogle: false,

  fallbackToGoogle(key) {
    this.apiKey = key;
  },

  enableGoogleGeocoder() {
    this.useGoogle = true;
  },

  //I will add new function to keep backward compatibility, but with more appropriate name
  setApiKey(key) {
    this.apiKey = key;
  },

  geocodePosition(position) {
    if (!position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    if (this.useGoogle) {
      return this.geocodeWithGoogle(position);
    } else {
      return RNGeocoder.geocodePosition(position).catch(err => {
        return this.geocodeWithGoogle(position);
      });
    }
  },

  geocodeWithGoogle(position) {
    if (!this.apiKey) { throw new Error("Google API key not set."); }
    return GoogleApi.geocodePosition(this.apiKey, position);
  },

  geocodeAddress(address) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    return RNGeocoder.geocodeAddress(address).catch(err => {
      if (!this.apiKey) { throw err; }
      return GoogleApi.geocodeAddress(this.apiKey, address);
    });
  },
}