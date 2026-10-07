import React, { useState } from 'react';
import { Tooltip, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CopyableId = ({ id, full = false }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e) => {
    e.stopPropagation();
    if (id) navigator.clipboard.writeText(id.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  const displayId = id ? id.toString() : 'N/A';

  return (
    <Tooltip title={copied ? "Copied!" : `Copy ${displayId}`}>
      <Box 
        component="span"
        onClick={handleCopy}
        sx={{ 
          cursor: 'pointer', 
          borderBottom: copied ? 'none' : '1px dotted #ccc', 
          color: copied ? '#16a34a' : '#CA8A04', 
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontFamily: 'monospace'
        }}
      >
        {copied ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            Copied!
          </>
        ) : (
          full ? displayId : `${displayId.substring(0, 8)}...`
        )}
      </Box>
    </Tooltip>
  );
};

export default CopyableId;
