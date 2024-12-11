import {Helmet} from 'react-helmet-async';

import {CONFIG} from 'src/config-global';

import {useRouter} from "../routes/hooks";
import {useCallback, useState} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import {Iconify} from "../components/iconify";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import { API_ROUTES_USER } from "../utils/api";
import { LocalStorage, LOCAL_STORAGE_KEYS } from "../utils/LocalStorage";
import RequestHandler from "../utils/RequestHandler";

// ----------------------------------------------------------------------

export default function Page() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = useCallback(async () => {
        setLoading(true);
        setError('');

        if (!email.length || !password.length) {
            setLoading(false);
            setError('Please enter email and password')
            return;
        }

        try {
            const response = await RequestHandler.post(API_ROUTES_USER.LOGIN, {
                email,
                password
            });
            LocalStorage.setItem(LOCAL_STORAGE_KEYS.JWT.TOKEN, response.data.token);
            if (response.status === 200) {
                // Get logged-in user's basic info
                const userInfo = await RequestHandler.get(API_ROUTES_USER.GET_ME);
                if (userInfo.status === 200) {
                    LocalStorage.setItem(LOCAL_STORAGE_KEYS.USER.BASIC_INFO, JSON.stringify(userInfo.data));
                }

                router.push('/');
            }
            else {
                console.log(response)
                setError(response.data.message)
            }
        }
        catch (err) {
            setError('Login failed. Please check your credentials and try again.');
        }
        finally {
            setLoading(false);
        }
    }, [email, password, router]);


    return (
        <>
            <Helmet>
                <title> {`Admin Sign in - ${CONFIG.appName}`}</title>
            </Helmet>

            <>
                <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{mb: 5}}>
                    <Typography variant="h5">Admin Sign in</Typography>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <TextField
                        fullWidth
                        name="email"
                        label="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{shrink: true}}
                        sx={{mb: 3}}
                    />

                    <Link variant="body2" color="inherit" sx={{mb: 1.5}}>
                        Forgot password?
                    </Link>

                    <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{shrink: true}}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{mb: 3}}
                    />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        color="inherit"
                        variant="contained"
                        onClick={handleSignIn}
                        loading={loading}
                    >
                        Sign in
                    </LoadingButton>
                    <div style={{textAlign: 'center', width: '100%'}}>
                        {error && <Typography color="error">{error}</Typography>}
                    </div>
                </Box>
            </>
        </>
    );
}
