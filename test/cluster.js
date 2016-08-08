var expect = require("chai").expect;
var converter = require("../api/pve-config");
var request = require('request');
var data_driven = require('data-driven');

var URL = "http://127.0.0.1:8000";


describe("CLUSTER ENDPOINT", function() {
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


    describe("GET /cluster/nextid", function() {
        let options = {
            method: 'GET',
            uri: URL + '/cluster/nextid',
            form: {}
        };
        it("Status 200", function(done) {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                done();
            });
        });
        it('Has ID', function(done) {
            request(options, (error, response, body) => {
                body = JSON.parse(body);
                expect(body).to.have.property('data');
                expect(body.data).to.be.a('string').with.length.within(2, 4);
                done();
            });
        });
    });


    describe("GET /cluster", function() {
        let options = {
            method: 'GET',
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
        [
            "destroy", "date", "_id"
        ].forEach((prop) => {
            it(`Property "${prop}"`, function(done) {
                request(options, (error, response, body) => {
                    body = JSON.parse(body);
                    body.forEach((item) => {
                        expect(item).to.have.property(prop);
                    });
                    done();
                });
            });
        });
    });
});
