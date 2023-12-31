import {Router} from "express";
import axios from "axios";

const router = Router();

router.post('/diagnose', async (req, res) => {
    try {
        const externalApiResponse = await axios.get('https://emoapp-api.azurewebsites.net/uploadgetresults?input=' + encodeURI(req.body.text));

        const responseData = externalApiResponse.data;

        res.json({ success: true, data: responseData });
    } catch (error) {
        console.error('Error calling external API:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
export default router;
