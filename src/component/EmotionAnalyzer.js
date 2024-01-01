import 'regenerator-runtime/runtime'
import React, { useState } from "react";
import {TextField, Button, LinearProgress, Typography, Box} from "@mui/material";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import generateToken from "../helper/generateToken";

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

    const appLink = 'https://play.google.com/store/apps/details?id=btec.nextstep.ifeeldigital';

    const handleAppLinkClick = () => {
        window.open(appLink, '_blank');
    };

    const handleShareOnFacebook = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://emoident.com/')}`;
        window.open(shareUrl, '_blank');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
                Emoident (Beta)
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
                    marginBottom: '50px'
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
                        disabled={loading || text.trim().length < 2}
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
                    <Button
                        variant="contained"
                        onClick={() => {setText('')}}
                        disabled={loading || text.trim().length < 2}
                        sx={{
                            background: '#c5630f',
                            color: '#fff',
                            '&:hover': {
                                background: '#8e5f38',
                            },
                        }}
                    >
                        Làm mới
                    </Button>

                    <Button variant="contained" color="primary" onClick={handleShareOnFacebook}  sx={{
                        background: '#0f58c5',
                        color: '#fff',
                        '&:hover': {
                            background: '#38508e',
                        },
                    }}>
                        Chia sẻ lên Facebook
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

            <Typography variant="h6" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
                Mời bạn dùng thử
            </Typography>

            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                sx={{
                    maxWidth: '500px',
                    margin: 'auto',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '20px',
                }}
            >
                <img
                    src="https://play-lh.googleusercontent.com/XPrBBMGQDWHpHS_n20YXOOza5Q1AUcPBcCKPjcsSrUWcOipNv-x1l_3wHqEw1RgGOOo=s96-rw"
                    alt="Ứng dụng trên Play Store"
                    style={{ maxWidth: '80px', marginRight: '20px', cursor: 'pointer' }}
                    onClick={handleAppLinkClick}
                />
                <div style={{ flex: 1, textAlign: 'left'}}>
                    <a href={appLink} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={handleAppLinkClick}>
                           FeelApp
                    </Typography>

                        <Typography variant="h6">
                           Lắng nghe tâm sự của bạn
                        </Typography>

                    <Typography variant="body2">
                        Một người bạn giúp lắng nghe tâm sự, cảm xúc của bạn và đưa ra lời khuyên.
                    </Typography>
                    </a>
                </div>
            </Box>

        </div>
    );
};

export default EmotionAnalyzer;
