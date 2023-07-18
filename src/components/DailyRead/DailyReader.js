import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as api from "./api/ApiConstants.js"
import { Utility } from "./utility/Utility.js";
import { BOOK_DATA } from "./utility/BookData.js";

import {
    Card,
    CardHeader,
    CardBody,
    UncontrolledTooltip,
    Button,
    Navbar,
    FormGroup,
    Input,
    Nav,
    Collapse,
    Container,
    Row,
    Col,
  } from "reactstrap";
import Utils from "./Utils.js";
import Dropdown from "./Dropdown.js";


const DailyReader = () => {
    const [collapseOpen, setCollapseOpen] = React.useState(false);
    const [bookName, setBookName] = useState('Select Book')
    const [bookId, setBookId] = useState('')
    const [testament, setTestamant] = useState()
    const [title, setTitle] = useState('Reading for today')
    const [colour, setColour] = useState('royalblue')
    const [chapter, setChapter] = useState()
    const [chapterId, setChapterId] = useState()
    const [verse, setVerse] = useState()
    const [verseId, setVerseId] = useState()
    const [showButton, setShowButton] = useState(true)
    const [disabled, setDiabled] = useState(true)
    const [reading, setReading] = useState()
    const books = BOOK_DATA.books;
    const bookList = []
    const chapterNumbers = []
    const verseNumbers = []

    var filteredBookByTestament = books.filter(book => book.testament === testament)
    var filteredBooks = books.filter(name => name.book === bookName);

    filteredBookByTestament.map(book => {
        bookList.push(book.book)

        filteredBooks.map(chapter => {
            for(let i = 1; i <= chapter.chapters; i++){
                chapterNumbers.push(i)
            }
        })
    })    

    const url = api.BIBLE_API + api.BOOK + bookId + api.CHAPTER + chapterId
    console.log("bible reading url ====>> " + url)


    const handleResponse = (response) => {
        console.log("bible api response ===> " + response)
        var data = response.data.result
        var verses = []

        data.map(reading => {
            let chapter = reading.chapterId
            let verseId = reading.verseId
            let verse = reading.verse
            let book = reading.book.name
            let testament = reading.book.testament

            let bibleVerse = verseId + ". " + verse + " "
            verses.push(bibleVerse)
            setVerse(verses)
            setChapter(chapter)
            setBookName(book)
            setVerseId(verseId)

         
            if(testament === "NT"){
                setTestamant("New Testament")
            }else{
                setTestamant("Old Testament")
            }

            
        })

        // setDiabled(true)
        // setShowButton(false)

        var read = " the book of " + bookName + " chapter " + chapterId
        console.log("reading is " + read)
        setReading(read)
        
    }
   
    const handleMouseEnter = () => {
        setTitle("Select your reading for today")
        setColour("purple")
    }

    const handleOnMouseLeave = () => {
        setTitle("Reading for today")
        setColour("royalblue")
    }

    const handleChangeButton = () => {
        setDiabled(false)
        setShowButton(true)
    }

    const handleVerseChange = (e) => {
        setVerseId(e.target.value)
    }

    const handleOnChangeTestament = (e) => {
        setTestamant(e.target.value)
    }

    const handleBookNameChange = (e) => {
        setBookName(e.target.value)
        let bookId = books.find(book => book.book === e.target.value).id
        setBookId(bookId)
    }

    const handleChapterChange = (e) => {
        setChapterId(e.target.value)
    }


    const handleSubmitButton = () => {
        axios.get(url)
        .then(handleResponse)
        .catch((error) => {
            console.log("error occured " + error.message)
            let message = error.message === 'Network Error' ? 'Service temporarily unavailable' : error.message
            // setDiabled(true)
            // setShowButton(false)

            return(
                Swal.fire(
                    'Error',
                    message,
                    'error'
                )
            )
        })
    }

    var button;
    if(showButton){
            button = <>
            <Button className="btn-round btn-tooltip" 
            color="success" 
            type="button" 
            id="edit"
            onClick={handleSubmitButton}> 
                Open Reading
            </Button>
            <UncontrolledTooltip
                    delay={0}
                    placement="right"
                    target="edit"
                >
                    &#128515; Click to read
                </UncontrolledTooltip>
        </>
    }else{
        button = <>
            <Button className="btn-round btn-tooltip" 
            color="danger" 
            type="button" 
            id="edit"
            onClick={handleChangeButton}> 
                Edit Reading
            </Button>
            <UncontrolledTooltip
                    delay={0}
                    placement="right"
                    target="edit"
                >
                    &#128519; Click here to set your own bible reading
                </UncontrolledTooltip>
        </>
    }


    return(
        <div>
            <div className="section section-basic" id="basic-elements">
                <Container>
                    <Row>
                        <Col md="12">
                            <h4 onMouseEnter={handleMouseEnter} 
                            onMouseLeave={handleOnMouseLeave} 
                            style={{ color:colour }} 
                            class="text-3xl font-serif font-bold">
                                {title}
                            </h4>
                            <br/>
                            <Navbar className="bg-info" expand="lg">
                                <Container>
                                <Collapse isOpen={collapseOpen} navbar>
                                    <Nav navbar>
                                        <Col md="4">
                                            <FormGroup>
                                            <label class="text-white font-mono text-lg" ><b><i>Testatment</i></b></label>
                                            
                                            <select id="small" value={testament} onChange={handleOnChangeTestament} class="block w-full p-2 mb-3 text-sm text-blue-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-blue-500 dark:placeholder-gray-400 dark:text-blue-900 dark:focus:ring-blue-900 dark:focus:border-blue-500">
                                                <option>Select Testament</option>
                                                <option value="OT">Old Testament</option>
                                                <option value="NT">New Testament</option>
                                            </select>
                                            </FormGroup>
                                        </Col>

                                        <Col md="4">
                                            <FormGroup>
                                            <label class="text-white font-mono text-lg" ><b><i>Book</i></b></label>
                                            <select id="small" value={bookName} onChange={handleBookNameChange} class="block w-full p-2 mb-3 text-sm text-blue-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-blue-500 dark:placeholder-gray-400 dark:text-blue-900 dark:focus:ring-blue-900 dark:focus:border-blue-500">
                                                {bookList.map(book => {
                                                    return (
                                                        <>
                                                            <option value={book}>
                                                                {book}
                                                            </option>
                                                        </>
                                                        
                                                        );
                                                })}  
                                            </select>
                                            </FormGroup>
                                        </Col>

                                        <Col md="4">
                                            <FormGroup>
                                            <label class="text-white font-mono text-lg" ><b><i>Chapter</i></b></label>
                                            <select id="small" value={chapterId} onChange={handleChapterChange} class="block w-full p-2 mb-3 text-sm text-blue-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-blue-500 dark:placeholder-gray-400 dark:text-blue-900 dark:focus:ring-blue-900 dark:focus:border-blue-500">
                                                {chapterNumbers.map((number) => {
                                                    return (
                                                        <>
                                                            <option value={number}>
                                                                {number}
                                                            </option>
                                                        </>
                                                        
                                                        );
                                                })}        
                                            </select>
                                            </FormGroup>
                                        </Col>

                                        {/* <Col lg="4" sm="4">
                                            <FormGroup>
                                            <label class="text-white font-mono text-lg" ><b><i>Verse</i></b></label>
                                            <select id="small" value={verseId} onChange={handleVerseChange} class="block w-full p-2 mb-3 text-sm text-blue-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-blue-500 dark:placeholder-gray-400 dark:text-blue-900 dark:focus:ring-blue-900 dark:focus:border-blue-500">
                                                {verseNumbers.map((number) => {
                                                    return (
                                                        <>
                                                            <option value={number}>
                                                                {number}
                                                            </option>
                                                        </>
                                                        
                                                        );
                                                })}        
                                            </select>
                                            </FormGroup>
                                        </Col> */}

                                    </Nav>
                                </Collapse>
                               
                                {button}
                               
                                </Container>
                            </Navbar>
                        </Col>
                        <Col className="ml-auto mr-auto" md="10" xl="12">

                            <Card>
                                <CardHeader>
                                    <Nav
                                        className="nav-tabs-neutral justify-content-center"
                                        data-background-color="blue"
                                        role="tablist"
                                        tabs
                                    >
                                    <h6 class="text-lg font-serif text-sky-50 font-bold">
                                        Your Bible Reading from {reading}
                                    </h6>
                                    </Nav>
                                </CardHeader>
                                <CardBody>
                                    <p class="text-blue-800 text-lg">
                                        {verse}
                                    </p>                                  

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default DailyReader