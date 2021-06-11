# NgxMaterialQuerySearch [![npm version](https://badge.fury.io/js/ngx-mat-query-search.svg)](https://badge.fury.io/js/ngx-mat-query-search)
[Demo](https://128keaton.github.io/NgxMaterialQuerySearch/)

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
