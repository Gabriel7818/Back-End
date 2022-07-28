import React from "react";
import {Route, Redirect} from 'react-router-dom';
import api from '../services/api';

export const PrivateRoute = (props) => {
    const logado = localStorage.getItem('token') !== null
     && localStorage.getItem('token') !== ""

    if(logado){
        return <Route {...props} />
    }
    return <Redirect to="/" />
};