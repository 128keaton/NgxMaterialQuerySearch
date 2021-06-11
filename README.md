# NgxMaterialQuerySearch [![npm version](https://badge.fury.io/js/ngx-mat-query-search.svg)](https://badge.fury.io/js/ngx-mat-query-search)
An Angular 12 visual query builder component for use with [@nestjsx/crud](https://github.com/nestjsx/crud).

[Demo](https://128keaton.github.io/NgxMaterialQuerySearch/)

```shell
$ npm i --save ngx-mat-query-search
```

## Usage

1. Import the module:
```typescript
  imports: [
        QuerySearchModule.forRoot({
            loggingCallback:  (...args) => {
                console.log(...args);
            },
            debug: true,
            encode: false
        }),
    ]
```

2. Use in a component template:

```html
<ngx-query-search>
  <query-fields>
    <query-field name="name" label="Full Name" type="string"></query-field>
    <query-field name="hasValues" label="Has Values" type="string" [values]="['a', 'b']"></query-field>
    <query-field name="birthday" label="Birthday" type="date" format="dd/MM/yyyy"></query-field>
    <query-field name="joinDay" label="Join Date" type="date" format="MM/dd"></query-field>
  </query-fields>
</ngx-query-search>
```

3. Use the service to consume the output:
```typescript
 constructor(private querySearchService: QuerySearchService) {
    this.querySearchService.queryUpdated.subscribe(newQueryObject => this.queryObject = newQueryObject);
    this.querySearchService.queryStringUpdated.subscribe(newQueryString => this.queryString = newQueryString);
  }
```


### Notes

Alternatively, one could either pass a model class to the `consumeModel` function in `QuerySearchService` to automagically create fields:
```typescript
this.querySearchService.consumeModel(Demo, {birthday: 'Birthday 2', count: 'Total Count', name: 'Other Name', isActive: 'Active'});
```
Note, the model has to have all the properties set for detection to work properly:
```typescript
export class Demo {
  name: string = ''
  birthday: Date = new Date();
  isActive: boolean = false;
  count: number = 0;
  // Or you can set them in the constructor
}
```

One could also just pass an instantiated/populated model to the `consumeObject` function in `QuerySearchService` to produce similar results:
```typescript
const demo = new Demo();

demo.birthday = new Date();
demo.count = 25;
demo.isActive = true;
demo.name = 'Paul';

this.querySearchService.consumeObject(demo, {birthday: 'Birthday 2', count: 'Total Count', name: 'Other Name', isActive: 'Active'});
```
