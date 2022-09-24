// import { Document, Page } from 'react-pdf';
import {Box} from '@mui/material';
export default function Test() {
  return (
    <Box position="static" sx={{ml:25, zIndex: 'tooltip',minWidth: 200 }}height="100vh">
      <iframe src="https://drive.google.com/file/d/1lPOlg5EMUGXROgv8Z7QRYc-9jTqRDSt2/preview" frameBorder="0" className='bg-white	 w-full h-full' allow="autoplay"></iframe>
    </Box>
  );
}