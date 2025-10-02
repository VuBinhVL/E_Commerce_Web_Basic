import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { LoadingButton } from '@mui/lab';
import { Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm, type FieldValues } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store/configureStore';
import { SignInUser } from './accountSlice';


export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { isSubmitting, isValid, errors } } = useForm({
        mode: 'onTouched'
    });

    async function submitForm(data: FieldValues) {
        try {
            await dispatch(SignInUser(data));
            navigate(location.state?.from || '/catalog');
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <Container component={Paper} maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    autoFocus
                    {...register('username', { required: 'Username is required' })}
                    error={!!errors.username}
                    helperText={errors?.username?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    {...register('password', { required: 'Password is reqquired' })}
                    error={!!errors.password}
                    helperText={errors?.password?.message as string}
                />
                <LoadingButton
                    loading={isSubmitting}
                    disabled={!isValid}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/register">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}