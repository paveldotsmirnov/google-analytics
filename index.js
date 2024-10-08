import { platform } from '@haensl/services';

// European Union
export const regionEU = [
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'ES', // Spain
  'SE' // Sweden
];

export const regionConsent = [
  'CH', // Switzerland
  'UK' // United Kingdom
] + regionEU;

export const set = (params) => {
  // https://developers.google.com/tag-platform/gtagjs/reference#set
  if (!platform.hasWindow) {
    const error = new Error('Cannot use client lib without window.');
    throw error;
  }

  if (typeof window.gtag !== 'function') {
    throw new Error('gtag is not available on the window object.');
  }

  if (typeof params !== 'object' || params === null) {
    throw new TypeError('Invalid argument: params must be a non-null object.');
  }

  window.gtag('set', params);
};

export const install = () => {
  if (platform.hasWindow) {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    if (!window.gtag) {
      window.gtag = function() {
        window.dataLayer.push(arguments); // eslint-disable-line
      };
    }

    window.gtag('js', new Date());
  }
};

export const init = ({
  measurementId,
  debug = false,
  anonymizeIp = true,
  sendPageViews = false,
  trackingConsent = false
} = {}) => {
  if (!platform.hasWindow) {
    const error = new Error('Cannot use client lib without window.');
    throw error;
  }

  install();

  window.gtag('config', measurementId, {
    anonymize_ip: anonymizeIp,
    debug_mode: debug,
    send_page_view: sendPageViews
  });

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    region: regionConsent
  });

  consent(trackingConsent);
};

export const consent = (granted = false) => {
  if (!platform.hasWindow) {
    const error = new Error('Cannot use client lib without window.');
    throw error;
  }

  if (granted === true || granted === 'true') {
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted'
    });

    set({
      allow_google_signals: true,
      allow_ad_personalization_signals: true,
      restriced_data_processing: false,
      ads_data_redaction: false
    });
  } else {
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied'
    });

    set({
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      restriced_data_processing: true,
      ads_data_redaction: true
    });
  }
};

export const event = ({ name, params }) => {
  if (!platform.hasWindow) {
    const error = new Error('Cannot use client lib without window.');
    throw error;
  }

  window.gtag('event', name, params);
};

export const setUserProperty = ({ name, value }) => {
  if (!platform.hasWindow) {
    const error = new Error('Cannot use client lib without window.');
    throw error;
  }

  set({
    user_properties: {
      [name]: value
    }
  });
};

export const setUserId = ({ id }) => {
  if (!platform.hasWindow) {
    const error = new Error('Cannot use client lib without window.');
    throw error;
  }

  set({
    user_id: id
  });
};

export const exception = ({ description, fatal = false }) => {
  event({
    name: 'exception',
    params: {
      description,
      fatal
    }
  });
};

export const pageView = ({ location, title }) => {
  event({
    name: 'page_view',
    params: {
      page_title: title,
      page_location: location
    }
  });
};

export default {
  init,
  set,
  install,
  consent,
  event,
  exception,
  pageView,
  setUserId,
  setUserProperty
};
