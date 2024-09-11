const subscribeUrl = 'http://localhost:3000/subscribe';
const subscribeBody = { url: 'http://localhost:4000/webhook' };

const triggerEventUrl = 'http://localhost:3000/trigger-event';

async function sendRequest<T>(url: string, body: T, headers: HeadersInit = {}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(body)
        });

        const text = await response.text();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log(`Response from ${url}: ${text}`);
    } catch (error) {
        console.error(`Error sending request to ${url}:`, error);
    }
}

(async () => {
    console.log('Subscribing to webhook...');
    await sendRequest(subscribeUrl, subscribeBody);
    console.log('Triggering event...');
    await sendRequest(triggerEventUrl, {});
})();
