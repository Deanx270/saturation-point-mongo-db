import React from 'react';
import { Box, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        p: 4,
                        bgcolor: '#fef2f2',
                        border: '1px solid #ef4444',
                        borderRadius: 2,
                        m: 2,
                    }}
                >
                    <Typography variant="h6" color="error">
                        React Crash Intercepted!
                    </Typography>
                    <Typography
                        variant="body2"
                        component="pre"
                        sx={{ mt: 2, whiteSpace: 'pre-wrap', color: '#7f1d1d' }}
                    >
                        {this.state.error && this.state.error.toString()}
                    </Typography>
                    <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                            mt: 2,
                            whiteSpace: 'pre-wrap',
                            color: '#7f1d1d',
                            fontSize: '0.75rem',
                            overflowX: 'auto',
                        }}
                    >
                        {this.state.errorInfo &&
                            this.state.errorInfo.componentStack}
                    </Typography>
                </Box>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
