# genese-angular  [![npm version](https://badge.fury.io/js/genese-angular.svg)](https://badge.fury.io/js/genese-angular)

The generic data-service library for Angular.

Simple example using genese: https://github.com/gillesfabre34/genese-angular-demo


## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
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


## Usage

#### 1. Config

At first, you need to configure your environment. Genese needs to know what is the api address of your backend. You can do that by adding GeneseEnvironmentService in the constructor of your AppComponent.

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
  title = 'genese-demo';


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
(replace the value of 'api' by the url you need)

#### 2. Import Genese module

Import the genese module in the app.module.

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

Add a property with `Genese` Type to your component, inject `GeneseService` in the constructor and instantiate your property with `getGeneseInstance`.

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

Genese needs to be able to find all the properties of your models. That's why it is imperative to set default values to all the properties, including inside nested objects.
With this constraint, Genese will be able to return objects correctly formatted.
### Primitives
* Example with primitives

```
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

```
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

Supposing that you wait http responses like this :
```
{
    en: 'The caves of steel',
    fr: 'Les cavernes d\'acier'
}
``` 
Supposing too that you don't know in advance how many and which languages you will receive
In this case, you'll need to use indexable types like this :
```
export class Book = {
    [key: string]: string
}
```

Now, suppose that your model have more complex indexable types, and that your http request will return you something like this :

```
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

You will simply need to define your Genese model like this :
```
export class Book = {
    [key: string]: {
        country: string,
        name: string
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
```
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

```
{
    country: 'France',
        name: 'Les cavernes d\'acier'
    }
}
```
Genese can do that for you. You will need to use the ``translate<U = T>(data: U, language: Language)`` method, which is described [here](#translatetdata-t-language-string-t).
To be able to do that, you need to construct your model like this :

```
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
The ``gnTranslate`` key is a special key used by Genese to understand that some fields can be translated.
You'll need to use it every time you'll have to use translations. The usage of ``gnIndexableType`` is described [here](#indexable-types).

## Services

Genese provides many useful services. At first, let's have a look on "classic" CRUD operations: 

### ***Classic CRUD operations***

#### getOne(path: string, id?: string): Observable< T >

This method returns an observable of element of type T for a given path and a given id (optional). The returned object is mapped with the T type.

**Usage**
Supposing that in your environment.ts, genese.api = http://localhost:3000`
```
this.booksGenese.getOne('/books', '1').subscribe((book: Book) => {
     // book will be the data returned by 
     // the request http://localhost:3000/books/1
     // and formatted with type Book
});
```
The next lines would do exactly the same :

```
this.booksGenese.getOne('/books', '1').subscribe((book: Book) => {
     // book will be the data returned by 
     // the request http://localhost:3000/books/1
     // and formatted with type Book
});
```
You can omit the param `id` when you want to call a request with custom path, including paths without `id`param at the end of the url :

```
this.booksGenese.getOne('/books/1?otherParam=2').subscribe((book: Book) => {
     // book will be the data returned by 
     // the request http://localhost:3000/books/1?otherParam=2
     // and formatted with type Book
});
```

### Other Genese services

#### translate<T>(data: T, language: string): T

This service is used to translate in a specific language a property which is translated in many languages.
For example, if getOne() returns an object of T type like this :
```
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

```
{
    country: 'France',
        name: 'Les cavernes d\'acier'
    }
}
```

To do that, your model must be like this :
```
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

```
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

