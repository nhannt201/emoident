import 'regenerator-runtime/runtime'
import React, { useState } from "react";
import {TextField,  Typography} from "@mui/material";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import generateToken from "../helper/generateToken";
import ProgressBox from "./ProgressBox";
import ListAction from "./ListAction";
import StyledMainBox from "./StyledMainBox";
import ExtendBox from "./ExtendBox";
import HeaderMainBox from "./HeaderMainBox";

function EmotionAnalyzer() {
    const [text, setText] = useState("");
    const [emotionScore, setEmotionScore] = useState(null);
    const [emotionLabel, setEmotionLabel] = useState("Tốt");
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState('blue')

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = async () => {
        if(text.trim().length < 2) return;

        try {
            setLoading(true);
            // Tôi biết bạn sẽ đọc được mà :))
            const token = generateToken()
            const response = await axios.post("/api/diagnose", {text, token});
            const {score, label} = response.data.data;
            const isBadState = +label === 0;
            const emotionLabel = isBadState ? "Tệ" : "Tốt"
            setEmotionLabel(emotionLabel)
            setEmotionScore(score);

            if(isBadState) {
                if(score > 0.75) {
                    setColor('#f84a00')
                } else {
                    setColor('#ef9479')
                }
            } else {
                if(score > 0.75) {
                    setColor('#008000')
                } else {
                    setColor('#a3ad09')

                }
            }

        } catch (error) {
            console.error("Không thể phân tích nội dung yêu cầu:", error);
        } finally {
            setLoading(false);
        }
    };


    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({language: 'vi-VN'});

    React.useEffect(() => {
        setText(transcript);
    }, [transcript]);

    const startListening = function () {
        resetTranscript();
        SpeechRecognition.startListening({continuous: true})
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
    }


    const [language, setLanguage] = useState('en-US')
    React.useEffect(() => {
        setLanguage(navigator.language)
    }, [])
    const isSupportVNs = language === 'vi-VN';

    React.useEffect(() => {
        if(text.trim().length <= 2) return;

        const timeout = setTimeout(() => {
            handleSubmit();
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [text]);


    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <HeaderMainBox/>
            <StyledMainBox
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    placeholder="Hãy mô tả cảm xúc của bạn"
                    onChange={handleTextChange}
                    value={text}
                    inputProps={{
                        maxLength: 5000,
                    }}
                    sx={{ marginBottom: '20px' }}
                />
                <Typography variant="body2" sx={{ color: 'grey', marginBottom: '10px' }}>
                    Đã nhập: {text.length} / 5000 kí tự
                </Typography>

                <ListAction
                    isSupportVNs={isSupportVNs}
                    handleSubmit={handleSubmit}
                    listening={listening}
                    startListening={startListening}
                    stopListening={stopListening}
                    text={text}
                    setText={setText}
                    loading={loading}
                    browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
                />

                {emotionScore !== null && (
                    <ProgressBox color={color} emotionLabel={emotionLabel} emotionScore={emotionScore}/>
                )}

            </StyledMainBox>

          <ExtendBox/>

        </div>
    );
};

export default EmotionAnalyzer;
