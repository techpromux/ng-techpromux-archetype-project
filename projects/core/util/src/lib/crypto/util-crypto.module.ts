import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from './service/crypto.service';

@NgModule({
  imports: [CommonModule],
  providers: [CryptoService],
})
export class UtilCryptoModule {}
