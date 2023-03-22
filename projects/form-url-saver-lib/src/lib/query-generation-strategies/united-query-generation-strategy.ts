import { Params } from '@angular/router';
import { QueryGenerationStrategy } from './quey-generation-strategy.interface';
import { ValueHandlingStrategy } from '../form-value-handling-strategies/value-handling-strategy.interface';


export class UnitedQueryGenerationStrategy implements QueryGenerationStrategy {


    public constructor(
        private readonly formHandlingStrategy: ValueHandlingStrategy,
        private readonly queryKey: string,
    ) { }

    public inferFormValueFromQuery(queryParams: Params): object {
        const query = queryParams[this.queryKey] as string;

        if (!query) {
            return {};
        }

        const formValue = this.formHandlingStrategy.parse(query);

        return formValue as object;
    }


    public convertFormValueToQueryObject(formValue: Record<string, unknown>): object {
        const serializedObject = this.formHandlingStrategy.stringify(formValue);

        return {
            [this.queryKey]: serializedObject,
        };
    }

    public createClearingObject(): object {
        return {
            [this.queryKey]: null,
        };
    }

}
