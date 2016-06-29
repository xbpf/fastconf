'use strict'

module.exports = function fastconf (options, namespaces, env) {
  if (!options || typeof options !== 'object') {
    throw new Error('No options object provided!')
  }

  if (!Array.isArray(options.keys)) {
    throw new Error('No keys array provided!')
  }

  const retval = {}

  env = env || process.env

  validateEnv(env)

  for (let key of options.keys) {
    applyKey(key, retval, options, env)
  }

  return retval
}

function validateEnv (env) {
  if (!env || typeof env !== 'object') {
    throw new Error('env must be an object!')
  }

  for (let value of Object.values(env)) {
    if (typeof value !== 'string') {
      throw new Error('An env value is not a string!')
    }
  }
}

function applyKey (key, retval, options, env) {
  if (!Array.isArray(key)) {
    throw new Error('Key provided is not an array!')
  }

  if (typeof key[0] !== 'string') {
    throw new Error('Key provided does not have a string name!')
  }

  const keyName = key[0]

  if (!keyName) {
    throw new Error('Empty key name provided!')
  }

  const keyOptions = key[1]

  if (keyOptions && typeof keyOptions !== 'object') {
    throw new Error('Non-object key options provided!')
  }

  const keyLookupName = resolveKeyLookupName(keyName, keyOptions, options)
  const keyValue = resolveKeyValue(keyLookupName, keyOptions, options, env)
  // const keySavedName = resolveKeySavedName(keyName, keyOptions, options)
  keyValue
}

function resolveKeyLookupName (keyName, keyOptions, options) {
  const prefix = getPrefix(options)
  if (prefix) return prefix + keyName
  return keyName
}

function getPrefix (options) {
  if (options.prefix && typeof options.prefix !== 'string') {
    throw new Error('Prefix is not a string!')
  }
  return options.prefix
}

function resolveKeyValue (keyLookupName, keyOptions, options, env) {
  const value = env[keyLookupName]
  if (valueExists(value, keyOptions, options)) {
    const transformedValue = validateValue(value, keyOptions, keyLookupName)
    return transformedValue
  } else if (keyOptions.defalutValue !== undefined) {
    return keyOptions.defaultValue
  } else {
    throw new Error(`Key ${keyLookupName} was not provided!`)
  }
}

function valueExists (value, keyOptions, options) {
  if (value === undefined) return false

  let isStrictExistence = (
    keyOptions.strictExistence !== undefined
    ? keyOptions.strictExistence
    : (
      options.strictExistence !== undefined
      ? options.strictExistence
      : false
    )
  )

  if (value) return true
  else if (isStrictExistence) return true
  else return false
}

function validateValue (value, keyOptions, keyLookupName) {
  const valueType = keyOptions.type || String

  if (valueType === String) {
    return value
  } else if (valueType === Number) {
    if (Number.isNaN(+value)) {
      throw new Error(`Value for key ${keyLookupName} is not a number!`)
    }
    return +value
  } else if (valueType === Boolean) {
    // TODO
  } else {
    throw new Error('Type provided for key is of an unknown value!')
  }
}
