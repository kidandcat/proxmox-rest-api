var expect = require("chai").expect;
var converter = require("../api/pve-config");
var request = require('request');
var data_driven = require('data-driven');

var URL = "http://127.0.0.1:8000";


describe("USER ENDPOINT", function() {

    describe("POST /user", function() {
        let options = {
            method: 'POST',
            uri: URL + '/user',
            form: {
                username: "unitTest",
                password: "unitTest"
            }
        };
        it("Status 200", function(done) {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                done();
            });
        });
        it("Data OK", function(done) {
            request(options, (error, response, body) => {
                expect(body).to.equal('OK');
                done();
            });
        });
    });

    describe("GET /user", function() {
        let options = {
            method: 'GET',
            uri: URL + '/user',
            form: {
                username: "unitTest"
            }
        };
        it("Status 200", function(done) {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                done();
            });
        });
        [
            "username", "password"
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

    describe("PUT /user", function() {
        let options = {
            method: 'PUT',
            uri: URL + '/user',
            form: {
                username: "unitTest",
                password: "unitTest"
            }
        };
        it("Status 200", function(done) {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                done();
            });
        });
        it("Data OK", function(done) {
            request(options, (error, response, body) => {
                expect(body).to.equal('OK');
                done();
            });
        });
    });

    describe("DELETE /user", function() {
        let options = {
            method: 'DELETE',
            uri: URL + '/user',
            form: {
                username: "unitTest"
            }
        };
        it("Status 200", function(done) {
            request(options, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                done();
            });
        });
        it("Data OK", function(done) {
            request(options, (error, response, body) => {
                expect(body).to.equal('OK');
                done();
            });
        });
    });

});
