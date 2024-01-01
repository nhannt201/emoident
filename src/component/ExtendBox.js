import {Box, Typography} from "@mui/material";
import React from "react";

export default function ExtendBox() {
    const appLink = 'https://play.google.com/store/apps/details?id=btec.nextstep.ifeeldigital';

    const handleAppLinkClick = () => {
        window.open(appLink, '_blank');
    };

    return (  <>
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
                    <Typography variant="h5" sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={handleAppLinkClick}>
                        FeelApp
                    </Typography>

                    <Typography variant="h6"   sx={{  cursor: 'pointer' }} onClick={handleAppLinkClick}>
                        Lắng nghe tâm sự của bạn
                    </Typography>

                    <Typography variant="body2"   sx={{ cursor: 'pointer' }} onClick={handleAppLinkClick}>
                        Một người bạn giúp lắng nghe tâm sự, cảm xúc của bạn và đưa ra lời khuyên.
                    </Typography>
            </div>
        </Box>
    </>)
}
