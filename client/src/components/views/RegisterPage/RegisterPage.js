import React, {useState} from 'react'
import {useDispatch} from 'react-redux'; // dispatch를 통해서 action을 취함. 그리고 redux로 감
import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';
// import { withRouter} from 'react-router-dom';


function RegisterPage(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    // props state 현재 안에서 데이터를 변화하려면 state를 변화시켜야 한다.
    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")


    
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 이걸 안하면 누를 때마다 페이지가 리프레시 된다.

        if(Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }

        let body = {
            email:Email,
            password:Password,
            name:Name
        }

        dispatch(registerUser(body))
            .then(response => {
                if(response.payload.success) {
                    navigate('/login'); 
                } else {
                    alert('Failed to Sign up');
                }
            })
            
        
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            
            <form style={{ display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
            <p>JoinPage</p>
            <label>Email</label>
            <input type="email" value={Email} onChange={onEmailHandler}></input>

            <label>Name</label>
            <input type="text" value={Name} onChange={onNameHandler}></input>

            <label>Password</label>
            <input type="password" value={Password} onChange={onPasswordHandler}></input>

            <label>Confirm Password</label>
            <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}></input>

            <br />
            <button>
                Join
            </button>

            </form>
        </div>
    )
}

export default RegisterPage