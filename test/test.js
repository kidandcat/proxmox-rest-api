var expect = require("chai").expect;
var converter = require("../api/pve-config");
var request = require('request');
var data_driven = require('data-driven');

var URL = "http://127.0.0.1:8000";

describe("Cluster Endpoint", function() {
    describe("REPORT /cluster", function() {
        let options = {
            method: 'REPORT',
            uri: URL + '/cluster',
            form: {}
        };
        it("Status 200", function(done) {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                done();
            });
        });

        it('Has "data"', function(done) {
            request(options, (error, response, body) => {
                body = JSON.parse(body);
                expect(body).to.have.property('data');
                expect(body.data).to.be.an('array');
                done();
            });
        });

        [
            "type", "uptime", "maxmem", "cpu", "level", "disk",
            "id", "maxcpu", "maxdisk", "mem", "node"
        ].forEach((prop) => {
            it(`Property "${prop}"`, function(done) {
                request(options, (error, response, body) => {
                    body = JSON.parse(body);
                    expect(body.data[0]).to.have.property(prop);
                    done();
                });
            });
        });



    });
});
