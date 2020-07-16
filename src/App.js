import React from 'react';
import styled from 'styled-components';
import Carousel from './components/carousel/carousel.component';
import image1 from './assets/image1.jpg';
import image2 from './assets/image2.jpg';
import image3 from './assets/image3.jpg';
import image4 from './assets/image4.jpg';

const AppContainer = styled.div`
display:flex;
justify-content:center;
align-items:center;
height: 100%;
`
const images = [image1, image2, image3, image4]

function App() {
  return (
    <AppContainer>
      <Carousel images={images} width={900} height={600} delay={10} parts={100} autoplayIncrement= {10000}/>
    </AppContainer>
  );
}

export default App;
