import {Router} from "express";
import axios from "axios";
import generateToken from "../helper/generateToken";
import * as admin from "firebase-admin";

const router = Router();

router.post('/diagnose', async (req, res) => {
    try {
        const {text, token} = req.body
        const makeToken = generateToken()
        if(makeToken !== token) {
            res.status(403).json({ success: false, error: 'Bạn không có quyền truy cập API này' });
            return;
        }
        const externalApiResponse = await axios.get('https://emoapp-api.azurewebsites.net/uploadgetresults?input=' + encodeURI(text));

        const responseData = externalApiResponse.data;

        const database = admin.database();
        const databaseRef = database.ref('history');

        const {label, score} = responseData
        const newHistoryData = {
            text,
            label,
            score
        };
        databaseRef.push(newHistoryData);


        res.json({ success: true, data: responseData });
    } catch (error) {
        console.error('Error calling external API:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
export default router;
