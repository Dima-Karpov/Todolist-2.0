import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {useFormik} from 'formik';

import {AppRootStateType} from '../../../state/store';
import {loginUser} from '../../../state/reducers/auth-reducer';

import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);

  const {handleSubmit, getFieldProps, values, errors, } = useFormik({
    validate: (values) => {
      if (!values.email)
      {
        return {
          email: 'Email is  required'
        }
      }
      if (!values.password) {
        return {
          password: 'Password is  required'
        }
      }
      
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    onSubmit: values => {
      dispatch(loginUser(values))
    },
  });

  if (isLoggedIn){
    return <Navigate to={'/'}/>
  };

  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>To log in get registered
                <a href={'https://social-network.samuraijs.com/'}
                  target={'_blank'}
                  rel="noreferrer"
                > here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...getFieldProps('email')}
              />
              {errors.email ? <div>{errors.email}</div> : null}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...getFieldProps('password')}
              />
              {errors.password ? <div>{errors.password}</div> : null}
              <FormControlLabel label={'Remember me'}
                control={<Checkbox
                  {...getFieldProps('rememberMe')}
                  checked={values.rememberMe}
                />} />
              <Button type={'submit'} variant={'contained'} color={'primary'}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid >
  )
}
