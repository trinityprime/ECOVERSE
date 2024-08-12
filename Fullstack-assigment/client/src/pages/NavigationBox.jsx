import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText,Divider } from '@mui/material';
import { ViewList } from '@mui/icons-material';

function NavigationBox() {
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 3, boxShadow: 3, mt: 23.9 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Navigation
        </Typography>
        <Divider sx={{ mb: 2 }} /> {/* Add divider here */}
        <List>
          <ListItem button>
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary="Report List" />
          </ListItem>
          {/* Add more navigation items as needed */}
        </List>
      </Box>
    );
  }

export default NavigationBox;