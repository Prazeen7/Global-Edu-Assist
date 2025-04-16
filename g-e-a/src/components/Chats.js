import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Tooltip from '@mui/material/Tooltip';
// import ChatBox from './ChatBox';

export default function Chats() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        // <ChatBox />
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Messenger">
                    <ChatOutlinedIcon
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2, cursor: 'pointer', fontSize: 28 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    />

                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            width: 300, 
                            borderRadius: 2,
                            backgroundColor: '#f4f4f4', 
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Example Messenger Item */}
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ bgcolor: '#0078d4' }}>G</Avatar> Group Chat
                </MenuItem>

                <Divider />

                {/* Example Another Messenger Item */}
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ bgcolor: '#25D366' }}>C</Avatar> Chat with Charlie
                </MenuItem>

                <Divider />

                {/* Example Messenger Item */}
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ bgcolor: '#0078d4' }}>G</Avatar> Group Chat
                </MenuItem>

                <Divider />

                {/* Example Another Messenger Item */}
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ bgcolor: '#25D366' }}>C</Avatar> Chat with Charlie
                </MenuItem>

                <Divider />

                {/* Example Messenger Item */}
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ bgcolor: '#0078d4' }}>G</Avatar> Group Chat
                </MenuItem>

                <Divider />

                {/* Example Another Messenger Item */}
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ bgcolor: '#25D366' }}>C</Avatar> Chat with Charlie
                </MenuItem>

                <Divider />

                {/* Example Messenger Item */}
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ bgcolor: '#0078d4' }}>G</Avatar> Group Chat
                </MenuItem>

                <Divider />

                {/* Example Another Messenger Item */}
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ bgcolor: '#25D366' }}>C</Avatar> Chat with Charlie
                </MenuItem>


            </Menu>
        </React.Fragment>
    );
}
