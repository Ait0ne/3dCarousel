import React from 'react';
import styled from 'styled-components';
import Carousel from './components/carousel/carousel.component';
import image1 from './assets/image1.jpg';
import image2 from './assets/image2.jpg';
import image3 from './assets/image3.jpg';
import image4 from './assets/image4.jpg';
import image5 from './assets/image5.jpg';
import image6 from './assets/image6.jpg';
import image7 from './assets/image7.jpg';
import image8 from './assets/image8.jpg';
import image9 from './assets/image9.jpg';
import image10 from './assets/image10.jpg';


const AppContainer = styled.div`
display:flex;
justify-content:center;
align-items:center;
height: 100%;
`
const images = [image1, image2, image3, image4,image5,image6,image7,image8,image9,image10]

function App() {
  return (
    <AppContainer>
      <Carousel images={images} width={900} height={600} delay={30} parts={50} transition={500}   autoplayIncrement= {10000}/>
    </AppContainer>
  );
}

export default App;
