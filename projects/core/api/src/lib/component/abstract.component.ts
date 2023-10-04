/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  isDevMode,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CodeValidatorService,
  LoggerService,
} from '@ng-techpromux-archetype-project/core-util';
import { Subject, Subscription } from 'rxjs';

@Component({
  template: '',
})
export abstract class AbstractComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked
{
  protected readonly __classname: string;

  protected readonly __isDevMode = isDevMode();

  protected __isFirstChange: boolean | null = null;

  protected readonly destroy$: Subject<boolean> = new Subject();

  // ---------------------------------------------------------------------

  private readonly __codeValidator: CodeValidatorService =
    inject<CodeValidatorService>(CodeValidatorService);

  private readonly __children: Map<string, Component> = new Map<
    string,
    Component
  >();

  private readonly __subscriptions: Subscription = new Subscription();

  protected readonly logger: LoggerService =
    inject<LoggerService>(LoggerService);

  protected cdr: ChangeDetectorRef =
    inject<ChangeDetectorRef>(ChangeDetectorRef);

  // ---------------------------------------------------------------------

  @Output() init: EventEmitter<Component> = new EventEmitter<Component>();

  @Output() destroy: EventEmitter<Component> = new EventEmitter<Component>();

  // ---------------------------------------------------------------------

  protected constructor() {
    this.__classname = this.constructor.name;

    this.__codeValidator.checkFunctionsCallsToSuperMethods(this, [
      'ngOnInit',
      'ngOnChanges',
      'ngOnDestroy',
      'ngAfterViewInit',
      'ngAfterViewChecked',
    ]);
  }

  // ---------------------------------------------------------------------

  ngOnInit(): void {
    this.onInitOrOnChanges(null);
    this.init.emit(this as Component);
  }

  /*
  protected onWindowWidthResized(): void {
  }
  */

  // ---------------------------------------------------------------------

  ngOnDestroy(): void {
    this.__subscriptions.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy.emit(this as Component);
  }

  // ---------------------------------------------------------------------

  ngOnChanges(changes: SimpleChanges): void {
    if (this.__isFirstChange === null) {
      this.__isFirstChange = true;
    } else if (this.__isFirstChange === true) {
      this.__isFirstChange = false;
      this.onInitOrOnChanges(changes);
    }
  }

  // ---------------------------------------------------------------------

  ngAfterViewInit(): void {
    //
  }

  // ---------------------------------------------------------------------

  ngAfterViewChecked(): void {
    //
  }

  // ---------------------------------------------------------------------

  onInitOrOnChanges(changes: SimpleChanges | null): void {
    //
  }

  // ---------------------------------------------------------------------

  protected addSubscription(subscription?: Subscription): Subscription {
    if (subscription) {
      this.__subscriptions.add(subscription);
    }
    return subscription as Subscription;
  }

  // ---------------------------------------------------------------------

  public registerChild(id: string, child: Component): void {
    if (this.__children.has(id)) {
      const error = 'Child with id [' + id + '] is already registered.';
      throw new Error(error);
    }
    this.__children.set(id, child);
  }

  public getRegisteredChild(id: string): Component | undefined {
    return this.__children.get(id);
  }

  // ---------------------------------------------------------------------
}
