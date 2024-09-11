import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
app.use(bodyParser.json());

const SECRET = 'your-secret-key';

function verifyHmac(data: Event, signature: string): boolean {
    const hmac = crypto.createHmac('sha256', SECRET);
    const calculatedSignature = hmac.update(JSON.stringify(data)).digest('hex');
    return calculatedSignature === signature;
}

app.post('/webhook', (req: Request, res: Response) => {
    const receivedSignature = String(req.headers['x-signature'])

    if (!receivedSignature) {
        return res.status(400).send({ error: 'No signature provided' });
    }

    const isValid = verifyHmac(req.body, receivedSignature);

    if (!isValid) {
        console.log('Invalid HMAC signature');
        return res.status(401).send({ error: 'Invalid signature' });
    }

    console.log('Webhook received and verified:', req.body);
    res.status(200).send({ message: 'Webhook received and verified' });
});

app.listen(4000, () => {
    console.log('Client server is running on port 4000');
});
