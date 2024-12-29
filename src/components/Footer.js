import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'secondary.main',
        color: 'white',
        py: 2,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontFamily: 'Montserrat', fontWeight: 500 }}
      >
        Powered by{' '}
        <Link
          href="https://www.whitewall.om/"
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ color: 'inherit', fontWeight: 'bold' }}
        >
          WhiteWall Digital Solutions
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
