import { Params } from '@angular/router';
import { QueryGenerationStrategy } from './quey-generation-strategy.interface';
import { ValueHandlingStrategy } from '../form-value-handling-strategies/value-handling-strategy.interface';


export class SeparatedQueryGenerationStrategy implements QueryGenerationStrategy {

    public constructor(
        private readonly formHandlingStrategy: ValueHandlingStrategy,
    ) { }

    public inferFormValueFromQuery(queryParams: Params, formValue: Record<string, unknown>): object {
        const queryObject: Record<string, unknown> = {};

        for (const key of Object.keys(formValue)) {
            queryObject[key] = this.formHandlingStrategy.parse(queryParams[key], key);
        }

        return queryObject;
    }


    public convertFormValueToQueryObject(formValue: Record<string, unknown>): object {
        const queryObject: Record<string, unknown> = {};

        for (const key of Object.keys(formValue)) {
            queryObject[key] = this.formHandlingStrategy.stringify(formValue[key], key);
        }

        return queryObject;
    }

    public createClearingObject(formValue: object): object {
        const filtersObject: Record<string, null> = {};

        for (const key of Object.keys(formValue)) {
            filtersObject[key] = null;
        }

        return filtersObject;
    }

}
