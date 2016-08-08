var expect = require("chai").expect;
var converter = require("../api/pve-config");
var request = require('request');
var data_driven = require('data-driven');

var URL = "http://127.0.0.1:8000";


describe("NODE ENDPOINT", function() {

    describe("REPORT /node", function() {
        let options = {
            method: 'REPORT',
            uri: URL + '/node'
        };
        it("Status 200", function(done) {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                done();
            });
        });
        [
            "cpuinfo", "loadavg", "memory", "uptime",
            "wait", "ksm", "cpu", "idle", "rootfs", "swap"
        ].forEach((prop) => {
            it(`Property "${prop}"`, function(done) {
                request(options, (error, response, body) => {
                    body = JSON.parse(body);
                    Object.keys(body).forEach((nod) => {
                        expect(body[nod].data).to.have.property(prop);
                    });
                    done();
                });
            });
        });
    });

});
