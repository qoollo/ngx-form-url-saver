import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormUrlParams } from 'src/app/models/form-url-params';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { Subject } from 'rxjs';

interface PaymentForm {
    payments: FormArray<FormGroup<CardInfoForm>>;
}

interface CardInfoForm {
    cardType: FormControl<string | null>;
    cardNumber: FormControl<string | null>;
}

@Component({
    selector: 'app-second-page',
    templateUrl: './second-page.component.html',
    styleUrls: ['./second-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondPageComponent implements OnInit, OnDestroy {

    private readonly destroySubject = new Subject<boolean>();

    public readonly defaultParams: PaymentForm = {
        payments: this.fb.array([
            this.fb.group<CardInfoForm>({
                cardType: new FormControl(null),
                cardNumber: new FormControl(null),
            }),
        ]),
    };

    public paymentForm = this.fb.group<PaymentForm>(this.defaultParams);

    public get payments(): FormArray<FormGroup<CardInfoForm>> | null {
        return this.paymentForm.get('payments') as FormArray<FormGroup<CardInfoForm>>;
    }

    public readonly formUrlParamsObservable = this.formUrlSettings.formUrlParamsChangesObservable;

    constructor(
        private readonly formUrlSettings: FormUrlSettingsService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder,
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
        this.paymentForm.reset();
        await this.router.navigate([], { relativeTo: this.route });
    }

    public addNewPayment() {
        this.payments?.push(this.fb.group<CardInfoForm>({
            cardType: new FormControl(null),
            cardNumber: new FormControl(null),
        }));
    }

    public removePayment(idx: number) {
        this.payments?.removeAt(idx);
    }

}
