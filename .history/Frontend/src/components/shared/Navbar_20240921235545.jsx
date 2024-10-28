import React, { useState } from 'react';
import { Avatar, Button, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant.js';
import { setUser } from '../redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                <div>
                    <Typography variant="h4" component="h1" className="text-white font-bold">
                        Job<span className='text-yellow-300'>Bridge</span>
                    </Typography>
                </div>
                <div className="flex items-center gap-8">
                    <ul className="flex font-medium items-center gap-5 text-white">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li className="hover:text-yellow-300 transition-colors">
                                    <Link to="/admin/companies">Companies</Link>
                                </li>
                                <li className="hover:text-yellow-300 transition-colors">
                                    <Link to="/admin/jobs">Jobs</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="hover:text-yellow-300 transition-colors">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="hover:text-yellow-300 transition-colors">
                                    <Link to="/jobs">Jobs</Link>
                                </li>
                                <li className="hover:text-yellow-300 transition-colors">
                                    <Link to="/browse">Browse</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    {!user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="outlined" className="text-white border-white hover:bg-white hover:text-blue-600 transition-all">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="contained" className='bg-yellow-400 hover:bg-yellow-500 text-blue-800'>
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <IconButton onClick={handleAvatarClick}>
                                <Avatar src={user?.profile?.profilePhoto} alt={user?.fullname} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    style: { width: '250px' },
                                }}
                            >
                                <div className="flex gap-2 p-2">
                                    <Avatar src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                    <div>
                                        <Typography variant="subtitle1">{user?.fullname}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user?.profile?.bio}
                                        </Typography>
                                    </div>
                                </div>
                                <MenuItem onClick={handleMenuClose}>
                                    {user && user.role === 'student' && (
                                        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <User2 /> View Profile
                                        </Link>
                                    )}
                                </MenuItem>
                                <MenuItem onClick={logoutHandler}>
                                    <LogOut /> Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
