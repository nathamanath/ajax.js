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

  describe('#request/1', function() {

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

      Ajax.request({ url: '/test', data: data })
      assert.equal(this.requests[0].requestBody, data)
    })

    it('sets a timeout', function() {
      Ajax.request({ url: '/test', timeout: 123 })
      assert.equal(this.requests[0].timeout, 123)
    })

    it('sets headers', function() {
      Ajax.request({ url: '/test', headers: { 'X-Token': 'qwerty' } })
      assert.equal(this.requests[0].requestHeaders['X-Token'], 'qwerty')
    })

    describe('callbacks', function() {

      describe('onStart', function() {
        it('is called first on success', function() {
          let onSuccess = spy()
          let onStart = spy()

          Ajax.request({
            url: '/test',
            onSuccess: onSuccess,
            onStart: onStart
          })

          this.requests[0].respond(200,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(onStart.called)
          assert(onStart.calledBefore(onSuccess))
        })

        it('is called first on fail', function() {
          let onError = spy()
          let onStart = spy()

          Ajax.request({
            url: '/test',
            onError: onError,
            onStart: onStart
          })

          this.requests[0].respond(200,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(onStart.called)
          assert(onStart.calledBefore(onError))
        })
      })

      describe('onFinish', function() {
        it('is called last on success', function() {
          let onSuccess = spy()
          let onFinish = spy()

          Ajax.request({
            url: '/test',
            onSuccess: onSuccess,
            onFinish: onFinish
          })

          this.requests[0].respond(200,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(onFinish.called)
          assert(onFinish.calledAfter(onSuccess))
        })

        it('is called last on fail', function() {
          let onError = spy()
          let onFinish = spy()

          Ajax.request({
            url: '/test',
            onError: onError,
            onFinish: onFinish
          })

          this.requests[0].respond(500,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(onFinish.called)
          assert(onFinish.calledAfter(onError))
        })

      })

      describe('onSuccess', function() {
        it('is called on success', function() {
          let onSuccess = spy()

          Ajax.request({ url: '/test', onSuccess: onSuccess })

          this.requests[0].respond(200,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(onSuccess.called)
        })

        it('is not called on fail', function() {
          let onSuccess = spy()

          Ajax.request({ url: '/test', onSuccess: onSuccess })

          this.requests[0].respond(400,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(!onSuccess.called)
        })
      })

      describe('onError', function() {
        it('is called on failure', function() {
          let onError = spy()

          Ajax.request({ url: '/test', onError: onError })

          this.requests[0].respond(400,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(onError.called)
        })

        it('is not called on success', function() {
          let onError = spy()

          Ajax.request({ url: '/test', onError: onError })

          this.requests[0].respond(200,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(!onError.called)
        })
      })

      describe('onTimeout', function() {
        it('is called after timeout', function(done) {
          let onTimeout = spy()

          Ajax.request({
            url: '/test',
            onTimeout: onTimeout,
            timeout: 1
          })

          global.setTimeout(() => {
            assert(onTimeout.called)
            done()
          }, 2)

        })

        it('is not called without timeout', function() {

          let onTimeout = spy()

          Ajax.request({
            url: '/test',
            onTimeout: onTimeout,
            timeout: 1
          })

          this.requests[0].respond(200,
            {"Content-Type": "application/json"},
            '{"key":"value"}'
          )

          assert(!onTimeout.called)

        })
      })
    })
  })

})
