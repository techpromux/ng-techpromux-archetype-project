import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { inject, NgModule, Optional, SkipSelf } from '@angular/core';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    // ----------------
    // App Api Modules
    // ----------------
    //
    // ----------------
  ],
  providers: [
    // ----------------
    // App Api Providers
    // ----------------
    //
    // ----------------
  ],
  exports: [],
})
export class AppApiConfigModule {
  logger: LoggerService = inject<LoggerService>(LoggerService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppApiConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        'AppApiConfigModule is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('AppApiConfigModule', 'init');
  }
}
