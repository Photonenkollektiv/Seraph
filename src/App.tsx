// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Box, ThemeProvider } from '@mui/material';
import './App.css'
import { Editor } from './components/Editor';
import { theme } from './utils/Theme';

function App() {
  
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Editor />
        
      </ThemeProvider>
    </Box>
  )
}

export default App
