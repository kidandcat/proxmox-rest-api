router.options('/cluster', (req, res, next) => {
    res.setHeader('Allow', 'GET,REPORT');
    res.json({
        REPORT: 'Cluster status',
        GET: {
            nextId: {
                url: '/cluster/nextid',
                description: 'Get next free ID for VM'
            }
        }
    });
});

router.options('/node', (req, res, next) => {
    res.setHeader('Allow', 'REPORT');
    res.json({
        REPORT: 'Returns node status'
    });
});

router.options('/user', (req, res, next) => {
    res.setHeader('Allow', 'GET,PUT,POST,DELETE');
    res.json({
      GET: {
          username: 'string'
      },
      POST: {
          username: 'string',
          password: 'string'
      },
      PUT: {
          username: 'string',
          password: 'string| new password'
      },
      DELETE: {
          username: 'string'
      },
    });
});

router.options('/container', (req, res, next) => {
    res.setHeader('Allow', 'POST,GET,DELETE');
    res.json({
        POST: {
            template: 'string',
            cpu: 'number',
            hostname: 'string',
            memory: 'number|megabytes',
            ostype: 'string|ubuntu,debian,centos,archlinux',
            storage: 'string',
            swap: 'number|megabytes',
            disk: 'number|gigabytes',
            username: 'string|Asociated Username'
        },
        DELETE: {
            id: 'number'
        },
        GET: {
            id: 'number|optional',
            username: 'string|optional'
        }
    });
});

router.options('/', (req, res, next) => {
    res.setHeader('Allow', 'GET,OPTIONS');
    res.json({
        Endpoints: {
            container: 'LXC containers',
            node: 'Proxmox Cluster Nodes',
            vm: 'Virtual Machines under KVM', //TODO:VM management
            template: 'Container templates',
            user: 'User management', //TODO:User endpoint options
            cluster: 'Cluster manage and global methods',
        }
    });
});


module.exports = router;
