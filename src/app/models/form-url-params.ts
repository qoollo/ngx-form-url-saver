export type FormHandlingStrategy = 'separated' | 'united';

export interface FormUrlParams {
    debounceTime: number;
    queryKey: string;
    strategy: FormHandlingStrategy;
}
