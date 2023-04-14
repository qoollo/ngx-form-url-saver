import { SeparatedQueryGenerationStrategy } from './query-generation-strategies/separated-query-generation-strategy';
import { UnitedQueryGenerationStrategy } from './query-generation-strategies/united-query-generation-strategy';
import { QueryGenerationStrategy } from './query-generation-strategies/quey-generation-strategy.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Directive, forwardRef, Inject, Input, OnDestroy, Optional, Self } from '@angular/core';
import {
    AsyncValidator,
    AsyncValidatorFn,
    ControlContainer,
    FormGroupDirective,
    NG_ASYNC_VALIDATORS,
    NG_VALIDATORS,
    UntypedFormGroup,
    Validator,
    ValidatorFn,
} from '@angular/forms';
import { debounceTime, map, startWith, Subscription } from 'rxjs';
import { FORM_VALUE_HANDLING_TOKEN } from './form-value-handling-strategies/token';
import { ValueHandlingStrategy } from './form-value-handling-strategies/value-handling-strategy.interface';

const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormUrlSaverDirective),
};

/**
 * @description
 * Directive extends Angular `FormGroupDirective`
 * and uses sync `FormGroup` data with query-parameters.
 *
 * {@link https://github.com/angular/angular/blob/main/packages/forms/src/directives/reactive_directives/form_group_directive.ts Angular FormGroupDirective}
 *
 * - Allows to set debounce time to query update - `debounceTime`
 * - Can work in two query-parametres creation modes:
 *  1. `'separated'` - All form's fields will write in separate query-params by its names. E.g ?firstName="Hello"&secondName="World"
 *  2. `'united'` - All form will be write in one query parameter (with name `form` by default). E.g /?form=%7B"firstName":"","secondName":""%7D
 *
 * There is possibility to override default form's convert to string behavior.
 * By default used `JSON.stringify`.
   @see ValueHandlingStrategy
   @see FORM_VALUE_HANDLING_TOKEN
 */
@Directive({
    selector: '[ngxFormUrlSaver]',
    providers: [formDirectiveProvider],
})
export class FormUrlSaverDirective extends FormGroupDirective implements AfterViewInit, OnDestroy {

    private readonly BASE_DEBOUNCE_TIME = 500;

    @Input('ngxFormUrlSaver')
    public override form: UntypedFormGroup = null!;

    /**
     * Query time update debounce
     */
    @Input()
    public debounceTime = this.BASE_DEBOUNCE_TIME;

    /**
     * Query-parametres creation modes:
     *  1. `'separated'` - All form's fields will write in separate query-params by its names.
     *  2. `'united'` - All form will be write in one query parameter (with name `form` by default).
     */
    @Input()
    public strategy: 'united' | 'separated' = 'united';

    /**
     * Default query parameter for united strategy
     */
    @Input()
    public queryKey = 'form';

    private formValueChangedSubscription?: Subscription;

    private queryStrategy!: QueryGenerationStrategy;

    public constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,

        @Inject(FORM_VALUE_HANDLING_TOKEN)
        private readonly formHandlingStrategy: ValueHandlingStrategy,

        /**
         * Default Angular FormGroupDirective dependencies
         */
        @Optional() @Self() @Inject(NG_VALIDATORS)
        private readonly _validators: Array<(Validator | ValidatorFn)>,
        @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS)
        private readonly _asyncValidators: Array<(AsyncValidator | AsyncValidatorFn)>,
    ) {
        super(_validators, _asyncValidators);
    }

    // #region Lifecycle methods

    public ngAfterViewInit(): void {
        this.queryStrategy = this.createQueryGenerationStrategy();

        setTimeout(() => {
            this.fillFormFromQuery();
        })
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        this.formValueChangedSubscription?.unsubscribe();

        this.clearFormQuery();
    }

    // #endregion

    private fillFormFromQuery() {
        const currentQueryParams = this.activatedRoute.snapshot.queryParams;

        const inferedFormValue = this.queryStrategy.inferFormValueFromQuery(currentQueryParams, this.form.value);

        this.form.patchValue(inferedFormValue);

        this.subscribeToFormValueChanges();
    }

    private createQueryGenerationStrategy() {
        if (this.strategy === 'united') {
            return new UnitedQueryGenerationStrategy(this.formHandlingStrategy, this.queryKey);
        } else {
            return new SeparatedQueryGenerationStrategy(this.formHandlingStrategy);
        }
    }

    private subscribeToFormValueChanges() {
        this.formValueChangedSubscription = this.form.valueChanges.pipe(
            startWith(this.form.value),
            debounceTime(this.debounceTime),
            map((value, index) => [value, index] as const),
        ).subscribe(([value, index]) => {
            void this.router.navigate([], {
                queryParams: this.queryStrategy.convertFormValueToQueryObject(value),
                queryParamsHandling: 'merge',
                replaceUrl: index === 0,
            });
        });
    }

    private clearFormQuery() {
        setTimeout(() => {
            void this.router.navigate([], {
                queryParams: this.queryStrategy.createClearingObject(this.form.value),
                queryParamsHandling: 'merge',
                replaceUrl: true,
            });
        }, 0);
    }

}
