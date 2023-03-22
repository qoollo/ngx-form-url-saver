import { InjectionToken, Provider } from '@angular/core';
import { DefaultFormHandlingStrategy } from './default-value-handling-strategy';
import { ValueHandlingStrategy } from './value-handling-strategy.interface';

export const FORM_VALUE_HANDLING_TOKEN = new InjectionToken<() => ValueHandlingStrategy>('ngx-form-url-saver')

export const NGX_FORM_URL_SAVER_STRATEGY_PROVIDER: Provider = {
    provide: FORM_VALUE_HANDLING_TOKEN,
    useFactory: () => new DefaultFormHandlingStrategy(),
}
