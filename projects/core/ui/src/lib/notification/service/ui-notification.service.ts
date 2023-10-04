import { Injectable, inject } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { NotifierService } from 'angular-notifier';
import { NotifierNotificationOptions } from 'angular-notifier/lib/models/notifier-notification.model';

@Injectable()
export class UiNotificationService extends AbstractService {
  private readonly notifier: NotifierService =
    inject<NotifierService>(NotifierService);
  constructor() {
    super();
  }

  custom(notificationOptions: NotifierNotificationOptions): void {
    this.notifier.show(notificationOptions);
  }

  /**
   * Show a specific notification (with a custom notification ID)
   *
   * @param type    Notification type
   * @param message Notification message
   * @param id      Notification ID
   */
  protected notify(type: string, message: string, id?: string): void {
    this.notifier.notify(type, message, id);
  }

  public show(message: string, id?: string): void {
    this.notify('default', message, id);
  }

  public info(message: string, id?: string): void {
    this.notify('info', message, id);
  }

  public success(message: string, id?: string): void {
    this.notify('success', message, id);
  }

  public warning(message: string, id?: string): void {
    this.notify('warning', message, id);
  }

  public error(message: string, id?: string): void {
    this.notify('error', message, id);
  }

  /**
   * Hide all notifications at once
   */
  public hideAll(): void {
    this.notifier.hideAll();
  }

  /**
   * Hide newest notification
   */
  public hideNewest(): void {
    this.notifier.hideNewest();
  }

  /**
   * Hide oldest notification
   */
  public hideOldest(): void {
    this.notifier.hideOldest();
  }

  /**
   * Hide a specific notification (by a given notification ID)
   *
   * @param id Notification ID
   */
  public hide(id: string): void {
    this.notifier.hide(id);
  }

  public isVisibleDismissButton(): boolean {
    return this.notifier.getConfig().behaviour.showDismissButton;
  }
}
