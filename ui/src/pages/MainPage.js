import Container from '@mui/material/Container'
import Header from '../components/mainPage/Header.js';
import Body from '../components/mainPage/body/Body.js';
import BodyInformation from '../components/mainPage/body/BodyInformation.js';
function MainPage(){
    return (
        <div>
        <Container>
            <Header></Header>
            <BodyInformation></BodyInformation>
            <Body></Body>
        </Container>
        </div>

    )
}

export default MainPage