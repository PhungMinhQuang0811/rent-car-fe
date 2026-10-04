const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals: any) => {
      if (webVitals.getCLS) webVitals.getCLS(onPerfEntry);
      if (webVitals.getFID) webVitals.getFID(onPerfEntry);
      if (webVitals.getFCP) webVitals.getFCP(onPerfEntry);
      if (webVitals.getLCP) webVitals.getLCP(onPerfEntry);
      if (webVitals.getTTFB) webVitals.getTTFB(onPerfEntry);
      if (webVitals.onCLS) webVitals.onCLS(onPerfEntry);
      if (webVitals.onFID) webVitals.onFID(onPerfEntry);
      if (webVitals.onFCP) webVitals.onFCP(onPerfEntry);
      if (webVitals.onLCP) webVitals.onLCP(onPerfEntry);
      if (webVitals.onTTFB) webVitals.onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
