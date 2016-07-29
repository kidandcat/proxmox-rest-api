const console = process.console;
router.options('/cluster', (req, res, next) => {
    res.setHeader('Allow', 'GET,REPORT');
    res.json({
        REPORT: 'Cluster status',
        GET: {
            default: {
                url: '/cluster',
                description: 'Return all machines in Destroy state'
            },
            nextId: {
                url: '/cluster/nextid',
                description: 'Get next free ID for VM'
            }
        },
        DELETE: {
            description: 'Delete all machines in Destroy state'
        },
    });
});

router.options('/node', (req, res, next) => {
    res.setHeader('Allow', 'REPORT');
    res.json({
        REPORT: 'Returns node status'
    });
});

router.options('/template', (req, res, next) => {
    res.setHeader('Allow', 'GET');
    res.json({
        GET: 'Returns template\'s list'
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
            username: 'string|Asociated Username',
            template: 'string',
            cpu: 'number',
            hostname: 'string',
            memory: 'number|megabytes',
            ostype: 'string|ubuntu,debian,centos,archlinux',
            storage: 'string',
            swap: 'number|megabytes',
            disk: 'number|gigabytes'
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
            template: 'Container templates',
            user: 'User management',
            cluster: 'Cluster manage and global methods',
        }
    });
});

//The best way to predict the future is to invent it.


module.exports = router;
