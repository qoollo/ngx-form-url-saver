import { Params } from '@angular/router';

export interface QueryGenerationStrategy {

    /**
     * Отвечает за получение значения формы из query-параметров.
     * Может дополнительно опираться на значение формы, например, чтобы узнать какие ключи в ней присутствуют
     * @param queryParams значение query-параметров
     * @param formValue значение формы
     */
    inferFormValueFromQuery(queryParams: Params, formValue: Record<string, unknown>): object;

    /**
     * Преобразует значение формы к объекту, который может быть передан в роутер для проставления
     * query-параметров
     */
    convertFormValueToQueryObject(formValue: Record<string, unknown>): object;

    /**
     * Возвращает объект, который следует передать в роутер для удаления query-параметров.
     * Может дополнительно опираться на значение формы, например, чтобы узнать какие ключи в ней присутствуют
     */
    createClearingObject(formValue: Record<string, unknown>): object;
}
