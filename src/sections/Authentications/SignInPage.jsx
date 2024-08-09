// src/pages/SignInPage.jsx
import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Snackbar, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { apiPOST } from '../../helpers/apiHelper';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/user/user';
import { useNavigate } from 'react-router-dom';

function SignInPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { accessToken } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    const onSubmit = async (data) => {
        console.log(data); // Handle form submission
        setErrorMessage("")
        setSuccessMessage("")
        try {
            let response = await apiPOST(`/v1/auth/login-admin`, data);
            console.log("response:-", response);
            if (response?.data?.code === 200) {
                let data = response?.data?.data;
                console.log("data:", data.user);
                dispatch(setUser({
                    user: data?.user,
                    accessToken: data?.tokens?.access?.token,
                    refreshToken: data?.tokens?.refresh?.token
                }))
                // localStorage.setItem("eRUser", data?.user.toString())
                localStorage.setItem("accessToken", data?.tokens?.access?.token)
                localStorage.setItem("refreshToken", data?.tokens?.refresh?.token)
                setAlertOpen(true)
                setSuccessMessage("Sign in successful.")
                setErrorMessage("")
            } else {
                setAlertOpen(true)
                setSuccessMessage("")
                setErrorMessage(response.data?.data || response?.data?.message)
            }
        } catch (error) {
            setSuccessMessage("")
            console.error("Error in sign in:", error)
        }
    };

    // const isTokenValid = useCallback((accessToken) => {
	// 	if (accessToken) {
	// 		try {
	// 			const decoded = jwtDecode(accessToken);
	// 			const currentTime = Date.now() / 1000;
	// 			return decoded.exp > currentTime;
	// 		} catch (error) {
	// 			return false;
	// 		}
	// 	}

	// 	return false;
	// }, []);

    useEffect(() => {
        if (alertOpen) {
            setTimeout(() => {
                setAlertOpen(false)
                setErrorMessage("")
            }, 7000)
        }
    }, [alertOpen])

    useEffect(() => {
        // console.log("user:-", userData);
        if(accessToken){
            navigate("/dashboards")
        }
    }, [accessToken])

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
            >
                {errorMessage ?
                    <Alert onClose={() => setAlertOpen(false)} severity="error">
                        {errorMessage}
                    </Alert>
                    :
                    successMessage ?
                        <Alert onClose={() => setAlertOpen(false)} severity="success">
                            {successMessage}
                        </Alert>
                        :
                        ""
                }

            </Snackbar>
            <Container maxWidth="xs">
                <Paper elevation={3} className="p-6">

                    <div className='mb-4 text-4xl font-extrabold text-center leading-tight tracking-tight'>
                        Sign in
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <TextField
                                fullWidth
                                label="Email*"
                                variant="outlined"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                fullWidth
                                label="Password*"
                                variant="outlined"
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </div>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Sign In
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
}

export default SignInPage;
