import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import SearchBar from './SearchBar';

interface HeaderProps {
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

const Header = ({ onLogout, onSearch }: HeaderProps) => (
  <AppBar 
    position="static" 
    sx={{ 
      backgroundColor: '#1a237e',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }}
  >
    <Toolbar sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: '100%',
      px: { xs: 2, sm: 4 }
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          flexGrow: 0,
          fontWeight: 600,
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
        }}
      >
        E-Ticaret Dashboard
      </Typography>
      
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        justifyContent: 'center',
        mx: 4
      }}>
        {onSearch && <SearchBar onSearch={onSearch} />}
      </Box>

      <Button 
        color="inherit" 
        onClick={onLogout}
        sx={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.2)',
          },
          borderRadius: '8px',
          px: 2
        }}
      >
        Çıkış
      </Button>
    </Toolbar>
  </AppBar>
);

export default Header;
