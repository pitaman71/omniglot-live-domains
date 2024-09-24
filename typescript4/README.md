This is the Omniglot _Domain_Library_, a collection of pure Typescript definitions
(interfaces, classes, enumerations mostly) which implement introspectable types
suitable across commonly occurring business use cases.

## Development Operations

# clean

Remove all built files and `package-lock.json` with this command:

```npm run clean```

# install

Install npm packages using the canonical command:

```npm i```

# build

Build the typescript code:

```npm run build```

Output is in `lib/**`

# test 

Run unit tests:

```npm test```

# docs

Build docs:

```npm run docs:build```

Output is in `docs/**`

# publish

In preparation for release, update the `version` property
inside of `package.json`. Then run the following commands:

```
npm run docs:upload
npm run publish
```


