import { Box, Typography, Container } from '@mui/material';

const Footer = () => (
  <Box 
    component="footer" 
    sx={{
      py: 3,
      mt: 'auto',
      backgroundColor: '#1a237e',
      color: '#fff',
      width: '100%',
      position: 'relative',
      bottom: 0,
    }}
  >
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4 } }}>
      <Typography 
        variant="body2" 
        align="center"
        sx={{
          opacity: 0.9,
          '&:hover': {
            opacity: 1,
          },
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        © {new Date().getFullYear()} E-Ticaret Projesi
      </Typography>
    </Container>
  </Box>
);

export default Footer;
