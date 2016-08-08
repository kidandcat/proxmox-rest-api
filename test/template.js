var expect = require("chai").expect;
var converter = require("../api/pve-config");
var request = require('request');
var data_driven = require('data-driven');

var URL = "http://127.0.0.1:8000";


describe("TEMPLATE ENDPOINT", function() {

    describe("GET /template", function() {
        let options = {
            method: 'GET',
            uri: URL + '/template'
        };
        it("Status 200", function(done) {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                done();
            });
        });
        [
            "format", "volid", "content", "size"
        ].forEach((prop) => {
            it(`Property "${prop}"`, function(done) {
                request(options, (error, response, body) => {
                    body = JSON.parse(body);
                    body.data.forEach((item) => {
                            expect(item).to.have.property(prop);
                    });
                    done();
                });
            });
        });
    });

});
