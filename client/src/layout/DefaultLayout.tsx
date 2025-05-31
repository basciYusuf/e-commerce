import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box } from '@mui/material';

interface DefaultLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

const DefaultLayout = ({ children, onLogout, onSearch }: DefaultLayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        width: '100%',
      }}
    >
      <Header onLogout={onLogout} onSearch={onSearch} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          py: 4,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default DefaultLayout;
