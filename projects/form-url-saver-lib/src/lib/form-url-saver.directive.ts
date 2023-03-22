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
 * Директива является наследником Angular `FormGroupDirective`
 * и используется для автоматической записи значения `FormGroup` в query-параметры.
 *
 * {@link https://github.com/angular/angular/blob/main/packages/forms/src/directives/reactive_directives/form_group_directive.ts Angular FormGroupDirective}
 *
 * Позволяет установить задержку (_debounce_) обновления query.
 *
 * Позволяет выбрать способ (_strategy_) записи query-параметров.
 * 'united' - значение формы будет полностью записано в одном параметре
 * 'separated' - каждое поле формы будет записано в своем query-параметре.
 *
 * Существует возможность переопределить поведение по преобразованию значения формы к строке.
 * По умолчанию используется JSON.stringify.
 * Воспользуйтесь интерфейсом ValueHandlingStrategy и FORM_VALUE_HANDLING_TOKEN
 *
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
     * Время задержки обновления query-параметров
     */
    @Input()
    public debounceTime = this.BASE_DEBOUNCE_TIME;

    /**
     * Стратегия создания query-параметров.
     *
     * Если указано 'united' - значение формы будет полностью записано по ключу одного query-параметра
     *
     * Если указано 'separated' - каждое поле формы будет записано отдельным ключом, соответствующим его названию в форме
     */
    @Input()
    public strategy: 'united' | 'separated' = 'united';

    /**
     * Ключ, по которому будет записано значение формы, если выбрано 'united' стратегия.
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
