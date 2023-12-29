// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Box, ThemeProvider } from '@mui/material';
import './App.css'
import { Editor } from './components/Editor';
import { theme } from './utils/Theme';
import { SnackbarProvider } from 'notistack';

function App() {

  return (
    <Box>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={theme}>
          <Editor />

        </ThemeProvider>
      </SnackbarProvider>
    </Box>
  )
}

export default App
