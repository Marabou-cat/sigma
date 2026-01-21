import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import express from 'express';
import fetch from 'node-fetch'; // Standard in Node 18+, but safe to import

// CONFIGURATION
const PORT = 8080;
const UV_VERSION = '2.0.0'; // Version of Ultraviolet to pull from CDN
const CDN_URL = `https://unpkg.com/@titaniumnetwork-dev/ultraviolet@${UV_VERSION}/dist/`;

const app = express();
const server = createServer();

// 1. Create the "Bare" Server (The engine that bypasses blocks)
const bare = createBareServer('/bare/');

// 2. Serve the Kiosk Frontend (Embedded HTML)
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ultraviolet Single-File Kiosk</title>
    <style>
        body { margin: 0; background: #111; color: white; font-family: sans-serif; overflow: hidden; display: flex; flex-direction: column; height: 100vh; }
        .omnibox { display: flex; padding: 10px; background: #222; border-bottom: 1px solid #444; }
        input { flex: 1; padding: 8px; border-radius: 5px; border: none; background: #333; color: white; }
        button { margin-left: 10px; padding: 8px 15px; border: none; background: #007bff; color: white; cursor: pointer; border-radius: 5px; }
        iframe { flex: 1; border: none; width: 100%; background: #fff; }
    </style>
    <script src="/uv/uv.bundle.js" defer></script>
    <script src="/uv/uv.config.js" defer></script>
</head>
<body>
    <div class="omnibox">
        <input id="url" type="text" placeholder="Enter URL (e.g. tiktok.com)" />
        <button id="go">Go</button>
    </div>
    <iframe id="frame"></iframe>
    <script>
        const input = document.getElementById('url');
        const frame = document.getElementById('frame');
        
        // This function registers the Service Worker (The Magic)
        async function registerSW() {
            if (!navigator.serviceWorker) throw new Error("Your browser doesn't support Service Workers");
            await navigator.serviceWorker.register('/uv.sw.js', { scope: '/service/' });
        }

        async function go() {
            let url = input.value.trim();
            if (!url) return;
            if (!url.startsWith('http')) url = 'https://' + url;

            // Register SW first
            await registerSW();

            // Encode the URL using UV's logic (XOR encoding is standard)
            // For this simple script, we use the UV config's encodeUrl function which we load above
            // But since we are inside the module, we can access the global __uv$config if loaded
            
            // Navigate the iframe to the service worker path
            frame.src = '/service/' + __uv$config.encodeUrl(url);
        }

        document.getElementById('go').onclick = go;
        input.onkeydown = (e) => { if(e.key === 'Enter') go(); };
    </script>
</body>
</html>
    `);
});

// 3. Serve the UV Config (Dynamic Generation)
app.get('/uv/uv.config.js', (req, res) => {
    res.type('application/javascript');
    res.send(`
/* UV Configuration */
self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv.sw.js',
};
    `);
});

// 4. Serve the Service Worker (Dynamic Generation)
app.get('/uv.sw.js', (req, res) => {
    res.type('application/javascript');
    // The service worker must import the bundle and handler
    res.send(`
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.handler.js');
importScripts('/uv/uv.config.js');

const uv = new UVServiceWorker();

self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => {
            if (uv.route(event)) {
                return await uv.fetch(event);
            }
            return await fetch(event.request);
        })()
    );
});
    `);
});

// 5. Proxy the "Heavy" UV files from CDN (Magic Step)
// This prevents you from needing to download uv.bundle.js locally
const proxyCDN = async (req, res, filename) => {
    try {
        const response = await fetch(CDN_URL + filename);
        if (!response.ok) throw new Error('CDN fetch failed');
        const content = await response.buffer();
        res.type('application/javascript');
        res.send(content);
    } catch (e) {
        res.status(500).send('Error loading UV file from CDN');
    }
};

app.get('/uv/uv.bundle.js', (req, res) => proxyCDN(req, res, 'uv.bundle.js'));
app.get('/uv/uv.handler.js', (req, res) => proxyCDN(req, res, 'uv.handler.js'));


// 6. Handle Bare Server Requests
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(PORT, () => {
    console.log(\`
    -------------------------------------------
    ULTRAVIOLET SINGLE-FILE SERVER RUNNING
    -------------------------------------------
    Local: http://localhost:\${PORT}
    
    1. Open your browser to the URL above.
    2. Type "tiktok.com"
    3. Enjoy.
    -------------------------------------------
    \`);
});
