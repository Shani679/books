import React from 'react';
import styled from 'styled-components';
import Popup from '../Modal/Popup';


const BookWrapper = styled.div`
	height: 270px;
	margin: 0 20px 20px 20px;
	border-radius: 5px 15px 15px 5px;
    transform-origin: left center 0px;
	box-shadow: 0 2px 7.68px 0.32px rgba(0, 0, 0, 0.4), 0 12px 26px 0 rgba(0, 0, 0, 0.4);
	width:180px;
	font-size:12px;
	position:relative;
	background-color: ${props => props.color};
    &:after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 9px;
		z-index: 7;
		transform: translateZ(1px);
		-webkit-transform: translateZ(1px);
		-moz-transform: translateZ(1px);
		-o-transform: translateZ(1px);
		-ms-transform: translateZ(1px);
		background: linear-gradient(to right, #222 0%, ${props => props.color} 12%, #222 25%, ${props => props.color} 37%, #222 50%, ${props => props.color} 62%, #222 75%, ${props => props.color} 87%, #222 100%);
	}
	&:hover ${EditBtn} {
		opacity: 1;
	  }
`
const BookCover = styled.div`
	height: 80px;
    background: #e8e8e0;
    margin-top: 65px;
    padding: 15px 20px;
    font-size: 12px;
    position: relative;
    color: #222;
    text-align: left;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`

const Title = styled.div`
	font-weight:bold;
	text-align: center;
	font-size: 17px;
	font-family: 'Hammersmith One', sans-serif;
`

const BookDetails = styled.div`
	position: absolute;
	bottom: 8px;
	left: 20px;
	display:flex;
	flex-direction:column;
`

const ButtonsPanel = styled.div`
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 4px 0;
	left: 0;
	background: #95999d;
`

const EditBtn = styled.button`
	background: transparent;
    border: none;
	font-size: 17px;
	cursor:pointer;
	outline:none;
	opacity:0;
	transition: .6s all ease-in;
	${BookWrapper}:hover & {
		opacity:1;
	}
`

const DeleteBtn = styled.button`
	background: transparent;
    border: none;
	font-size: 17px;
	cursor:pointer;
	padding-left: 22px;
	outline:none;
	opacity:0;
	transition: .6s all ease-in;
	${BookWrapper}:hover & {
		opacity:1;
	}
`

const PublishedDate = styled.div`
	font-style:italic;
	font-family: serif;
    font-weight: bold;
`

class Book extends React.Component{
	constructor(props) {
	    super(props);
	    this.state = { 
			 popupDisplay: false,
			 popupMode: ''
	    };  
	}

	

	showPopup(popupID){
		this.setState({
			popupDisplay: true,
			popupMode: popupID
		})
	}

	closePopup(){
		this.setState({
			popupDisplay: false
		})
	}

	deleteBook(bookId){
		this.setState({
			popupDisplay: false
		})
		this.props.delete(bookId);
	}

	updateBook(book){
		this.setState({
			popupDisplay: false
		})
		this.props.update(book);
	}

	capitalaize(string){
		const onlyEnCharts = string.replace(/[^a-zA-Z ]+/g, '');
		const capitalizedTitle = onlyEnCharts.split(" ").map(current => current.split("")[0].toUpperCase() + current.split("").splice(1).join("")).join(" ");
		return capitalizedTitle;
	}
  

  render(){
	const title = this.capitalaize(this.props.book.title);
	const authors = this.props.book.authors;
  	return (<BookWrapper color={this.props.color}>
				<BookCover>
					<Title>{title}</Title>
					{this.state.popupDisplay && <Popup popupmode={this.state.popupMode} 
														color={this.props.color}
														book={this.props.book}
														close={() => this.closePopup()} 
														delete={id => this.deleteBook(id)}
														update={book => this.updateBook(book)}
												/>}	
					<ButtonsPanel>
						<DeleteBtn id="delete" onClick={(e) => this.showPopup(e.currentTarget.id)}>
							<i className="fa fa-trash-o"></i>
						</DeleteBtn>
						<EditBtn id="edit" onClick={(e) => this.showPopup(e.currentTarget.id)}>
							<i className="fa fa-edit"></i>
						</EditBtn>
					</ButtonsPanel>	
				</BookCover>
				<BookDetails>
					<div>
						{authors.map((current, i) => <span key={i}>{current}{i !== authors.length-1 ? ", " : null}</span>)}
					</div>
					<PublishedDate>Published: {this.props.book.publishedDate}</PublishedDate>
				</BookDetails>
			</BookWrapper>)
  }
	
}

export default Book;