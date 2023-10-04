/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export class ElementsResizeObserverService {
  protected static readonly __classname: string =
    'ElementsResizeObserverService';

  private static getResizeObserverFor(
    query: string,
    isMultiple: boolean = true
  ): Observable<any> {
    const subject: BehaviorSubject<any> = new BehaviorSubject<any>({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
    });

    const selector = !isMultiple
      ? document.querySelector(query)
      : document.querySelectorAll(query);

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let observedDetected: boolean = false;

    const observer = new ResizeObserver((entries) => {
      if (observedDetected && !subject.observed) {
        /*Logger.debug(
          this.__classname,
          query,
          'observer.disconnect() && subject.complete()'
        );*/
        observer.disconnect();
        subject.complete();
        return;
      }
      if (!observedDetected && subject.observed) {
        // Logger.debug(this.__classname, 'observedDetected', true);
        observedDetected = true;
      }
      if (observedDetected) {
        /*Logger.debug(
          this.__classname,
          query,
          !isMultiple ? entries[0] : entries
        );*/
      }
      subject.next(
        !isMultiple
          ? entries[0]?.contentRect
          : entries.map((entry) => entry.contentRect)
      );
    });

    if (selector) {
      if (selector instanceof Element) {
        observer.observe(selector, {
          // box: 'content-box',
        });
      } else {
        selector.forEach((element) => {
          observer.observe(element, {
            // box: 'content-box',
          });
        });
      }
    }

    return subject.asObservable();
  }

  public static getBodyResizeObserver(): Observable<any> {
    return ElementsResizeObserverService.getResizeObserverFor('body', false);
  }

  public static getBodyResizeSubscription(
    fn: (data: any) => void
  ): Subscription {
    return ElementsResizeObserverService.getBodyResizeObserver().subscribe(fn);
  }

  public static getElementsResizeObserverService(
    query: string,
    isMultiple: boolean = true
  ): Observable<any> {
    return ElementsResizeObserverService.getResizeObserverFor(
      query,
      isMultiple
    );
  }

  public static getElementsResizeSubscription(
    query: string,
    isMultiple: boolean = true,
    fn: (data: any) => void
  ): Subscription {
    return ElementsResizeObserverService.getElementsResizeObserverService(
      query,
      isMultiple
    ).subscribe(fn);
  }

  public static hasMobileSize(): boolean {
    return window.innerWidth < 576;
  }

  public static hasTabletSize(): boolean {
    return 576 <= window.innerWidth && window.innerWidth < 768;
  }

  public static hasDesktopSize(): boolean {
    return 768 <= window.innerWidth;
  }

  public static isXSmall(): boolean {
    return window.innerWidth < 576;
  }

  public static isSmall(): boolean {
    return 576 <= window.innerWidth && window.innerWidth < 768;
  }

  public static isMedium(): boolean {
    return 768 <= window.innerWidth && window.innerWidth < 992;
  }

  public static isLarge(): boolean {
    return 992 <= window.innerWidth && window.innerWidth < 1200;
  }

  public static isXLarge(): boolean {
    return 1200 <= window.innerWidth && window.innerWidth < 1400;
  }

  public static isXXLarge(): boolean {
    return 1400 <= window.innerWidth;
  }
}
