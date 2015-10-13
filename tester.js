var assert = require("assert");
var request = require("request");
//var should = require('should');
//var request = require('supertest');

var baseUrl = "http://localhost:3000/v1";
var t = {
	"case1": [{
			opt: {
				 url: baseUrl + '/myapp/123',
				 method: 'POST',
				 json: {
					 aaa: 123
				 },
				 headers: {
					 name: "simon"
				 }
		 },
		 expect: {
			 code: 200,
			 value: "ok",
			 /*
		   valueCallback: function(e, r, d, done) {
			 	 if(e) return console.log(e);
				 console.log(d);
         done();
			 }
		   */	 
		 }
	}]
}


Object.keys(t).forEach(function(v) {
	//console.log("Processing.....", v);
	
	describe(v, function() {
		var o = t[v];
    
	  it("testing..." + v, function(done) {	
		  doit(o.shift(), done);
		});

		function doit(x, done) {
			//console.log("  doing....", x);
			//console.log("  doing opt....", x["opt"]);

			request(x["opt"], function (e,r,d) {

				//console.log("err:", e);
				//console.log("response:", d);

				if(e) return console.log(e);
				if(x["expect"]["valueCallback"]){
				  console.log("doing function...");
					return x["expect"]["valueCallback"](e, r, d, done);
				} else {
					//if( x["expect"]["code"] != r.statusCode ) 
					//	console.log("status code error, got code:%s, should be:%s", x["expect"]["code"], r.statusCode);

			    //console.log("code: %s::%s", x["expect"]["code"], r.statusCode);
			    assert.equal(x["expect"]["code"], r.statusCode);
				
					//console.log("value: %s::%s", x["expect"]["value"], d);
					assert.equal(x["expect"]["value"], d);
			    //TODO: check value

				}

			  if( o.length > 0 ) {
				  doit(o.shift());
			  } else {
					done();
				}

			});
		}

	});
})
