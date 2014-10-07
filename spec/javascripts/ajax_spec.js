describe('Ajax', function(){
  beforeEach(function(){
    jasmine.Ajax.install();
  });

  afterEach(function(){
    jasmine.Ajax.uninstall();
  });

  it('requires args.url', function(){
    expect(function(){new Ajax({})}).toThrow(new Error('Ajax requires a url.'));
  });

  it('requires valid args.method', function(){
    var fn = function(){new Ajax({url: '', method: 'HATS'})};
    expect(fn).toThrow(new Error('Ajax method must be valid.'));
  });

  it('requires valid args.contentType', function(){
    var fn = function(){new Ajax({url: '', type: 'FLAGS'})};
    expect(fn).toThrow(new Error('Ajax content type must be valid.'));
  });

  describe('#send', function(){
    it('fires off an XMLHttpRequest', function(){
      var start = jasmine.createSpy('success');
      new Ajax({url: '/bla', onSuccess: start}).send();
      expect(typeof jasmine.Ajax.requests.mostRecent()).not.toEqual('undefined')
    });

    it('uses selected http method', function(){
      Ajax.request({url: '', method: 'HEAD'});
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('HEAD');
    });

    describe('content type', function(){
      it('defaults to x-www-form-urlencoded', function(){
        Ajax.request({url: ''});
        var headers = jasmine.Ajax.requests.mostRecent().requestHeaders;
        expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
      });

      it('sets content type', function(){
        Ajax.request({url: '', type: 'JSON'});
        var headers = jasmine.Ajax.requests.mostRecent().requestHeaders;
        expect(headers['Content-Type']).toBe('application/json');
      });
    });

    describe('request data', function(){
      it('defaults to URL encoded form data', function(){
        var ajax = new Ajax({url: ''});
        expect(ajax.type).toBe('URLENCODED');
      });

      it('encodes data as json', function(){
        Ajax.request({
          url: '',
          method: 'POST',
          type: 'JSON',
          data: {url: 'http://nathansplace.co.uk'}
        });

        var json = '{\"url\":\"http://nathansplace.co.uk\"}';
        expect(jasmine.Ajax.requests.mostRecent().params).toBe(json);
      });

      it('url encodes data', function(){
        Ajax.request({
          url: '',
          method: 'POST',
          data: {url: 'http://nathansplace.co.uk'}
        });

        var encoded = 'url=http%3A%2F%2Fnathansplace.co.uk'
        expect(jasmine.Ajax.requests.mostRecent().params).toBe(encoded);
      });

      it('sends csrf token header if provided', function(){
        Ajax.request({url: '', token: 'bla'});
        var headers = jasmine.Ajax.requests.mostRecent().requestHeaders;
        expect(headers['X-CSRF-Token']).toBe('bla');
      });

      it('dosent set header if not provided', function(){
        Ajax.request({url: ''});
        var headers = jasmine.Ajax.requests.mostRecent().requestHeaders;
        expect(typeof headers['X-CSRF-Token']).toBe('undefined');
      });

      it('sets request headers', function(){
        Ajax.request({url: '', headers: [{key: 'cow', value: 'moo'}]});
        var headers = jasmine.Ajax.requests.mostRecent().requestHeaders;
        expect(headers.cow).toBe('moo');
      });

      it('sets timeout', function(){
        Ajax.request({url: '', timeout: 1234});
        expect(jasmine.Ajax.requests.mostRecent().timeout).toBe(1234);
      });
    });

    describe('callbacks', function(){
      it('calls args.onSuccess on success', function(){
        var spy = jasmine.createSpy('success');
        Ajax.request({url: '', onSuccess: spy});

        expect(spy).not.toHaveBeenCalled();

        jasmine.Ajax.requests.mostRecent().response({
          "status": 200
        });

        expect(spy).toHaveBeenCalled();
      });

      it('calls args.onStart on start', function(){
        var spy = jasmine.createSpy();
        Ajax.request({url: '', onStart: spy});
        expect(spy).toHaveBeenCalled();
      });

      it('calls args.onFinish on finish', function(){
        var spy = jasmine.createSpy();
        Ajax.request({url: '', onFinish: spy});
        expect(spy).not.toHaveBeenCalled();

        jasmine.Ajax.requests.mostRecent().response({
          "status": 200
        });

        expect(spy).toHaveBeenCalled();
      });

      it('calls args.onError on error', function(){
        var spy = jasmine.createSpy();
        Ajax.request({url: '', onError: spy});
        expect(spy).not.toHaveBeenCalled();

        jasmine.Ajax.requests.mostRecent().response({
          "status": 500
        });

        expect(spy).toHaveBeenCalled();
      });

      it('calls args.onTimeout on time out', function(){
        var spy = jasmine.createSpy();
        Ajax.request({url: '', timeout: 0, onTimeout: spy});

        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('#request', function(){
    it('creates a new instance and calls .send', function(){
      spyOn(Ajax.prototype, 'send');
      Ajax.request({url: ''});
      expect(Ajax.prototype.send).toHaveBeenCalled();
    });
  });
});

