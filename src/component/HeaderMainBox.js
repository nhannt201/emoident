import {Typography} from "@mui/material";
import React from "react";

export default function HeaderMainBox() {
    return (<>
        <Typography variant="h4" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Emoident (Beta)
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: '20px', color: 'grey' }}>
            Thang đo cảm xúc trong văn bản
        </Typography>
    </>)
}
