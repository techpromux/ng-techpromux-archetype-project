import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeValidatorService } from './service/code-validator.service';

@NgModule({
  imports: [CommonModule],
  providers: [CodeValidatorService],
})
export class UtilCodeModule {}
