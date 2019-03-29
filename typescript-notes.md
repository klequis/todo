Some of my guesses
```json
{
  "compilerOptions": {
    "target": "es5",
    "jsx": "react", // this must be set or get "Cannot use JSX unless the '--jsx' flag is provided."
    "strict": true,
    "esModuleInterop": true,

    // added from ts starter
    "baseUrl": "src", // required to use absolute imports on React components
    // "outDir": "build/dist",
    // "module": "esnext",
    // "lib": ["es6", "dom"],
    // "sourceMap": true,
    // "allowJs": true,
    // "moduleResolution": "node",
    // "rootDir": "src",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true
  }
}
```

Some interesting settings
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "build/dist",
    "module": "esnext",
    "target": "es5",
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "jsx": "react",
    "moduleResolution": "node",
    "rootDir": "src",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true
  },
  "exclude": [
    "node_modules",
    "build",
    "scripts",
    "acceptance-tests",
    "webpack",
    "jest",
    "src/setupTests.ts"
  ]
}
```