import 'babel-polyfill'

import assert from 'assert'
import FakeXMLHttpRequest from "fake-xml-http-request"
import { spy } from 'sinon'

import Ajax from '../src/ajax'

describe('Ajax', function() {

  beforeEach(function() {

    this.requests = []

    global.XMLHttpRequest = () => {
      let r =  new FakeXMLHttpRequest(arguments)
      this.requests.push(r)
      return r
    }
  })

  describe(`#request/1`, function() {
    it('requires args.url', function() {
      assert.throws(
        () => {
          Ajax.request({})
        },
        /args.url/
      )
    })

    it('makes a resquest', function() {
      Ajax.request({ url: '/test' })
      assert(this.requests[0])
    })

    it('sets correct http method', function() {
      Ajax.request({ url: '/test', method: 'POST' })
      assert.equal(this.requests[0].method, 'POST')
    })

    it('requires valid args.type', function() {
      assert.throws(
        () => {
          Ajax.request({ url: '/test', type: 'WRONG' })
        },
        /args.type/
      )
    })

    it('sets content type header based on args.type', function() {
      Ajax.request({ url: '/test', type: 'XML' })
      Ajax.request({ url: '/test', type: 'JSON' })
      Ajax.request({ url: '/test', type: 'URLENCODED' })

      assert.equal(this.requests[0].requestHeaders['Content-Type'], 'text/xml')
      assert.equal(this.requests[1].requestHeaders['Content-Type'], 'application/json')
      assert.equal(this.requests[2].requestHeaders['Content-Type'], 'application/x-www-form-urlencoded')
    })

    it('sends request data', function() {
      let data = JSON.stringify({ something: 123 })

      Ajax.request({ url: '/test', method: 'POST', data: data })
      assert.equal(this.requests[0].requestBody, data)
    })

    it('sets headers', function() {
      Ajax.request({ url: '/test', headers: { 'X-Token': 'qwerty' } })
      assert.equal(this.requests[0].requestHeaders['X-Token'], 'qwerty')
    })

    describe('callbacks', function() {

      it('fires right callbacks in right order on successful request', function() {
        let onSuccess = spy()
        let onStart = spy()
        let onError = spy()
        let onFinish = spy()

        Ajax.request({
          url: '/test',
          onSuccess: onSuccess,
          onStart: onStart,
          onError: onError,
          onFinish: onFinish
        })

        this.requests[0].respond(200,
          {"Content-Type": "application/json"},
          '{"key":"value"}'
        )

        assert(onStart.called)
        assert(onSuccess.calledAfter(onStart))
        assert(onFinish.calledAfter(onSuccess))
        assert(!onError.called)
      })

      it('fires right callbacks in right order on failed request', function() {
        let onSuccess = spy()
        let onStart = spy()
        let onError = spy()
        let onFinish = spy()

        Ajax.request({
          url: '/test',
          onSuccess: onSuccess,
          onStart: onStart,
          onError: onError,
          onFinish: onFinish
        })

        this.requests[0].respond(400,
          {"Content-Type": "application/json"},
          '{"key":"value"}'
        )

        assert(onStart.called)
        assert(onError.calledAfter(onStart))
        assert(onFinish.calledAfter(onError))
        assert(!onSuccess.called)
      })

    })
  })
})
