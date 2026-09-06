//$mobile: screen and (max-width: 767px)
//$tablet: screen and (max-width: 1024px)
//$tablet-interval: (min-width: 768px) and (max-width: 1024px)
//$desktop-m: screen and (max-width: 1399px)
//$desktop-m-interval: (min-width: 1025px) and (max-width: 1399px)
//$desktop-lg: screen and (min-width: 1400px)

import { Injectable } from '@angular/core';

@Injectable()
export class MediaHelper {
  isMobile = () => {
    return document.body.scrollWidth <= 767;
  };

  isTablet = (interval: boolean = false) => {
    return interval
      ? document.body.scrollWidth > 767 && document.body.scrollWidth <= 1024
      : document.body.scrollWidth <= 1024;
  };

  isDesktop = (interval: boolean = false) => {
    return interval
      ? document.body.scrollWidth > 1024 && document.body.scrollWidth <= 1399
      : document.body.scrollWidth <= 1399;
  };

  isDesktopLg = () => {
    return document.body.scrollWidth >= 1400;
  };
}
