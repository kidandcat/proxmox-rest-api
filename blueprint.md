FORMAT: 1A

# Proxmox-API

Proxmox-API is a simple API for wrap proxmox native API and automatize some processes.


# Group Users


## User [/user]


### GET

List Users

+ Request

            {
                "username": "Username or empty for all users"
            }

+ Response 200

        [
            {
                "username": "Username",
                "password": "User password",
                "_id": "Random database ID",
                "machines": "Optional, machines asigned to user"
            }
        ]


### POST

Create User

+ Request

            {
                "username": "Username",
                "password": "Password, minimum 6 length"
            }

+ Response 200

    + Body

                            OK


### DELETE

Delete User

+ Request

          {
                "username": "Username"
          }

+ Response 200

          OK



### PUT

Modify User

+ Request

        {
          "username": "Username cannot be modified",
          "password": "New Password"
        }

+ Response 200

        OK





# Group Node


## Node [/node]


### OPTIONS

Use method !!! REPORT !!!

+ Response 200

        {
          "NodeName": {
            "data": {
              "wait": 0.000136036768429333
              "idle": 0
              "pveversion": "pve-manager/4.2-2/725d76f0"
              "ksm": {
              "shared": 0
              },
              "loadavg": {
                0:  "0.18"
                1:  "0.16"
                2:  "0.12"
              },
              "swap": {
                "used": 0
                "free": 7381970944
                "total": 7381970944
              },
              "uptime": 533690
              "memory": {
                "used": 3843833856
                "free": 12661264384
                "total": 16505098240
              },
              "rootfs": {
                "used": 1452498944
                "free": 10738089984
                "avail": 12190588928
                "total": 14398062592
              },
              "cpuinfo": {
                "mhz": "3700.156"
                "cpus": 8
                "hvm": 1
                "user_hz": 100
                "model": "Intel(R) Core(TM) i7-2600 CPU @ 3.40GHz"
                "sockets": 1
              },
              "cpu": 0.0202444137719212,
              "kversion": "Linux 4.4.6-1-pve #1 SMP Thu Apr 21 11:25:40 CEST 2016"
            }
          }
        }


# Group Template

## Template [/template]

### GET

+ Response 200

        {
          "NodeName": {
            "data":[{
              "size": "In bytes",
              "format": "tgz...",
              "content": "vztmpl",
              "volid": "Template name"
              }]
          }
        }


# Group Utils

## VNC [/utils/vnc]

### GET

+ Request

        {
          "id": "Machine ID"
        }

- Response 200

        {
          "url": "url to novnc"
        }

## Graphics Data [/utils/graphic]

### GET

+ Request

        {
          "id": "Machine ID"
        }

+ Response 200

        {
          "NodeName": {
            "data": [{
              "maxdisk": 31572619264
              "mem": 7992713966.93333
              "maxcpu": 4
              "time": 1470232440
              "maxmem": 8589934592
              "cpu": 0.0217744457387679
              "disk": 5002742784
              "netin": 1
              "diskread": 0
              "netout": 0
              "diskwrite": 0
              }]
          }
        }


# Group Cluster

## Cluster [/cluster]

### OPTIONS

Use method !!! REPORT !!!

+ Response 200

        {
          "data": [{
            "type": "node"
            "uptime": 705900
            "maxmem": 3802484736
            "cpu": 0.00802893152633728
            "level": ""
            "disk": 1452847104
            "id": "node/pve2"
            "maxcpu": 4
            "maxdisk": 29194596352
            "mem": 752603136
            "node": "pve2"
            }]
        }


### GET

+ Response 200

        [{
          "destroy": "100"
          "date": "2016-08-03T15:18:07.220Z"
          "_id": "dLwIT9UxNhKq7nVt"
        }]



## Next ID [/cluster/nextid]

### GET

Return next free ID for a VM

+ Response 200

        {
          "data": 100
        }


# Group Container

## Container [/container]

### GET

You must specify ID or Username

+ Request

        {
          "id": 100,
          "username": "user"
        }

+ Response 200

        {
          "NodeName1": {
            "data": {
              "maxdisk": 32212254720
              "maxswap": 8589934592
              "name": "zimbra"
              "type": "lxc"
              "mem": 0
              "lock": ""
              "cpu": 0
              "netin": 0
              "netout": 0
              "template": ""
              "status": "stopped"
              "swap": 0
              "uptime": 0
              "maxmem": 8589934592
              "disk": 0
              "diskread": 0
              "ha": {
                "managed": 0
              },
              "diskwrite": 0
              "cpus": "4"
            }
          },
          "NodeName2": "Configuration file 'nodes/pve2/lxc/100.conf' does not exist - {"data":null}",
          "NodeName3": "Configuration file 'nodes/pve2/lxc/100.conf' does not exist - {"data":null}"
        }

### DELETE

+ Request

        {
          "id": 100
        }

+ Response 200

        {
          "message": "Machine status changed to destroy"
        }


### POST

+ Request

        {
          username: 'string|Asociated Username',
          template: 'string',
          cpu: 'number',
          hostname: 'string',
          memory: 'number|megabytes',
          ostype: 'string|ubuntu,debian,centos,archlinux',
          storage: 'string',
          swap: 'number|megabytes',
          disk: 'number|gigabytes'
        }

+ Response 200

        {
          "id": 100
        }
