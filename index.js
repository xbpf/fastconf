'use strict'

module.exports = function fastconf (_options, namespaces, envOverride) {
  let options
  if (Array.isArray(_options)) {
    options = {keys: _options}
  } else {
    options = _options
  }

  if (!options || typeof options !== 'object') {
    throw new Error('No options object provided!')
  }

  if (!Array.isArray(options.keys)) {
    throw new Error('No keys array provided!')
  }

  const retval = {}

  const env = envOverride || process.env

  validateEnv(env)

  for (let key of options.keys) {
    applyKey(key, retval, options, env)
  }

  if (namespaces) {
    if (typeof namespaces !== 'object') {
      throw new Error('Provided namespaces must be an object!')
    }
    for (let key of Object.keys(namespaces)) {
      setToObject(
        retval,
        key,
        fastconf(namespaces[key], null, env)
      )
    }
  }

  return Object.freeze(retval)
}

function validateEnv (env) {
  if (!env || typeof env !== 'object') {
    throw new Error('env must be an object!')
  }

  for (let key of Object.keys(env)) {
    if (typeof env[key] !== 'string') {
      throw new Error('An env value is not a string!')
    }
  }
}

function applyKey (_key, retval, options, env) {
  let key
  if (typeof _key === 'string') {
    key = [_key]
  } else {
    key = _key
  }

  if (!Array.isArray(key)) {
    throw new Error('Key provided is not an array or a string!')
  }

  if (typeof key[0] !== 'string') {
    throw new Error('Key provided does not have a string name!')
  }

  const keyName = key[0]

  if (!keyName) {
    throw new Error('Empty key name provided!')
  }

  const keyOptions = key[1] || {}

  if (keyOptions && typeof keyOptions !== 'object') {
    throw new Error('Non-object key options provided!')
  }

  const keyLookupName = resolveKeyLookupName(keyName, keyOptions, options)
  const keyValue = resolveKeyValue(keyLookupName, keyOptions, options, env)
  const keySavedName = resolveKeySavedName(keyName, keyOptions, options)

  setToObject(retval, keySavedName, keyValue)
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
  } else if (keyOptions.defaultValue !== undefined) {
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
      throw new Error(`Value for key ${keyLookupName} could not be resolved as a number!`)
    }
    return +value
  } else if (valueType === Boolean) {
    switch (value.toLowerCase()) {
      case '1':
      case 'yes':
      case 'true':
        return true
      case '0':
      case 'no':
      case 'false':
        return false
      default:
        throw new Error(`Value for key ${keyLookupName} could not be resolved as a boolean!`)
    }
  } else {
    throw new Error('Type provided for key is of an unknown value!')
  }
}

function resolveKeySavedName (keyName, keyOptions, options) {
  const shouldNormalizeName = (
    keyOptions.normalizeName !== undefined
    ? keyOptions.normalizeName
    : (
      options.normalizeNames !== undefined
      ? options.normalizeNames
      : true
    )
  )

  if (shouldNormalizeName) {
    return keyName.toLowerCase().replace(/_./g, i => i.toUpperCase().substr(1))
  } else {
    return keyName
  }
}

function setToObject (obj, name, value) {
  if (obj[name] !== undefined) {
    throw new Error(`Duplicate key: ${name}`)
  }
  Object.defineProperty(obj, name, {
    configurable: false,
    enumerable: true,
    value: value,
    writable: false
  })
}
