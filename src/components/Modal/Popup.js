import React from 'react';
import styled from 'styled-components';

const PopupHolder = styled.div`
	position:fixed;
	z-index:10;
	left: 0;
    top: 0;
    width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.7);
`
const PopupBody = styled.div`
	width:340px;
	padding:30px 0;
	box-shadow: 2px 3px 5px 0px rgba(0,0,0,0.75);
	background-color:#e8e8e0;
	justify-content: space-around;
	flex-direction:column;
	align-items:center;
	margin: 0 auto;
	display: flex;
	border-radius: 4px;
	border-left: 25px solid ${props => props.bgColor ? props.bgColor : 'red'};
	top:20%;
	position:relative;
	@media (max-width:500px){
		width: 250px;
	}
`

const Close = styled.span`
	position: absolute;
	top: 0;
    right: 5px;
    cursor: pointer;
    transform: rotate(45deg);
    font-size:25px;
`

const ErrMsg = styled.span`
	color:red;
	font-weight:bold;
	font-size: 12px;
    margin-top: 5px;
`
const FormElement = styled.div`
	display:flex;
	flex-direction:column;
	margin-bottom: 20px;
	font-size: 16px;
	font-weight: bold;
`
const Input = styled.input`
	width: 200px;
	border: none;
	border-bottom: 1px solid;
	padding: 5px;
	background:transparent;
	outline:none;
`
const Button = styled.button`
	width: 210px;
	border-radius: 15px;
	border: none;
	padding: 5px;
	margin-bottom: 10px;
	background-color: ${props => props.bgColor ? props.bgColor : 'red'};
    box-shadow: 0 4px 10px 0 rgba(43,96,143,.3);
	color:#f2fbff;
	cursor: pointer;
	transition: .6s all ease-in;
	outline:none;
	text-transform:capitalize;
	&:hover{
		transition: .6s all ease-in;
    	background-color: #28527e;
	}
	&:focus{
		outline:none;
	}
`

const WarningTitle = styled.h1`
	padding-left:20px;
	margin-bottom: 30px;
`


class Popup extends React.Component{
	constructor(props) {
		super(props);
	    this.state = { 
	     	id: "",
	     	title: "",
	     	publishedDate: "",
	     	authors:  "",
	     	idErr: false,
	     	titleErr: false,
	     	authorsErr: false,
	     	publishedDateErr: false
	    };  
	}

	componentDidMount(){
		if(this.props.popupmode){
			const {id, title, publishedDate, authors} = this.props.book;
			this.setState({
				id,
				title,
				publishedDate: publishedDate,
				authors
			})
		}
	}


	onChange(e){
		const returnObj = {};
		returnObj[e.target.id] = e.target.value;
		e.target.id !== 'publishedDate'	? 
			returnObj[e.target.id + "Err"] = e.target.value === "" :
			returnObj[e.target.id + "Err"] = this.validateDate(e.target.value);
		this.setState(returnObj);
	}

	validateFields(){
		
		const {id, title, authors, publishedDate} = this.state

		this.setState({
			...this.state,
			idErr : id === "",
			titleErr : title === "",
			authorsErr : authors === "",
			publishedDateErr : this.validateDate(publishedDate)
		}, () => this.allowedToProceed())
		
	}

	validateDate(date){
		return new Date()-new Date(date) < 0 || isNaN(new Date()-new Date(date));
	}

	allowedToProceed(){
		
		let proceedToSave = true;	

		const {id, title, authors, publishedDate} = this.state;
		const {idErr, titleErr, authorsErr, publishedDateErr} = this.state;

		const arr = [idErr, titleErr, authorsErr, publishedDateErr];
		
		arr.map(current => {
			if(current) 
				proceedToSave = false;
		})


		if(proceedToSave){
			const book = {
				id,
				title,
				authors: authors.toString().split(","),
				publishedDate
			
			}
			this.props.popupmode ? this.props.update(book) : this.props.saveBook(book);
		}	
	}


	close(){
		this.props.close();
	}


	showIdField(){
		if(!this.props.popupmode){
			return (
				<FormElement>
					<label htmlFor="id">Book Id</label>
					<Input type="text" id="id" onChange={e => this.onChange(e)} value={this.state.id}/>
					{this.state.idErr ? <ErrMsg>Can't be blank</ErrMsg> : null}
				</FormElement>
			)
		}
	}
	

	showEditAndAddMode(){
		return (
			<React.Fragment>

				{this.showIdField()}

				<FormElement>
					<label htmlFor="title">Book title</label>
					<Input type="text" id="title" onChange={e => this.onChange(e)} value={this.state.title}/>
					{this.state.titleErr ? <ErrMsg>Can't be blank</ErrMsg> : null}
				</FormElement>

				<FormElement>
					<label htmlFor="publishedDate">Published date</label>
					<Input type="text" id="publishedDate" onChange={e => this.onChange(e)} value={this.state.publishedDate}/>
					{this.state.publishedDateErr ? <ErrMsg>Invalid date</ErrMsg> : null}
				</FormElement>

				<FormElement>
					<label htmlFor="authors">Book authors</label>
					<textarea id="authors" cols="26" rows="4" onChange={e => this.onChange(e)} value={this.state.authors} placeholder="Book authors list seperated by coma"></textarea>
					{this.state.authorsErr ? <ErrMsg>Can't be blank</ErrMsg> : null}
				</FormElement>

				<Button bgColor={this.props.color} id={this.props.popupmode || 'add'} onClick={() => this.validateFields()}>{this.props.popupmode ? 'update' : 'add'}</Button>

			</React.Fragment>
			
		)
	}

	showDeleteMode(){
		return(
			<React.Fragment>
			<WarningTitle>Are you sure you want to delete {this.props.book.title.replace(/[^a-z]/gi, ' ')}?</WarningTitle>
				<Button bgColor={this.props.color} onClick={() => this.props.delete(this.props.book.id)}>Delete</Button>
			</React.Fragment>
		)
	}


  render(){
	  return (<PopupHolder id="popup">
				  <PopupBody bgColor={this.props.color}>
						<Close onClick={()=>this.props.close()}>+</Close>
						{this.props.popupmode === 'delete' ? this.showDeleteMode() : this.showEditAndAddMode()}
						<Button bgColor={this.props.color} onClick={()=>this.props.close()}>Cancel</Button>
				  </PopupBody>
			</PopupHolder>)
  }
	
}

export default Popup;