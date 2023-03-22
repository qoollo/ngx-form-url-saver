import { FormControl, FormGroup } from '@angular/forms';

export type FormFields<T> = {
    [P in keyof T]: T[P] extends 'object' ? FormGroup<FormFields<T>> : FormControl<T[P]>;
};
