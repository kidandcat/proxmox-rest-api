var expect = require("chai").expect;
var converter = require("../api/pve-config");
var request = require('request');
var data_driven = require('data-driven');

var URL = "http://127.0.0.1:8000";


describe("PERFORMANCE", function() {

    describe("TEST", function() {
        let options = {
            method: 'REPORT',
            uri: URL + '/node'
        };

        for (let i = 0; i < 100; i++) {
            it("Status 200", function(done) {
                request(options, (error, response, body) => {
                    expect(response.statusCode).to.equal(200);
                    expect(error).to.equal(null);
                    done();
                });
            });
        }
    });

});
