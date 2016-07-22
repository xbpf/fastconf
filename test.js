'use strict'

import test from 'ava'
import fastconf from './'

test('readme slow example should work', t => {
  t.plan(1)

  const config = fastconf({
    prefix: 'NICE_',
    normalizeNames: true,
    strictExistence: false,
    keys: [
      ['FOO_BAR', {
        type: Number,
        normalizeName: false,
        strictExistence: true,
        defaultValue: 0
      }],
      ['MORE_THINGS', {type: String, defaultValue: null}]
    ]
  }, {
    xbpf: {
      prefix: 'XBPF_',
      keys: [
        ['ZIG_ZAG', {type: Number}]
      ]
    }
  }, {
    'NICE_FOO_BAR': '123',
    'XBPF_ZIG_ZAG': '2929'
  })

  t.deepEqual(config, {
    FOO_BAR: 123,
    moreThings: null,
    xbpf: {
      zigZag: 2929
    }
  })
})

test('readme fast example should work', t => {
  t.plan(1)

  const env = {
    'FOO_BAR': '123',
    'NOPE': 'true',
    'XBPF_ZIG_ZAG': '2929'
  }

  const config = fastconf([
    ['FOO_BAR', {type: Number}],
    ['NOPE', {type: Boolean, defaultValue: false}],
    ['MORE_THINGS', {defaultValue: 'apples'}]
  ], {
    xbpf: {
      prefix: 'XBPF_',
      keys: [
        'ZIG_ZAG'
      ]
    }
  }, env)

  t.deepEqual(config, {
    fooBar: 123,
    nope: true,
    moreThings: 'apples',
    xbpf: {
      zigZag: '2929'
    }
  })
})

test('must require options to exist', t => {
  t.plan(3)

  const expectedError = 'No options object provided!'

  const cases = [
    undefined,
    null,
    123
  ]

  for (let caseTest of cases) {
    try {
      fastconf(caseTest)
      t.fail('did not throw')
    } catch (err) {
      t.is(err.message, expectedError)
    }
  }
})

test('must require options.keys to be an array', t => {
  t.plan(4)

  const expectedError = 'No keys array provided!'

  const cases = [
    {},
    {
      keys: null
    },
    {
      keys: {}
    },
    {
      keys: 123
    }
  ]

  for (let caseTest of cases) {
    try {
      fastconf(caseTest)
      t.fail('did not throw')
    } catch (err) {
      t.is(err.message, expectedError)
    }
  }
})

test.todo('provided env testing')
test.todo('provided env validation testing - env is object')
test.todo('provided env validation testing - env values are strings')
test.todo('process.env testing')

test('keys provided must be arrays or strings', t => {
  t.plan(4)

  const expectedError = 'Key provided is not an array or a string!'

  const cases = [
    {keys: [null]},
    {keys: [{}]},
    {keys: [123]},
    {keys: [undefined]}
  ]

  for (let caseTest of cases) {
    try {
      fastconf(caseTest)
      t.fail('did not throw')
    } catch (err) {
      t.is(err.message, expectedError)
    }
  }
})

test('key names must be strings', t => {
  t.plan(5)

  const expectedError = 'Key provided does not have a string name!'

  const cases = [
    {keys: [[null]]},
    {keys: [[234]]},
    {keys: [[[]]]},
    {keys: [[{}]]},
    {keys: [[undefined]]}
  ]

  for (let caseTest of cases) {
    try {
      fastconf(caseTest)
      t.fail('did not throw')
    } catch (err) {
      t.is(err.message, expectedError)
    }
  }
})

test('key names must not be empty', t => {
  t.plan(1)

  const expectedError = 'Empty key name provided!'

  const cases = [
    {keys: [['']]}
  ]

  for (let caseTest of cases) {
    try {
      fastconf(caseTest)
      t.fail('did not throw')
    } catch (err) {
      t.is(err.message, expectedError)
    }
  }
})

test('key options must be an object, if provided', t => {
  t.plan(2)

  const expectedError = 'Non-object key options provided!'

  const cases = [
    {keys: [['a', 214]]},
    {keys: [['a', true]]}
  ]

  for (let caseTest of cases) {
    try {
      fastconf(caseTest)
      t.fail('did not throw')
    } catch (err) {
      t.is(err.message, expectedError)
    }
  }
})

test('prefix must be a string', t => {
  t.plan(4)

  const expectedError = 'Prefix is not a string!'

  const cases = [
    {prefix: true, keys: [['a']]},
    {prefix: 1234, keys: [['a']]},
    {prefix: {}, keys: [['a']]},
    {prefix: [], keys: [['a']]}
  ]

  for (let caseTest of cases) {
    try {
      fastconf(caseTest)
      t.fail('did not throw')
    } catch (err) {
      t.is(err.message, expectedError)
    }
  }
})

test.todo('prefix testing')

test.todo('default value testing')
test.todo('existence testing')
test.todo('value validation testing')

test.todo('key validation: type validation')

// I'm not sure if there should be validation in general for this.
test.todo('key validation: default validation')
test.todo('key validation: string validation')

test.todo('key validation: number validation')
test.todo('key validation: boolean validation')
test.todo('key resolution: normalized names: default')
test.todo('key resolution: normalized names: global')
test.todo('key resolution: normalized names: key')
test.todo('key resolution: non-normalized names')

test.todo('key validation: values')
test.todo('key validation: default values')
test.todo('key validation: existence errors')

test.todo('name conflict checking')
test.todo('object property freezing')

test.todo('namespace validation')
test.todo('nested call validation')
test.todo('nested call env validation')
test.todo('nested call conflict validation')

test.todo('key checking if array')
test.todo('key checking if string')
test.todo('array of keys for options testing')

test.todo('proxies')
