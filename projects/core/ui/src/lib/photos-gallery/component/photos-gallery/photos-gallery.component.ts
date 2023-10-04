/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  DynamicFormArrayModel,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AbstractCoreUiComponent } from '../../../component/abstract-core-ui.component';

@Component({
  selector: 'techpromux-ui-photos-gallery',
  templateUrl: './photos-gallery.component.html',
  styleUrls: ['./photos-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosGalleryComponent
  extends AbstractCoreUiComponent
  implements OnInit
{
  @Input() editable = false;

  @Input() context!: DynamicFormArrayModel;

  @Input() group!: DynamicInputModel[];

  @Input() index!: number;

  @Input() id = 'photos_gallery';

  @Input() header: string | null = null;

  @Input() photos: any[] = [];

  @Input() container_class = '';

  @Input() img_container_width_editable = '115px';

  @Input() img_container_width_no_editable = '115px';

  @Input() img_container_height_editable = '115px';

  @Input() img_container_height_no_editable = '115px';

  @Input() img_container_class =
    'position-relative float-start text-center d-flex flex-column border rounded rounded-2 pt-2 pb-2 me-3 mt-2 mb-2';

  @Input() img_container_remove_btn_class = 'position-absolute top-0 start-100';

  @Input() img_container_remove_btn_style =
    'transform: translate(-75%, -55%) !important';

  @Input() img_width = '95px';

  @Input() img_height = '95px';

  @Input() imageStoreBasePath = './';

  constructor() {
    super();
  }

  override onInitOrOnChanges(changes: SimpleChanges | null): void {
    if (this.group && this.id) {
      const find = this.group.find((item) => item.id === this.id);
      if (find) {
        this.addSubscription(
          find.valueChanges
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(() => {
              this.photos = find?.value as any[];
              this.cdr.detectChanges();
            })
        );
      }
    }
  }

  protected addFromGallery(event: any): void {
    Camera.pickImages({
      quality: 90,
    }).then((result) => {
      result.photos.forEach((photo) => {
        fetch(photo.webPath)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result;

              const find = this.group.find((item) => item.id === this.id);

              if (find) {
                find.value = [
                  ...(find.value as any[]),
                  {
                    format: photo.format,
                    url: base64data,
                    saved: false,
                  },
                ];
              }
            };
          });
      });
    });
  }

  protected addFromCamera(event: any): void {
    Camera.getPhoto({
      saveToGallery: false,
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      // resultType: CameraResultType.DataUrl,
    }).then((photo) => {
      const find = this.group.find((item) => item.id === this.id);

      if (find) {
        find.value = [
          ...(find.value as any[]),
          {
            format: photo.format,
            url: 'data:image/' + photo.format + ';base64,' + photo.base64String,
            saved: false,
          },
        ];
      }
    });
  }

  protected removeFromModel(index: number): void {
    const find = this.group.find((item) => item.id === this.id);
    if (find) {
      let value: any[] = find.value as any[];
      if (!value) {
        value = [];
      }
      value = value.filter((item: any, i: number) => i !== index);
      find.value = value;
    }
  }
}
