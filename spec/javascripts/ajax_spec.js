describe('Ajax', function(){
  beforeEach(function(){
    jasmine.Ajax.install();
  });

  afterEach(function(){
    jasmine.Ajax.uninstall();
  });


  describe('#request', function() {

    it('requires args.url', function(){
      expect(function() {
        Ajax.request({})
      }).toThrow(new Error('Ajax: URL required'));
      // TODO: I18n would make this maintainable
    });





    describe('args.params', function() {

      it('sets params from js object', function() {

        Ajax.request({
          url: '/',
          data: {
            name: 'nathan',
            cool: true
          }
        });

        var encoded = 'name=nathan&cool=true'
        expect(jasmine.Ajax.requests.mostRecent().params).toBe(encoded);

      });


      it('sets params form FormData instance', function() {

        var data = new FormData();

        data.append('name', 'nathan');
        data.append('cool', true);

        Ajax.request({
          url: '/',
          data: data
        });

        var encoded = 'name=nathan&cool=true'
        expect(jasmine.Ajax.requests.mostRecent().params).toBe(encoded);

      });

    });


  });
});
