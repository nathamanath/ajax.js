import 'babel-polyfill'

import assert from 'assert'

import { merge } from '../src/utils'

describe('#merge', function() {
  it('merges 2 objects', function() {
    let a = {a: 1, b: 2, c: 3}
    let b = {b: 22, d: 4}
    let expected = {a: 1, b: 22, c: 3, d: 4}

    assert.deepEqual(merge(b, a), expected)
  })
})
