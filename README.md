fastconf
===

[![npm](https://img.shields.io/npm/v/fastconf.svg?style=flat-square&_t=20160630)](https://npmjs.com/package/fastconf)
[![npm](https://img.shields.io/badge/style-standard-blue.svg?style=flat-square)](https://github.com/feross/standard)


*Requires at least partial ES6 support (node v4 or higher)*

`npm install fastconf`

fast example
---

```js
console.log(process.env) /* {
  'FOO_BAR': '123',
  'NOPE': 'true',
  'XBPF_ZIG_ZAG': '2929'
} */

const config = fastconf([
  // All keys are required unless a default value is provided
  ['FOO_BAR', {type: Number}],
  ['NOPE', {type: Boolean, defaultValue: false}],
  ['MORE_THINGS', {defaultValue: 'apples'}]
], {
  xbpf: { // You can also pass an object (with the keys prop) if you want to
          // further configure fastconf
    prefix: 'XBPF_',
    keys: [
      'ZIG_ZAG' // You can also just provide strings in keys array (options are defaults)
    ]
  }
})

console.log(config) /* {
  fooBar: 123,
  nope: true,
  moreThings: 'apples',
  xbpf: {
    zigZag: '2929'
  }
} */
```

slow example
---

```js
import fastconf from 'fastconf'

// Fastconf is a convenience utility to quickly generate a
// configuration object based on the provided lookup object.
//
// It expects that all keys you give it are unique (will
// never map to the same key in the returned object), and that
// all keys are required unless specified optional.
const config = fastconf({
  // (Since 0.2.0) You can now just pass an array in place of the first object,
  // which is equivalent to passing {keys: [the array]}

  // Prefix, useful for not having to repeat yourself.
  // If you have a prefix of 'NICE_', and have a required key 'FOO_BAR',
  // then fastconf will expect there to be an environment variable
  // with the key 'NICE_FOO_BAR', and will add it to the object
  // with the key fooBar.
  prefix: 'NICE_',

  // Whether to normalize names of the environment variables or not.
  // If true, keys like FOO_BAR will be named fooBar in the returned
  // configuration object.
  //
  // Defaults to true.
  normalizeNames: true,

  // Whether to consider a required key as existing only if it's undefined.
  // Otherwise, the following rule applies:
  // * The key does not exist if the environment variable is an empty string
  //
  // Defaults to false.
  strictExistence: false,

  // (Since 0.3.0) Whether to wrap the returned object in a proxy
  // that throws an error when getting keys that have undefined values.
  //
  // If true, and Proxy is not a function then this will
  // throw an error.
  // Defaults to false.
  useProxy: false,

  // An array of [key, options] values.
  //
  // (Since 0.1.0) The elements could also just be strings, which is the same
  // as doing ['KEY'] (default options)
  keys: [
    ['FOO_BAR', {
      // Key type. Can be either String, Number, or Boolean.
      //
      // The String type returns values as-is.
      //
      // The Number type parses the string as a number. If the
      // parsed number is NaN, then fastconf will throw an error.
      //
      // The Boolean type tried to parse the string as a boolean.
      // It must be one of the following values:
      //  false: '0', 'false' (case insensitive), 'no' (case insensitive)
      //  true: '1', 'true' (case insensitive), 'yes' (case insensitive)
      //
      // Defaults to String.
      type: Number,

      // Whether to normalize the name for this individual key.
      // See normalizeNames's documentation for more info.
      //
      // Defaults to normalizeNames's value.
      normalizeName: false,

      // Whether to use strict existence checking for this individual
      // key. See strictExistence's documentation for more info.
      strictExistence: true,

      // Default value, which can be any value. If a default value
      // is provided (not undefined), then the key is no longer required, and
      // fastconf will not throw an error if the value does not
      // exist.
      defaultValue: 0
    }],
    ['MORE_THINGS', {type: String, defaultValue: null}]
  ]
}, {
  // The optional second object provided are any "namespaces"
  // that you want to provide. These can be nested.
  // For example, if you have the 'xbpf' namespace, with its
  // own set of keys and values, the returned
  // object will look like this:
  //
  // {
  //   FOO_BAR: 123,
  //   moreThings: null,
  //   xbpf: {
  //     zigZag: 2929
  //   }
  // }
  //
  // This is useful for separate prefixes, and general organization.
  // Note that the object gets run through another call to fastconf(),
  // with the difference of it reusing the already determined environment
  // object.
  xbpf: {
    prefix: 'XBPF_',
    keys: [
      ['ZIG_ZAG', {type: Number}]
    ]
  }
}, {
  // If you wish to, you can provide your own key-value environment map.
  // Requires that all values for the keys are strings.
  //
  // Otherwise, fastconf will use process.env
  'NICE_FOO_BAR': '123',
  'XBPF_ZIG_ZAG': '2929'
})
```
