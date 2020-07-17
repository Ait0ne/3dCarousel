import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import shadow from '../../assets/shadow.png'

const Container = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
`

const CarouselContainer = styled.div`
width:${props => props.width}px;
height:${props => props.height}px;
perspective: ${props => props.width*3}px;
`
const CarouselImageContainer = styled.div`
display: flex;
flex-flow: row wrap;
position:relative;
transform-style:preserve-3d;
width:100%;
height:${props => props.height}px;
transition-duration: ${props => props.transition}ms;
z-index: ${props => props.zIndex};
`
const Image = styled.div`
width:${props => props.width}px;
height:${props => props.height}px;
display: block;
position:absolute;
background-color: red;
transform:  ${props => `rotateY(${props.angle}deg)`} ${props => `translateZ(${props.z}px)`} ; 
transition-duration: 1s;
background-image: url(${props => props.image});
background-size: 100% ${props => props.height*props.parts}px;
background-repeat: no-repeat;
background-position-y: ${props => props.bgPosition};
`

const FloorAndTop = styled.div`
width:${props => props.width}px;
height:${props => props.height}px;
display: block;
position:absolute;
background-color: black;
transform:  translateY(${props => props.y}px) ${props => `rotateX(${props.angle}deg)`} ; 
`

const Arrow = styled.button`
position: absolute;
${props => props.left? 'left:0' : 'right:0'}
`

const Shadow = styled.div`
width:${props => props.width}px;
height:auto;
position: relative;
bottom: ${props => props.width/8}px;
z-index: -1;
transform: scale(1.05);
`


const angles = [-90,0,90,180]

class Carousel extends React.Component {
    state = {
        deg: 0,
        x: null,
        currentImageIndex:1,
        currentImages: [],
        start:0,
        end:3
    }

    componentDidMount() {
        this.setState({currentImages:this.props.images.slice(0,4)})
        if (this.props.autoplay) {
            setInterval(() => {
                this.handleRight()
            }, this.props.autoplayInterval);
        }
    }

    handleMouseMove =  event => {
        const {x, deg} = this.state
        const {width} = this.props
        event.preventDefault()
        console.log(x, event.pageX, deg)
        if (x) {
            this.setState({deg: deg+(event.pageX-x)/width*90, x: event.pageX})
        }
        
    }


    handleLeft = () => {
        const {currentImageIndex, currentImages, start, end} = this.state
        const {images} = this.props
        const newImages = currentImages
        const newEnd = end===images.length-1?0: end+1
        const newStart = start===images.length-1?0: start+1
        const newCurrentImageIndex = currentImageIndex===3?0:currentImageIndex+1
        newImages[currentImageIndex===0?3: currentImageIndex-1] = images[newEnd]
        this.setState({currentImages:newImages, currentImageIndex: newCurrentImageIndex, start:newStart, end: newEnd, deg: this.state.deg-90})
        
        

    }
    handleLeftDebounce = _.debounce(this.handleLeft, (this.props.transition+this.props.delay*(this.props.parts-1)), {leading: true})
    handleRight = () => {
        const {currentImageIndex, currentImages, start, end} = this.state
        const {images} = this.props
        const newImages = currentImages
        const newEnd = end===0?images.length-1: end-1
        const newStart = start===0?images.length-1: start-1
        newImages[(currentImageIndex+2)%4] = images[newStart]
        const newCurrentImageIndex = currentImageIndex===0?3:currentImageIndex-1
        this.setState({currentImages:newImages, currentImageIndex: newCurrentImageIndex, start:newStart, end: newEnd, deg: this.state.deg+90})

        
    } 
    handleRightDebounce = _.debounce(this.handleRight, (this.props.transition+this.props.delay*(this.props.parts-1)), {leading: true})

    handleMouseDown = event => {
        event.preventDefault()
        console.log(event.pageX)
        this.setState({x:event.pageX}, () => {
            const carousels = document.getElementsByClassName('carousel-image-container')
            Array.from(carousels).forEach(element => {
                element.style.transitionDuration  = '0s'
            })
            window.addEventListener('mousemove', this.handleMouseMove)
        })
    }

    handleMouseUp = event => {
        const carousels = document.getElementsByClassName('carousel-image-container')
            Array.from(carousels).forEach(element => {
            element.style.transitionDuration  = '1s'
        })
        window.removeEventListener('mousemove', this.handleMouseMove)
        this.setState({x: null})
    }

    handleMouseLeave = event => {
        event.preventDefault()
        const carousels = document.getElementsByClassName('carousel-image-container')
            Array.from(carousels).forEach(element => {
            element.style.transitionDuration  = '1s'
        })
        window.removeEventListener('mousemove', this.handleMouseMove)
        this.setState({x: null})
    }

    CarouselImages = []
    

    render() {
        const {deg, currentImages} = this.state
        const {width, height, parts, delay, transition} = this.props
        return (
            <Container>
                {console.log(this.props)}
                <CarouselContainer width={width} height={height} >
                    {
                        [...Array(parts)].map((part, i) => {
                            return (
                                <CarouselImageContainer 
                                key={i}
                                className='carousel-image-container' 
                                style={{transform: `translateZ(-${width/2}px) rotateY(${deg}deg)`, transitionDelay: `${delay*i}ms` }}  
                                onMouseDown={this.handleMouseDown} 
                                onMouseUp={this.handleMouseUp} 
                                // onMouseLeave={this.handleMouseLeave} 
                                angle={deg}
                                height={height/parts}
                                zIndex={i>=(parts-1)/2?parts-i:0}
                                transition={transition}
                                >
                                {
                                    currentImages.map((image, index) => {
                                        return (
                                            <Image key={index} z={width/2} angle={angles[index]} width={width} height={height/parts} image={image} bgPosition={`-${height/parts*i}px`} parts={parts}>
                                            </Image>
                                            )
                                        })
                                }
                                    <FloorAndTop width={width} height={width} y ={-width/2} angle={90}></FloorAndTop>
                                    <FloorAndTop width={width} height={width} y ={-width/2+height/parts} angle={-90}></FloorAndTop>
                                </CarouselImageContainer>

                            )
                        })
                    }
                    <Arrow left onClick={this.handleLeftDebounce}>Left</Arrow>
                    <Arrow onClick={this.handleRightDebounce}>Right</Arrow>
                </CarouselContainer>
                <Shadow width={width} >
                    <img alt='shadow' width={width} src={shadow}/>
                </Shadow>
            </Container>
        )
    }
}

Carousel.defaultProps = {
    autoplayInterval: 5000,
    autoplay: false,
    delay: 300,
    parts: 1,
    transition: 1000
}


export default Carousel;



