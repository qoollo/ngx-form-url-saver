import { BehaviorSubject } from 'rxjs';
import { FormUrlParams } from '../models/form-url-params';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FormUrlSettingsService {

    public readonly DEFAULT_UPDATE_TIME = 500;

    public readonly DEFAULT_STRATEGY = 'united';

    public readonly DEFAULT_QUERY_KEY = 'form';

    private readonly formUrlParamsBehaviorSubject = new BehaviorSubject<FormUrlParams>({
        debounceTime: this.DEFAULT_UPDATE_TIME,
        queryKey: this.DEFAULT_QUERY_KEY,
        strategy: this.DEFAULT_STRATEGY,
    });

    public readonly formUrlParamsChangesObservable = this.formUrlParamsBehaviorSubject.asObservable();

    public get params(): FormUrlParams {
        return this.formUrlParamsBehaviorSubject.value;
    }

    public patchParams(newParams: Partial<FormUrlParams>) {
        this.formUrlParamsBehaviorSubject.next({
            ...this.params,
            ...newParams,
        });
    }

}
