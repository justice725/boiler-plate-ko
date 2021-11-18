import React, { useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { withRouter } from 'react-router-dom';

function LandingPage(props) {
    let navigate = useNavigate();
    // 랜딩 페이지에 들어오자 마자 아래의 구문을 실행한다.
    useEffect(() => {
        axios.get('/api/hello') // 클라이언트는 포트:3000번이다. 
        .then(response => console.log(response.data))
    }, [])
    // get을 서버에 보내는데, 앤드포인트는 /api/hello, 
    // 보낸 후 서버에서 돌아오는 response를 콘솔로 로그하도록 만들었다.

    // 서버는 :5000, 클라이언트는 :3000번이라서 주고받기가 안된다. 
    // 이를 해결하기 위해서 Cors 정책이 필요하다. 여러가지 방법이 있지만,
    // 우리는 Proxy 방법으로 해결한다.

    const onClickHandler = () => {
        axios.get('/api/users/logout')
        .then(response => {
            if(response.data.success) {
                navigator('/login');
            } else {
                alert('로그아웃에 실패했습니다.');
            }
        })
    }


    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            <h2>시작페이지 여기는 랜딩페이지에요</h2>
            <button onClick={onClickHandler}>
            로그아웃
            </button>
        </div>
        
    )
}

export default LandingPage
