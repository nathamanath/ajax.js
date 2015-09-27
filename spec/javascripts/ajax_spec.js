describe('Ajax', function(){
  beforeEach(function(){
    jasmine.Ajax.install();
  });

  afterEach(function(){
    jasmine.Ajax.uninstall();
  });


  describe('#configure', function() {
    it('sets defaults for future calls to #request');
  });



  describe('#request', function() {

    it('requires args.url', function(){
      expect(function() {
        Ajax.request({})
      }).toThrow(new Error('Ajax: URL required'));
      // TODO: I18n would make this maintainable
    });








    it('sets request method', function() {
         Ajax.request({
          url: '/',
          method: 'POST'
        });

        expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
    });


    describe('args.type', function() {
      it('must be valid', function() {
        expect(function() {
          Ajax.request({
            url: '/',
            type: 'WRONG'
          });
        }).toThrow(new Error('Ajax: Invalid type'));
      });

      describe('JSON', function() {
        it('sets content type header', function() {
          Ajax.request({
            url: '/',
            type: 'JSON'
          });

          expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Content-Type']).toBe('application/json');
        });


        it('encodes data as json', function() {
          var data = { name: 'nathan' };

          Ajax.request({
            url: '/',
            type: 'JSON',
            data: data
          });

          expect(jasmine.Ajax.requests.mostRecent().params).toBe(JSON.stringify(data));
        });
      });



      describe('URLENCODED', function() {

        it('sets content type header', function() {
          Ajax.request({
            url: '/',
            data: {
              url: 'http://nathansplace.co.uk'
            }
          });

          expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded');
        });


        it('url encodes data', function() {

          Ajax.request({
            url: '/',
            data: {
              url: 'http://nathansplace.co.uk'
            }
          });

          var encoded = 'url=http%3A%2F%2Fnathansplace.co.uk'
          expect(jasmine.Ajax.requests.mostRecent().params).toBe(encoded);
        });


      });


    });



    describe('args.data', function() {
      it('takes an object');
      it('takes a form object');
      it('takes FormData instance');
    });



    describe('args.token', function() {
      it('sets no token header by default', function() {
        Ajax.request({
          url: '/',
          method: 'POST'
        });

        expect(jasmine.Ajax.requests.mostRecent().requestHeaders['X-CSRF-Token']).toBe(undefined);
      });


      it('uses csrf meta tag if present', function() {
        var tag = document.createElement('meta');

        tag.name = 'csrf-token';
        tag.content = 'TESTING';

        document.body.appendChild(tag);

        Ajax.request({
          url: '/',
          method: 'POST'
        });

        expect(jasmine.Ajax.requests.mostRecent().requestHeaders['X-CSRF-Token']).toBe('TESTING');

        tag.parentNode.removeChild(tag);
      });


      it('overrides meta tag', function() {
        var tag = document.createElement('meta');

        tag.name = 'csrf-token';
        tag.content = 'TESTING';

        document.body.appendChild(tag);

        Ajax.request({
          url: '/',
          method: 'POST',
          token: '123'
        });

        expect(jasmine.Ajax.requests.mostRecent().requestHeaders['X-CSRF-Token']).toBe('123');

        tag.parentNode.removeChild(tag);
      })
    });





    describe('args.timeout', function() {
      it('sets request timeout', function() {
        Ajax.request({
          url: '/',
          timeout: 1234
        });

        expect(jasmine.Ajax.requests.mostRecent().timeout).toBe(1234);
      });
    });





    describe('args.headers', function() {

      it('sets headers', function() {
        Ajax.request({
          url: '/',
          headers: {
            key: 'value'
          }
        });

        expect(jasmine.Ajax.requests.mostRecent().requestHeaders['key']).toBe('value');
      })
    });



    describe('callbacks', function() {
      var spy;

      beforeEach(function() {
        spy = jasmine.createSpy();
      });

      describe('args.onStart', function() {
        it('is called at start of request', function() {

          Ajax.request({
            url: '/',
            onStart: spy
          });

          expect(spy).toHaveBeenCalled();
        });
      });


      describe('args.onSuccess', function() {
        it('is called on success', function() {
          Ajax.request({
            url: '/',
            onSuccess: spy
          });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200
          });

          expect(spy).toHaveBeenCalled();
        });

        it('is not called on fail', function() {
          Ajax.request({
            url: '/',
            onSuccess: spy
          });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 500
          });

          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('args.onError', function() {
        it('is called on error', function() {
          Ajax.request({
            url: '/',
            onError: spy
          });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 500
          });

          expect(spy).toHaveBeenCalled();
        });

        it('is not called on success', function() {
          Ajax.request({
            url: '/',
            onError: spy
          });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200
          });

          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('args.onFinish', function() {
        it('is called on finish', function() {
          Ajax.request({
            url: '/',
            onFinish: spy
          });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200
          });

          expect(spy).toHaveBeenCalled();
        });
      });

      // FIX: Cant get jasmine to do this, but it works

      // describe('args.onTimeout', function() {
      //   it('is called on timeout', function(done) {
      //     Ajax.request({
      //       url: '/',
      //       timeout: 100,
      //       onTimeout: spy
      //     });

      //     window.setTimeout(function() {
      //       expect(spy).toHaveBeenCalled();
      //       done();
      //     }, 150);
      //   });
      // });

    });


  });
});
