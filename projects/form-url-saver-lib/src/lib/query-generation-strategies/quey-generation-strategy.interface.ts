import { Params } from '@angular/router';

export interface QueryGenerationStrategy {

    /**
     * Responsible for getting the form value from the query parameters.
    * Can additionally rely on the value of the form, for example, to find out which keys are present in it
     * @param queryParams
     * @param formValue
     */
    inferFormValueFromQuery(queryParams: Params, formValue: Record<string, unknown>): object;

    /**
     * Converts the value of the form to an object that can be passed to the router for affixing
     * query-parameters
     */
    convertFormValueToQueryObject(formValue: Record<string, unknown>): object;

    /**
     * Returns an object that should be passed to the router to remove query parameters.
     * Can additionally rely on the value of the form, for example, to find out which keys are present in it
     */
    createClearingObject(formValue: Record<string, unknown>): object;
}
