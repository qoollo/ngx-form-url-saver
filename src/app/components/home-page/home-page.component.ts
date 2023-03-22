import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormFields } from 'src/app/models/form-fields-type';
import { FormUrlParams } from 'src/app/models/form-url-params';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { Subject } from 'rxjs';

interface RegisterForm {
    firstName: string | null;
    secondName: string | null;
    age: number | null;
    email: string | null;
    phone: number | null;
    country: string | null;
    city: string | null;
    birth: Date | null;
}

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit, OnDestroy {

    private readonly destroySubject = new Subject<boolean>();

    public registerForm = this.fb.group<FormFields<RegisterForm>>({
        firstName: new FormControl(''),
        secondName: new FormControl(''),
        age: new FormControl(null),
        email: new FormControl(''),
        phone: new FormControl(null),
        country: new FormControl(''),
        city: new FormControl(''),
        birth: new FormControl(null),
    });

    public readonly formUrlParamsObservable = this.formUrlSettings.formUrlParamsChangesObservable;

    constructor(
        private readonly formUrlSettings: FormUrlSettingsService,
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {}

    public ngOnInit(): void {
        const storageParams = localStorage.getItem('ngx-params');

        if (storageParams) {
            const clearParams = JSON.parse(storageParams) as Partial<FormUrlParams>;

            this.formUrlSettings.patchParams(clearParams);
        }
    }

    public ngOnDestroy(): void {
        this.destroySubject.next(true);
    }

    public async reset() {
        this.registerForm.reset();
        await this.router.navigate([], { relativeTo: this.route });
    }

}
