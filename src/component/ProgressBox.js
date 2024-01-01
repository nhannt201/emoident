import {Box, LinearProgress, Typography} from "@mui/material";
import React from "react";

export default function ProgressBox({emotionLabel, emotionScore, color}) {
    return (<Box sx={{ width: '100%', textAlign: 'center' }}>
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
    </Box>)
}
