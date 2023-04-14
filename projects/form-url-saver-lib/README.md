# :whale: Qoollo ngx-form-url-saver :whale:

| **Package**                                                                                  | **Version**                                                                      | **README**                                                                                   | **Downloads**                                                                                                                   |
|----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| [@qoollo/ngx-form-url-saver](https://npmjs.com/package/@qoollo/ngx-form-url-saver) | ![](https://img.shields.io/npm/v/@qoollo/ngx-form-url-saver/latest.svg) | [![](https://img.shields.io/badge/README--green.svg)](projects/form-url-saver-lib/README.md) | [![](https://img.shields.io/npm/dw/@qoollo/ngx-form-url-saver)](https://npmjs.com/package/@qoollo/ngx-form-url-saver) |

## Description

This `FormUrlSaverDirective` allows writing any form's data to an URL string and restore own state from it.  
You no need to write any bolierplate code, it can replace default `[formGroup]` directive in any tempalte.  

## Live demo

Test all directive's features by [live demo](https://qoollo.github.io/ngx-form-url-saver/?firstName=%22Hello%22&secondName=%22World%22)


## Usage
E.g. You want to save your search data after page reloading. 
For this case you can use this directive.

This directive extends base Angular [FormGroupDirective](https://angular.io/api/forms/FormGroupDirective), so you can just replace `[formGroup]` to `[ngxFormUrlSaver]`.

Component code

```ts
public form = new FormGroup({
    searchString: new FormControl(''),
});
```

Template code

Before using directive
```html
<form [formGroup]="form">
    <input formControlName="searchString">
</form>
```

Afret using directive
```html
<form [ngxFormUrlSaver]="form">
    <input formControlName="searchString">
</form>
```

When form will change it's value, a new query params will push to URL.  
In expample the query will be `?searchString="..."`

### **State restoring**

After page reloading form will parses all query and restore own state by them.  
And then form will be sync state with URL as always.

## Features

- Allows to set debounce time to query update
- Can work in two query-parametres creation modes:
1. 'separated' - All form's fields will write in separate query-params by its names. E.g `?firstName="Hello"&secondName="World"`
2. 'united' - All form will be write in one query parameter (with name `form` by default). E.g `/?form=%7B"firstName":"","secondName":""%7D`

## Options

| Option       | Type                     | Default    | Description                                       |                                                                    
|--------------|--------------------------|------------|---------------------------------------------------|
| debounceTime | number                   | 500        | Debounce time in ms                               |
| strategy     | `'united' \ 'separated'` | `'united'` | Query creation strategy                           |
| queryKey     | string                   | `'form'`   | Default query parameter for united strategy       |

