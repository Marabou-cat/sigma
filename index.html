<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Study</title>
    <style>
        /* CSS: Dark Mode Browser Look */
        body, html { margin: 0; padding: 0; height: 100%; background: #121212; font-family: sans-serif; overflow: hidden; }
        
        .omnibox {
            display: flex; gap: 10px; padding: 12px;
            background: #1e1e1e; border-bottom: 1px solid #333;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        #url-input {
            flex-grow: 1; padding: 12px 20px;
            border-radius: 8px; border: 1px solid #333;
            background: #2c2c2c; color: #fff; font-size: 16px; outline: none;
        }

        #go-btn {
            padding: 10px 25px; border-radius: 8px; border: none;
            background: #fe2c55; color: white; font-weight: bold; cursor: pointer;
        }
        #go-btn:hover { background: #e0244a; }

        /* The Viewport */
        #browser-frame {
            width: 100%; height: calc(100% - 70px);
            border: none; background: white;
            display: block;
        }
    </style>
</head>
<body>

    <div class="omnibox">
        <input type="text" id="url-input" placeholder="Enter URL (e.g. tiktok.com)..." />
        <button id="go-btn">GO</button>
    </div>

    <iframe id="browser-frame" src="about:blank"></iframe>

    <script>
        // CONFIGURATION:
        // If you are running locally, keep this as localhost.
        // If you upload server.js to Render, put that URL here (e.g., https://my-app.onrender.com)
        const BACKEND_URL = "http://localhost:3000"; 

        const input = document.getElementById('url-input');
        const frame = document.getElementById('browser-frame');
        const btn = document.getElementById('go-btn');

        function navigate() {
            let target = input.value.trim();
            if (!target) return;

            // Ensure protocol exists
            if (!target.startsWith('http')) target = 'https://' + target;

            // Construct the Proxy URL
            // We send the target URL to our backend as a parameter
            const finalLink = `${BACKEND_URL}/proxy?url=${encodeURIComponent(target)}`;
            
            console.log("Loading via Proxy:", finalLink);
            frame.src = finalLink;
        }

        btn.addEventListener('click', navigate);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') navigate();
        });
    </script>
</body>
</html>
