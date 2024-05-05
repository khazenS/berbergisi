import Container from '@mui/material/Container'
import Header from '../components/mainPage/Header.js';
import Body from '../components/mainPage/body/Body.js';
function MainPage(){
    return (
        <div>
        <Container>
            <Header></Header>
            <Body></Body>
        </Container>
        </div>

    )
}

export default MainPage