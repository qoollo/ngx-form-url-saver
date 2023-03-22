import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormFields } from 'src/app/models/form-fields-type';
import { FormUrlParams } from 'src/app/models/form-url-params';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { map, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-form-url-settings',
    templateUrl: './form-url-settings.component.html',
    styleUrls: ['./form-url-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUrlSettingsComponent implements OnInit, OnDestroy {

    private readonly destroySubject = new Subject<boolean>();

    public readonly formStrategies: string [] = ['united', 'separated'];

    public readonly shouldReloadSubject = new Subject<boolean>();

    public trackingStrategy: TrackByFunction<string> = idx => idx;

    public formParams = this.fb.group<FormFields<FormUrlParams>>({
        debounceTime: new FormControl(this.formUrlSettings.DEFAULT_UPDATE_TIME, { nonNullable: true }),
        queryKey: new FormControl(this.formUrlSettings.DEFAULT_QUERY_KEY, { nonNullable: true }),
        strategy: new FormControl(this.formUrlSettings.DEFAULT_STRATEGY, { nonNullable: true }),
    });


    constructor(
        private readonly fb: FormBuilder,
        private readonly formUrlSettings: FormUrlSettingsService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {}

    public ngOnInit() {
        const storageParams = localStorage.getItem('ngx-params');

        if (storageParams) {
            const clearParams = JSON.parse(storageParams) as Partial<FormUrlParams>;

            this.formParams.patchValue(clearParams);
        }

        this.formParams.valueChanges
            .pipe(
                map(params => this.handleParams(params)),
                tap(params => {
                    localStorage.setItem('ngx-params', JSON.stringify(params));
                }),
                tap(params => { this.formUrlSettings.patchParams(params); }),
                takeUntil(this.destroySubject),
            ).subscribe();

        this.shouldReloadSubject.asObservable().pipe(
            tap(() => this.reload()),
            takeUntil(this.destroySubject),
        )
            .subscribe();
    }

    public async reload() {

        // eslint-disable-next-line @typescript-eslint/unbound-method
        const oldStrategy = this.router.routeReuseStrategy.shouldReuseRoute;

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        await this.router.navigate([], { relativeTo: this.route, onSameUrlNavigation: 'reload' });

        this.router.routeReuseStrategy.shouldReuseRoute = oldStrategy;

    }


    // eslint-disable-next-line complexity
    public handleParams(params: Partial<FormUrlParams>): Partial<FormUrlParams> {

        const handledParams: Partial<FormUrlParams> = {};

        if (params.strategy && params.strategy !== this.formUrlSettings.params.strategy) {
            handledParams.strategy = params.strategy;
        }

        if (params.queryKey && params.queryKey !== this.formUrlSettings.params.queryKey) {
            handledParams.queryKey = params.queryKey;
        }

        if (params.debounceTime) {
            const oldDebounceTime = this.formUrlSettings.params.debounceTime;

            const newDebounceTime = parseInt(`${params.debounceTime}`, 10);


            if (oldDebounceTime !== newDebounceTime) {
                handledParams.debounceTime = newDebounceTime;
            }
        }

        this.shouldReloadSubject.next(true);

        return handledParams;
    }

    public ngOnDestroy() {
        this.destroySubject.next(true);
    }

}
