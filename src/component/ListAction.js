import {Box, Button} from "@mui/material";
import React, {useEffect, useState} from "react";

export default function ListAction({browserSupportsSpeechRecognition, listening, stopListening, startListening,isSupportVNs, handleSubmit, text, setText, loading }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        // Cleanup listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleShareOnFacebook = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://emoident.com/')}`;
        window.open(shareUrl, '_blank');
    };

    return ( <Box
        display="flex"
        flexDirection={isMobile ? "column" : "rows"}
        justifyContent="center"
        sx={{ marginBottom: '20px', gap: '10px' }}
    >
        {browserSupportsSpeechRecognition && (<Button
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
        </Button>)}
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

    </Box>)
}
