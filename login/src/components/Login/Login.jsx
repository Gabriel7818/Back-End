import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import {Container} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import './styles.css';
import api from '../../services/api';
import {useHistory} from 'react-router-dom';

export function Login(){
    const history = useHistory();

    const [user, setUser] = useState(
        {
            email: '',
            password:''
        }
    )

    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })

     const valorInput = e => setUser({ 
        ...user, 
        [e.target.name]: e.target.value
    })

    const loginSubmit = async e =>{
        e.preventDefault();
    
        const headers = {
            'Content-Type': 'application/json'
        }
        
        setStatus({
            loading:true
        })

        await api.post("/login", user, {headers})
        .then((response) =>{
            // setStatus({
            //     type:'success',
            //     mensagem: response.data.mensagem,
            //     loading:false
            // });
            setStatus({loading:false});
            localStorage.setItem('token', JSON.stringify(response.data.token));
            return history.push('/dashboard');

        }).catch((err) =>{
            setStatus({
              type:'error',
              mensagem: 'Erro: tente mais tarde',
              loading:false
            })
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem,
                    loading:false
                })
            } 
        })
    }

    return (
        <>
        <Container className="box">

            <Form onSubmit={loginSubmit} className="borderForm">

            {status.type == 'error' ? <p>{status.mensagem}</p>: ""}
            {status.type == 'success' ? <p>{status.mensagem}</p>: ""}
            
            {status.loading ? <p>Validando...</p>: "" }

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" onChange={valorInput} placeholder="Entre com seu email" />
                <Form.Text className="text-muted">
                Nunca compartilharemos seu e-mail com mais ninguém.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" name="password" onChange={valorInput} placeholder="Digite sua senha" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                {/* <Form.Check type="checkbox" label="Check me out" /> */}
            </Form.Group>
            {status.loading
            ? <Button variant="primary" disabled type="submit">Acessando...</Button>
            : <Button variant="primary" type="submit">Acessar</Button>
            }

            </Form>            
        </Container>
        </>
    )
}