import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UtilCryptoModule } from '../crypto/util-crypto.module';
import { UtilStorageLocalService } from './service/util-storage-local.service';

@NgModule({
  imports: [CommonModule, UtilCryptoModule],
  providers: [UtilStorageLocalService],
})
export class UtilStorageLocalModule {}
