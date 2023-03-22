# :whale: Qoollo ngx-form-url-saver :whale:

| **Package**                                                                                  | **Version**                                                                      | **README**                                                                                   | **Downloads**                                                                                                                   |
|----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| [@vadiminator/ngx-form-url-saver](https://npmjs.com/package/@vadiminator/ngx-form-url-saver) | ![](https://img.shields.io/npm/v/%40vadiminator%2Fngx-form-url-saver/latest.svg) | [![](https://img.shields.io/badge/README--green.svg)](packages/ngx-form-url-saver/README.md) | [![](https://img.shields.io/npm/dw/@vadiminator/ngx-form-url-saver)](https://npmjs.com/package/@vadiminator/ngx-form-url-saver) |

## Описание

Данная директива позволяет автоматически записывать значение формы в URL в виде query-параметров

## Использование

Код компонента

```ts
public form = new FormGroup({
    name: new FormControl(''),
});
```

Код шаблона

```html
<form
    [ngxFormUrlSaver]="form"
>
```

## Features

- Позволяет установить debounce
- Может работать в двух режимах создание query-параметров:
1) 'separated' - все поля формы будут записаны в именно query-параметр
2) 'united' - вся форма (один объект) будет записан как один query-параметр с именем 'form' (значение по умолчанию)

## Options

| Option       | Type                     | Default    | Description                                       |                                                                    
|--------------|--------------------------|------------|---------------------------------------------------|
| debounceTime | number                   | 500        | Время debounce в миллисекундах                    |
| strategy     | `'united' \ 'separated'` | `'united'` | Стратегия создания query-параметров               |
| queryKey     | string                   | `'form'`   | Ключ по умолчанию, если выбарана стратегия united |
