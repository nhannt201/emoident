// server.js
import express from 'express';
const port = process.env.PORT || 3001;

let app = require('./server').default;

if (module.hot) {
    module.hot.accept('./server', () => {
        // eslint-disable-next-line no-console
        console.log('🔁  HMR Reloading `./server`...');
        try {
            // eslint-disable-next-line global-require
            app = require('./server').default;
        } catch (error) {
            console.error(error);
        }
    });
    console.info('✅  Server-side HMR Enabled!');
}

export default express()
    .use((req, res) => app.handle(req, res))
    .listen(port, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        // eslint-disable-next-line no-console
        console.log(`> Started on port ${port}`);
    });
