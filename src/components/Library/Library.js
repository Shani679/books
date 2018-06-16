import React , { Component}  from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Book from '../Book/Book';
import Popup from '../Modal/Popup';

const BooksHolder = styled.div`
    display: flex;
    flex-wrap:wrap;
    justify-content:center;
    padding:30px;
    width:80%;
    margin:0 auto;
`;

const LibraryWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items: center;
`

const AddButton = styled.button`
  border:none;
  background-color:transparent;
  font-style: italic;
  font-weight:bold;
  font-size: 17px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 15px;
  -webkit-box-shadow: 3px 3px 23px 1px rgba(0,0,0,0.75);
  -moz-box-shadow: 3px 3px 23px 1px rgba(0,0,0,0.75);
  box-shadow: 3px 3px 23px 1px rgba(0,0,0,0.75);
  transition: .4s all ease-in;
  background-color:#e0d5c3;
  color: #5a5757;
  outline:none;
  &:hover{
    color:#e0d5c3;
    background-color:transparent;
  }
  &:focus{
    outline:none;
  }
`

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      books: [],
      popupDisplay: false,
    };  
  }

  componentDidMount(){
    axios.get('https://www.googleapis.com/books/v1/volumes?q=the+marry+poppins')
    .then(({data}) => {
        const books = data.items.map(book => {
          return {
                id: book.id,
                title: book.volumeInfo.title,
                publishedDate: book.volumeInfo.publishedDate,
                authors: book.volumeInfo.authors
          }
        })
        this.setState({
          ...this.state,
          books
        })
    }) 
  }

  removeFromLibrary(bookId){
    const tempBooks = this.state.books.filter(current => current.id !== bookId)
    this.setState({
      books: tempBooks
    })
  }

  showPopup(){
    this.setState({
      popupDisplay: true,
    })
  }

  isBookExist(book){
    const books = this.state.books;
    for (let i = 0; i < books.length; i++) {
      if(books[i].id === book.id){
        return i;
      }
    }
    return -1;
  }

  updateLibraryCollection(book){
    const books = this.state.books;
    const foundBookIndex = this.isBookExist(book);
    if(foundBookIndex > -1){
      books[foundBookIndex] = book;
      return this.setState({
        popupDisplay:false,
        books
      })
    }
    return this.setState({
      popupDisplay: false,
      books: [...this.state.books, book]
    })
  }

  closePopup(){
    this.setState({
      popupDisplay: false
    })
  }

  randomColor(i){
    const colors = ['#778dc5', '#b9b298', '#ecb1c9', '#fff1ad', '#43a8a4', '#cc4b48', '#88e9b1', '#f4b25d', '#ab8cc2'];
    return colors[i-colors.length*(parseInt(i / colors.length))]
	}

  displayBooks(){
    const books = this.state.books;
    
    return (
          books.map((current, i)=>{
            return(
              <Book key={i} 
                    book={current}
                    color={this.randomColor(i)}
                    delete={id => this.removeFromLibrary(id)}
                    update = {book => this.updateLibraryCollection(book)}
              /> 
            );
          })
      )
  }

  

  render() {
    return(
      <LibraryWrapper>
        <AddButton onClick={()=>this.showPopup()}>Add new <i className="fa fa-book"></i></AddButton>
        {this.state.popupDisplay && <Popup saveBook={book => this.updateLibraryCollection(book)} 
                                           close={()=>this.closePopup()} 
                                           color={this.randomColor(this.state.books.length)}
                                    />}
        <BooksHolder>
          {this.displayBooks()}
        </BooksHolder>
      </LibraryWrapper>
    )
  }
}


export default Library;

