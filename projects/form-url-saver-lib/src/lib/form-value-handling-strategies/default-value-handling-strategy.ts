import { ValueHandlingStrategy } from './value-handling-strategy.interface';

export class DefaultFormHandlingStrategy implements ValueHandlingStrategy{

    public stringify(value: unknown) {
        return JSON.stringify(value);
    }

    public parse(value?: string) {
        if (!value) {
            return undefined;
        }

        return JSON.parse(value);
    }
}
