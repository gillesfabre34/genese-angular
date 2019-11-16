# genese-angular  [![npm version](https://badge.fury.io/js/genese-angular.svg)](https://badge.fury.io/js/genese-angular)

The generic data-service library for Angular.

Simple example using genese: https://github.com/gillesfabre34/genese-angular-demo


## Table of Contents
* [Installation](#installation)
* [Models](#models)
* [Services](#services)


## Installation

First you need to install the npm module:

```sh
npm install genese-angular --save
```

Choose the version corresponding to your Angular version:

 Angular     | genese-angular
 ----------- | -------------------
 8           | 0.0.19               

---

#### 1. Config

At first, you need to configure your environment. Genese needs to know what is the api address of your backend. You can do that by adding `GeneseEnvironmentService` in the constructor of your `AppComponent.

* Example:

`app.component.ts`
```ts
import { Component } from '@angular/core';
import { GeneseEnvironmentService } from 'genese-angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(geneseEnvironmentService: GeneseEnvironmentService) {
      geneseEnvironmentService.setEnvironment(environment.genese);
  }
}
```

`environment.ts`
```ts
export const environment = {
  production: false,
    genese: {
        api: 'http://localhost:3000'
    }
};
```
(replace the value of the property `api` by your api url)

#### 2. Import Genese module

Import the genese module in the `app.module.

* Example

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneseModule } from 'genese-angular';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        GeneseModule.forRoot(),

        AppRoutingModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```


##### 3. Inject geneseService in your component

Add a property with `Genese` type to your component, inject `GeneseService` in the constructor and instantiate your property with `getGeneseInstance`.

* Example

```ts
import { Genese } from 'genese-angular/lib/factories/genese.factory';
import { GeneseService } from 'genese-angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public booksGenese: Genese<Books>;

    constructor(
        private geneseService: GeneseService,
    ) {
        this.booksGenese = geneseService.getGeneseInstance(Books);
    }
}
```

## Models

Genese needs to be able to find all the properties of your models. That's why it is imperative to set default values to all the properties of your models, including inside nested objects.
Respecting this constraint, Genese will be able to return all the objects correctly formatted.

* Note

A Genese good practice is to set all the properties of your models as optional. It will be easier to create new objects and will not crash if one day you forget to set a property.

### Primitives
* Example with primitives

```ts
export class Book = {
    id ?= '';
    codeNumbers: number[] = [0];
    collectionNumber?: 0;
    isAvailable?: true;
    name ?= '';
}
```

### Nested objects
* Example with nested object

```ts
export class Book = {
    id ?= '';
    public editor?: {
        name?: string,
        place?: {
            city?: string,
            country?: string
        }
    } = {
        name: '',
        place: {
            city: '',
            country: ''
        }
    };
}
```

### Indexable types

Suppose that you wait http responses like this 
```ts
{
    en: 'The caves of steel',
    fr: 'Les cavernes d\'acier'
}
``` 
and suppose that you don't know in advance how many properties will have your response. In this example, you don't know in advance how many translations you will receive and in which languages.
In this case, you need to use indexable types like this :

```ts
export class Book = {
    [key: string]: string
}
```
This is the simplest example of indexable types.
Now, suppose that your http request returns something more complex like this :

```ts
{
    en: {
        country: 'England',
        name: 'The caves of steel'
    },
    fr: {
        country: 'France',
        name: 'Les cavernes d\'acier'
    }
}
```

In this case, you simply need to define your Genese model like this :
```ts
export class Book = {
    [key: string]: {
        country?: string,
        name?: string
    } = {
        gnIndexableType: {
            country: '',
            name: ''
        }
    }
}
```

The ``gnIndexableType`` key is a special key used by Genese to understand that you wait a response with indexableTypes.
You'll need to use it every time you'll have to use indexable types.

### Translations

Supposing that you have some fields which are translated in many languages, you'll probably want to have a GET request which will return the object translated in one of these languages. For example, if your data are like this 
```ts
{
    en: {
        country: 'England',
        name: 'The caves of steel'
    },
    fr: {
        country: 'France',
        name: 'Les cavernes d\'acier'
    }
}
```
you may want to receive a response with only the french language, like this :

```ts
{
    country: 'France',
    name: 'Les cavernes d\'acier'
}
```
Genese can do that for you. You will need to use the ``translate()`` method, which is described [here](#translatetdata-t-language-string-t).
To be able to do that, you need to construct your model like this :

```ts
export class Book = {
    gnTranslate: {
        [key: string]: {
            country: string,
            name: string
        }
    } = {
        gnIndexableType: {
            country: '',
            name: ''
        }
    }
}
```
The ``gnTranslate`` key is a specific keyword used by Genese to understand that some fields may be translated.
You'll need to use it every time you'll have to use translations. The usage of ``gnIndexableType`` is described [here](#indexable-types).

## Services

Genese provides many useful services. At first, let's have a look on "classic" CRUD operations: 

### ***Classic CRUD operations***

#### getAll<T>(path: string, params?: GnRequestParams): Observable<GetAllResponse<T> | T[]>

This method is used to receive a list of objects with T type, with or without pagination.
Suppose that in your environment.ts, genese.api = http://localhost:3000` and that your model looks like this :

```ts
export class Book {
    id ?= '';
    name ?= '';
}
```
`
* **getAll() without pagination**`

If your http GET request returns a simple list of objects, without pagination, the response will probably be like this:
```ts
[
    {
        id: '1',
        name: 'The caves of steel'
    },
    {
        id: '2',
        name: 'The robots of dawn'
    },
]
```
In this case, the ``getAll()`` method simply returns an observable of array of objects formatted with T type. In this example, this method will return an array with two objects of Book type.

* **getAll() with pagination**`

Now, suppose that you want to display a list of books which are in your library, and that you want to paginate it with a page size of 5 elements. Suppose too that you have 231 books in your library, and that you want to display the third page of your list (so pageIndex = 2).
Usually, you will send a GET request like this :

```ts
    http://localhost:3000/books?pageIndex=2&pageSize=5
```

The http response will be probably like this :

```ts
{
    totalResults: 231,
    results: [
        {
            id: '10',
            name: 'The caves of steel'
        },
        {
            id: '11',
            name: 'The robots of dawn'
        },
        {
            id: '12',
            name: 'Robots and Empire'
        },
        {
            id: '13',
            name: 'The Currents of Space'
        },
        {
            id: '14',
            name: 'The Stars'
        }
    ]
}
```

The Genese method ``getAll()`` is able to return very simply this kind of paginated list and in same time to format each element with type Book.
You will just need to call this method like this :

`books.component.ts`
```ts
export class BooksComponent {

    public booksGenese: Genese<Books>;

    constructor(private geneseService: GeneseService) {
        this.booksGenese = geneseService.getGeneseInstance(Books);
    }

    this.booksGenese.getAll('/books', {pageIndex: 2, pageSize: 5}).subscribe((response: { totalResults: number, results: Book[]) => {
         // The GET request called is http://localhost:3000/books?pageIndex=2&pageSize=4
         // In this case, totalResults = 231 and results is an array of 5 books, typed with your Book model
    });
}
```

For that, you need at first to configure your Genese environment by specifying the pagination parameters.

`environment.ts`
```ts
export const environment = {
    genese: {
        api: 'http://localhost:3000', // The url of your API
        pagination: {
            pageIndex: 'pageIndex',
            pageSize: 'pageSize',
            results: 'results',
            totalResults: 'totalResults'
        }
    }
};
```

#### getOne<T>(path: string, id?: string): Observable< T >

This method returns an observable of element of type T for a given path and a given id (optional). The returned object is mapped with the T type, which is the type of your `GeneseService`.

**Usage**

Supposing that in your environment.ts, genese.api = http://localhost:3000`
```ts
export class BooksComponent {

    public booksGenese: Genese<Books>;

    constructor(private geneseService: GeneseService) {
        this.booksGenese = geneseService.getGeneseInstance(Books);
    }

    this.booksGenese.getOne('/books', '1').subscribe((book: Book) => {
         // book is the data returned by 
         // the request http://localhost:3000/books/1
         // and formatted with type Book
    });
}
```
You can omit the param `id` when you want to call a request with custom path, including paths without `id`param at the end of the url :

* Example 1 (which will do exactly the same than previously) :

```ts
this.booksGenese.getOne('/books/1').subscribe((book: Book) => {
     // book is the data returned by 
     // the request http://localhost:3000/books/1
     // and formatted with type Book
});
```
* Example 2
```ts
this.booksGenese.getOne('/books/1?otherParam=2').subscribe((book: Book) => {
     // book will be the data returned by 
     // the request http://localhost:3000/books/1?otherParam=2
     // and formatted with type Book
});
```

### Other Genese services

#### translate(data: object, language: string): object

This service is used to translate in a specific language a property which is translated in many languages.
For example, if getOne() returns an object of T type like this :
```ts
{
    en: {
        country: 'England',
        name: 'The caves of steel'
    },
    fr: {
        country: 'France',
        name: 'Les cavernes d\'acier'
    }
}
```
you may want to transform this object in a format like this :

```ts
{
    country: 'France',
        name: 'Les cavernes d\'acier'
    }
}
```

To do that, your model must be like this :
```ts
export class Book = {
    gnTranslate: {
        [key: string]: {
            country: string,
            name: string
        }
    } = {
        gnIndexableType: {
            country: '',
            name: ''
        }
    }
}
```
``gnTranslated`` and ``gnIndexableType`` are specific Genese keywords, described more in detail [here](#translatetdata-t-language-string-t) and [here](#indexable-types).

In your component, you just need to combine `getOne()` with `translate()` and you'll receive an Observable of the object correctly formatted in the required language :

```ts
import { Books } from './books.model';
import { GeneseService } from 'genese-angular';

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss']
})
export class BookComponent {

    public bookTranslated: Book;

    constructor(private geneseService: GeneseService) {
        this.booksGenese = geneseService.getGeneseInstance(Books);
    }
    
    --------------------------------

    this.booksGenese.getOne('/books', 1).subscribe((book: Book) => {
        this.bookTranslated = this.booksGenese.translate(book, 'fr');
    });
}
```

