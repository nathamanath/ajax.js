/* global describe, it */
(function () {
  'use strict';

  describe('Ajax', function () {
    beforeEach(function(){
      this.xhr = sinon.useFakeXMLHttpRequest();
      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function(){
      this.xhr.restore();
    });

    describe('Ajax definition', function(){
      describe('amd environment', function(){
        it('defines ajax module', function(){
          setTimeout(function(){
            window.required.should.eql(true); // see test/amd.html
          }, 100); // Purest of nastyness
        });
      });

      describe('not amd', function(){
        it('defines window.Ajax', function(){
          (window.Ajax).should.eql(Ajax);
        });
      });
    });

    describe('#constructor', function () {
      it('requires args.url', function () {
        var fn = function(){new Ajax({});};
        fn.should.throw('Ajax requires a url.');
      });

      it('refuses invalid args.method', function(){
        var fn = function(){new Ajax({url: '', method: 'HATS'});};
        fn.should.throw('Ajax method must be valid.');
      });

      it('refuses invalid args.contentType', function(){
        var fn = function(){new Ajax({url: '', type: 'FLAGS'});};
        fn.should.throw('Ajax content type must be valid.');
      });
    });

    describe('#send', function(){
      it('fires off an XMLHttpRequest', function(){
        var start = sinon.stub();
        new Ajax({url: '', onStart: start}).send();
        (typeof this.requests[0]).should.not.eql('undefined');
      });

      it('uses selected method', function(){
        Ajax.request({url: '', method: 'HEAD'});
        this.requests[0].method.should.eql('HEAD');
      });

      describe('content type', function(){
        it('defaults to x-www-form-urlencoded', function(){
          Ajax.request({url: ''});
          var headers = this.requests[0].requestHeaders;
          headers['Content-Type'].should.eql('application/x-www-form-urlencoded');
        });

        it('is json for type JSON', function(){
          Ajax.request({url: '', type: 'JSON'});
          var headers = this.requests[0].requestHeaders;
          headers['Content-Type'].should.eql('application/json');
        });
      });

      describe('request data', function(){
        it('defaults to URL encoded form data', function(){
          var ajax = new Ajax({url: ''});
          ajax.type.should.eql('URLENCODED');
        });

        describe('as json', function(){
          it('encodes data as json', function(){
            Ajax.request({url: '', method: 'POST', type: 'JSON', data: {url: 'http://nathansplace.co.uk'}});
            this.requests[0].requestBody.should.eql('{\"url\":\"http://nathansplace.co.uk\"}');
          });
        });

        describe('as url encoded', function(){
          it('url encodes data', function(){
            Ajax.request({url: '', method: 'POST', data: {url: 'http://nathansplace.co.uk'}});
            this.requests[0].requestBody.should.eql('url=http%3A%2F%2Fnathansplace.co.uk');
          });
        });
      });

      it('sends token if provided', function(){
        Ajax.request({url: '', token: 'something'});
        var headers = this.requests[0].requestHeaders;
        headers['X-CSRF-Token'].should.eql('something');
      });

      it('sets request headers if provided', function(){
        Ajax.request({url: '', headers: [{key: 'cow', value: 'moo'}]});
        var headers = this.requests[0].requestHeaders;
        headers.cow.should.eql('moo');
      });

      it('dosent send token if not provided', function(){
        Ajax.request({url: ''});
        var headers = this.requests[0].requestHeaders;
        (typeof headers['X-CSRF-Token']).should.eql('undefined');
      });

      it('sets a timeout', function(){
        Ajax.request({url: '', timeout: 1234});
        this.requests[0].timeout.should.eql(1234);
      });
    });

    describe('callback methods', function(){
      beforeEach(function(){
        this.start = sinon.spy();
        this.finish = sinon.spy();
        this.success = sinon.spy();
        this.error = sinon.spy();
        this.timeout = sinon.spy();

        this.options = {
          url: '',
          onStart: this.start,
          onFinish: this.finish,
          onError: this.error,
          onSuccess: this.success,
          onTimeout: this.timeout
        };
      });

      describe('#onSuccess', function(){
        it('gets called on success', function(done){
          Ajax.request(this.options);
          this.requests[0].respond(200, {'Content-Type': 'text/plain'}, 'FooBarBaz!');
          this.success.should.have.been.calledWith();
          done();
        });
      });

      describe('#onStart', function(){
        it('gets called before other callbacks', function(done){
          Ajax.request(this.options);
          this.requests[0].respond(200, {'Content-Type': 'text/plain'}, 'FooBarBaz!');
          this.success.should.have.been.calledAfter(this.start);
          done();
        });
      });

      describe('#onFinish', function(){
        it('gets called after other callbacks', function(done){
          Ajax.request(this.options);
          this.requests[0].respond(200, {'Content-Type': 'text/plain'}, 'FooBarBaz!');
          this.success.should.have.been.calledBefore(this.finish);
          done();
        });
      });

      describe('#onError', function(){
        it('gets called on error', function(done){
          Ajax.request(this.options);
          this.requests[0].respond(500, {'Content-Type': 'text/plain'}, 'FooBarBaz!');
          this.error.should.have.been.calledWith();
          done();
        });
      });

      describe('#onTimeout', function(){
        it('gets called on timeout', function(done){
          this.options.timeout = 1;
          Ajax.request(this.options);
          this.timeout.should.have.been.calledWith();
          done();
        });
      });

      // describe('#onProgress', function(){
      //   it('gets called on progress');
      // });
    });

    describe('Ajax.request()', function(){
      it('creates a new instance and calls #send', function(){
        var stub = sinon.stub(Ajax.prototype, 'send');
        Ajax.request({url: ''});
        stub.should.have.been.calledWith();
      });
    });
  });
})();

