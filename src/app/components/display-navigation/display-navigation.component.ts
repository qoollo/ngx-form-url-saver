import { BehaviorSubject } from 'rxjs';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
    selector: 'app-display-navigation',
    templateUrl: './display-navigation.component.html',
    styleUrls: ['./display-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayNavigationComponent {

    private readonly codec = new HttpUrlEncodingCodec();

    public readonly urlBehaviorSubject = new BehaviorSubject<string>('');

    public readonly urlObservable = this.urlBehaviorSubject.asObservable();

    constructor(
        private readonly location: Location,
    ) {
        this.location.onUrlChange(url => {
            const decodedUrl = this.codec.decodeValue(url);

            this.urlBehaviorSubject.next(decodedUrl);
        });
    }

}
