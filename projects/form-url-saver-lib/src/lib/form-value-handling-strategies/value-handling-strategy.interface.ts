/**
 *
 * Interface for single form value preprocessing strategy
 * Can be used to create custom handlers for certain data types.
 */
export interface ValueHandlingStrategy {
    /**
     * Converts a single form value to a string that can be written to a query
     * Override this method if you want to get a custom processing strategy, for example, for dates.
     *
     * The method also obtains information about the key name of the field in the form.
     * If 'united' mode is selected, the key will be undefined
     * @param value single form field value
     */
    stringify(value: unknown, key?: string): string;

    /**
     * Reads a single key string value from query and converts it to a value that can be written to a form.
     * It makes sense to override together with stringify, to get custom ways to read and write certain
     * data types.
     * @param value
     */
    parse(value: string, key?: string): unknown;
}
