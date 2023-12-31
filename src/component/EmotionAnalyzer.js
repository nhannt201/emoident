import 'regenerator-runtime/runtime'
import React, { useState } from "react";
import {TextField, Button, LinearProgress, Typography, Box} from "@mui/material";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
        try {
            setLoading(true);
            const response = await axios.post("/api/diagnose", {text});
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


    const { transcript, listening, resetTranscript } = useSpeechRecognition({language: 'vi-VN'});

    React.useEffect(() => {
        setText(transcript);
    }, [transcript]);

    const startListening = function () {
        resetTranscript();
        SpeechRecognition.startListening({continuous: true})
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
       if(text.trim().length > 2)  handleSubmit();
    }


    const [language, setLanguage] = useState('en-US')
    React.useEffect(() => {
        setLanguage(navigator.language)
    }, [])
    const isSupportVNs = language === 'vi-VN';

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
                Emoident
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: '20px', color: 'grey' }}>
                 Thang đo cảm xúc trong văn bản
            </Typography>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                    width: '60%',
                    margin: 'auto',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '20px',
                }}
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
                <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ marginBottom: '20px', gap: '10px' }}
                >
                    <Button
                        variant="contained"
                        onClick={listening ? stopListening : startListening}
                        disabled={!isSupportVNs}
                        sx={{
                            background: '#2196f3',
                            color: '#fff',
                            '&:hover': {
                                background: '#1565c0',
                            },
                        }}
                    >
                        {listening ? 'Dừng nói' : 'Nói để điền nội dung'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            background: '#4caf50',
                            color: '#fff',
                            '&:hover': {
                                background: '#388e3c',
                            },
                        }}
                    >
                        {loading ? 'Đang xử lý...' : 'Phân tích'}
                    </Button>
                </Box>

                {emotionScore !== null && (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ marginTop: '20px', fontWeight: 'bold' }}>
                            Mức độ cảm xúc: {emotionLabel} - {Math.round(emotionScore * 100)}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={emotionScore * 100}
                            sx={{
                                marginTop: '10px',
                                height: '10px',
                                borderRadius: '5px',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: color,
                                },
                            }}
                        />
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default EmotionAnalyzer;
