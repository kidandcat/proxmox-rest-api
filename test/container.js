var expect = require("chai").expect;
var converter = require("../api/pve-config");
var request = require('request');
var data_driven = require('data-driven');

var URL = "http://127.0.0.1:8000";
let username = "unitTest" + Math.floor((Math.random() * 10) + 1);

xdescribe("CONTAINER ENDPOINT", function() {

    it("Create Demo User", function(done) {
        let opt = {
            method: 'POST',
            uri: URL + '/user',
            form: {
                username: username,
                password: username
            }
        };
        request(opt, (error, response, body) => {
            expect(body).to.equal('OK');
            done();
        });
    });


    describe("POST /container", function() {
        let options = {
            method: 'POST',
            uri: URL + '/container',
            form: {
                username: username,
                template: 'local:vztmpl/ubuntu-16.04-standard_16.04-1_amd64.tar.gz',
                cpu: '1',
                hostname: 'unitTest',
                memory: '512',
                ostype: 'ubuntu',
                storage: 'local-lvm',
                swap: '512',
                disk: '3'
            }
        };
        it('Machine created', function(done) {
            request(options, (error, response, body) => {
                body = JSON.parse(body);
                expect(response.statusCode).to.equal(200);
                expect(error).to.equal(null);
                expect(body).to.have.property('id');
                expect(body.id).to.be.a('string').with.length.within(2, 4);
                done();
            });
        });
    });

    describe("GET /container", function() {
        let ok = false;
        let options = {
            method: 'GET',
            uri: URL + '/container?username=' + username
        };
        it('Machine Info', function(done) {
            request(options, (error, response, body) => {
                body = JSON.parse(body);
                expect(response.statusCode).to.equal(200);
                if (response.statusCode == 200) {
                    ok = true;
                }
                expect(error).to.equal(null);
                done();
            });
        });

        it(`Properties`, function(done) {
            request(options, (error, response, body) => {
                body = JSON.parse(body);
                let props = [
                    "template", "netout", "netin", "cpu", "mem", "type",
                    "maxswap", "name", "maxdisk", "cpus", "diskwrite", "pid",
                    "diskread", "disk", "maxmem", "uptime", "swap", "status"
                ];

                props.forEach((p) => {
                    it(p, (done) => {
                        expect(body.data).to.have.property(p);
                        done();
                    })
                });
                setTimeout(() => {
                    done();
                }, 30000);
            });
        });

    });

    describe("DELETE /container", function() {
        it('Deleted', function(done) {
            request({
                method: 'GET',
                uri: URL + '/cluster/nextid',
                form: {}
            }, (error, response, bod) => {
                bod = JSON.parse(bod);
                request({
                    method: 'DELETE',
                    uri: URL + '/container',
                    form: {
                      id: Number(bod.data - 1)
                    }
                }, (error, response, body) => {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.equal(200);
                    expect(error).to.equal(null);
                    expect(body.message).to.equal("Machine status changed to destroy");
                    done();
                });
            });
        });
    });


    describe("Delete Demo User", function() {
        it("Delete Demo User", function(done) {
            let opt2 = {
                method: 'DELETE',
                uri: URL + '/user',
                form: {
                    username: username
                }
            };
            request(opt2, (error, response, body) => {
                expect(body).to.equal('OK');
                done();
            });
        });
    });


});
