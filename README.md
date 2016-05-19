# Zanata (Single Page Application)



## Setup and Deployment

1. Make sure [node and npm](http://nodejs.org/) are installed.
2. Setup dependencies: `make setup`.

### Run with live reload

Build and run a server: `make watch`.

 - Editor is available at [localhost:8000](http://localhost:8000)
   - the editor will be blank at the base URL, include the project-version to
     show content. The format is
     localhost:8000/#/{project-slug}/{version-slug}/translate
 - Assumes a server is already serving the Zanata REST API.


### Run with live reload and local API server

Build and run server and API server: `make watch-fakeserver`.

 - Editor is available at [localhost:8000](http://localhost:8000)
   - URL for a working document from the default API server [Tiny Project 1, hello.txt to French](http://localhost:8000/#/tiny-project/1/translate/hello.txt/fr)
 - REST API server is available at
   [localhost:7878/zanata/rest](http://localhost:7878/zanata/rest)


## Running tests

Run tests with `make test`.


## Code Guidelines

### Javascript

And [these](https://github.com/zanata/javascript) for Javascript.

Always add documentation.

### CSS

For CSS I am aiming to move to [these guidelines](https://github.com/suitcss/suit/blob/master/doc/README.md).

## License

Zanata is Free software, licensed under the [LGPL](http://www.gnu.org/licenses/lgpl-2.1.html).
