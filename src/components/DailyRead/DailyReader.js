import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as api from "./api/ApiConstants.js"

import {
    Card,
    CardHeader,
    CardBody,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
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


const DailyReader = () => {
    const [collapseOpen, setCollapseOpen] = React.useState(false);
    const [books, setBooks] = useState(43)
    const [book, setBook] = useState('')
    const [testament, setTestamant] = useState('')
    const [title, setTitle] = useState('Reading for today')
    const [colour, setColour] = useState('royalblue')
    const [chapter, setChapter] = useState('')
    const [chapterId, setChapterId] = useState(1)
    const [verse, setVerse] = useState('')
    const [verseId, setVerseId] = useState('')
    const [showButton, setShowButton] = useState(false)
    const [disabled, setDiabled] = useState(true)

    const url = api.BIBLE_API + api.BOOK + books+ api.CHAPTER + chapterId
    console.log("bible reading url ====>> " + url)

    
   


    
    useEffect(() => {

        axios.get(url)
        .then(handleResponse)
        .catch((error) => {
            console.log("error occured " + error.message)
            let message = error.message === 'Network Error' ? 'Service temporarily unavailable' : error.message
            return(
                Swal.fire(
                    'Error',
                    message,
                    'error'
                )
            )
        })

       
    },[])

    const handleResponse = (response) => {
        console.log("bible api response ===> " + response)
        var data = response.data.result
        console.log("data response ==>" + data)

        data.map(reading => {
            var chapter = reading.chapterId
            var verseId = reading.verseId
            var verse = reading.verse
            var book = reading.book.name
            var testament = reading.book.testament
            var bookId = reading.book.id
            setVerse(verse)
            setChapter(chapter)
            setBook(book)
            setVerseId(verseId)

         
            if(testament === "NT"){
                setTestamant("New Testament")
            }else{
                setTestamant("Old Testament")
            }

            console.log("chapter => " + chapter)
            console.log("verseId => " + verseId)
            console.log("verse => " + verse)
            console.log("book => " + book)
            console.log("testament => " + testament)
            console.log("bookId => " + bookId)
        })

        
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

    const handleSubmitButton = () => {
        const url = api.BIBLE_API + api.BOOK + books+ api.CHAPTER + chapterId

        axios.get(url)
        .then(handleResponse)
        .catch((error) => {
            console.log("error occured " + error.message)
            let message = error.message === 'Network Error' ? 'Service temporarily unavailable' : error.message
            return(
                Swal.fire(
                    'Error',
                    message,
                    'error'
                )
            )
        })

        Swal.fire(
            "Your Reading",
            "God is good all the time",
            "sucess"
            )

        setDiabled(true)
        setShowButton(false)
    }

    var button;
    if(showButton){
        button = <Button className="btn-round" color="success" type="button" onClick={handleSubmitButton}>Open Reading</Button>
    }else{
        button = <Button className="btn-round" color="danger" type="button" onClick={handleChangeButton}> Edit Reading</Button>
    }


    return(
        <div>
            <div className="section section-basic" id="basic-elements">
                <Container>
                    <Row>
                        <Col md="12">
                            <h4 onMouseEnter={handleMouseEnter} onMouseLeave={handleOnMouseLeave} style={{ color:colour }}>{title}</h4>
                            <Navbar className="bg-info" expand="lg">
                                <Container>
                                <Collapse isOpen={collapseOpen} navbar>
                                    <Nav navbar>

                                        <Col lg="3" sm="3">
                                            <FormGroup>
                                            <label style={{ color: "white" }}><b><i>Testatment</i></b></label>
                                            <Input
                                                defaultValue={testament}
                                                placeholder="Testament"
                                                type="text"
                                                style={{backgroundColor:"white" }}
                                                disabled={disabled}
                                            ></Input>
                                            </FormGroup>
                                        </Col>

                                        <Col lg="3" sm="3">
                                            <FormGroup>
                                            <label style={{ color: "white" }}><b><i>Book</i></b></label>
                                            <Input
                                                defaultValue={book}
                                                placeholder="Book"
                                                type="text"
                                                style={{backgroundColor:"white" }}
                                                disabled={disabled}
                                            ></Input>
                                            </FormGroup>
                                        </Col>

                                        <Col lg="3" sm="3">
                                            <FormGroup>
                                            <label style={{ color: "white" }}><b><i>Chapter</i></b></label>
                                            <Input
                                                defaultValue={chapter}
                                                placeholder="Chapter"
                                                type="text"
                                                style={{backgroundColor:"white" }}
                                                disabled={disabled}
                                            ></Input>
                                            </FormGroup>
                                        </Col>

                                        <Col lg="3" sm="3">
                                            <FormGroup>
                                            <label style={{ color: "white" }}><b><i>Verse</i></b></label>
                                            <Input
                                                defaultValue={verseId}
                                                placeholder="Verse"
                                                type="text"
                                                style={{backgroundColor:"white"}}
                                                disabled={disabled}
                                            ></Input>
                                            </FormGroup>
                                        </Col>
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
                                    <h6>Your Bible Reading</h6>
                                    </Nav>
                                </CardHeader>
                                <CardBody>
                                    <p>
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