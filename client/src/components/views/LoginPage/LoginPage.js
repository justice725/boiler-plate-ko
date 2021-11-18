import { Axios } from 'axios';
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'; // dispatch를 통해서 action을 취함. 그리고 redux로 감
import {loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';
// import { withRouter } from 'react-router-dom';



function LoginPage() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    // props state 현재 안에서 데이터를 변화하려면 state를 변화시켜야 한다.
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 이걸 안하면 누를 때마다 페이지가 리프레시 된다.

        let body = {
            email:Email,
            password:Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess) {
                    navigate('/'); 
                } else {
                    alert('Error');
                }
            })
            
        
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            
            <form style={{ display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
            <p>LoginPage</p>
            <label>Email</label>
            <input type="email" value={Email} onChange={onEmailHandler}></input>
            <label>Password</label>
            <input type="password" value={Password} onChange={onPasswordHandler}></input>

            <br />
            <button>
                Login
            </button>

            </form>
        </div>
    )
}

export default LoginPage