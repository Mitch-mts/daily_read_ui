import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as api from "./api/ApiConstants.js"
import { Utility } from "./utility/Utility.js";

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


const DailyReader = () => {
    const [collapseOpen, setCollapseOpen] = React.useState(false);
    const [book, setBook] = useState('')
    const [bookId, setBookId] = useState('')
    const [testament, setTestamant] = useState('')
    const [title, setTitle] = useState('Reading for today')
    const [colour, setColour] = useState('royalblue')
    const [chapter, setChapter] = useState('')
    const [verse, setVerse] = useState('In the beginning God created the heaven and the earth.')
    const [verseId, setVerseId] = useState('')
    const [showButton, setShowButton] = useState(false)
    const [disabled, setDiabled] = useState(true)


    const bookService = new Utility()

    const url = api.BIBLE_API + api.BOOK + bookId + api.CHAPTER + chapter
    console.log("bible reading url ====>> " + url)

    // useEffect(() => {
    //     bookService.getBibleBooks(book)
    //     .then((data) => {
    //         set
    //     })
    // },[])

    const getBookId = () => {

    }
    
    const handleResponse = (response) => {
        console.log("bible api response ===> " + response)
        var data = response.data.result

        data.map(reading => {
            let chapter = reading.chapterId
            let verseId = reading.verseId
            let verse = reading.verse
            let book = reading.book.name
            let testament = reading.book.testament

            setVerse(verse)
            setChapter(chapter)
            setBook(book)
            setVerseId(verseId)

         
            if(testament === "NT"){
                setTestamant("New Testament")
            }else{
                setTestamant("Old Testament")
            }
        })

        setDiabled(true)
        setShowButton(false)

        
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
        axios.get(url)
        .then(handleResponse)
        .catch((error) => {
            console.log("error occured " + error.message)
            let message = error.message === 'Network Error' ? 'Service temporarily unavailable' : error.message
            setDiabled(true)
            setShowButton(false)

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

                                        <Col lg="3" sm="3">
                                            <FormGroup>
                                            <label class="text-white font-mono text-lg" ><b><i>Testatment</i></b></label>
                                            <Input
                                                defaultValue={testament}
                                                placeholder="Testament"
                                                type="text"
                                                style={{backgroundColor:"white"}}
                                                disabled
                                            ></Input>
                                            </FormGroup>
                                        </Col>

                                        <Col lg="3" sm="3">
                                            <FormGroup>
                                            <label class="text-white font-mono text-lg" ><b><i>Book</i></b></label>
                                            <Input
                                                defaultValue={book}
                                                placeholder="Book"
                                                type="text"
                                                style={{backgroundColor:"white" }}
                                                disabled={disabled}
                                                onChange={(e) => setBook(e.target.value)}
                                            ></Input>
                                            </FormGroup>
                                        </Col>

                                        <Col lg="3" sm="3">
                                            <FormGroup>
                                            <label class="text-white font-mono text-lg" ><b><i>Chapter</i></b></label>
                                            <Input
                                                defaultValue={chapter}
                                                placeholder="Chapter"
                                                type="text"
                                                style={{backgroundColor:"white" }}
                                                disabled={disabled}
                                                onChange={(e) => setChapter(e.target.value)}
                                            ></Input>
                                            </FormGroup>
                                        </Col>

                                        <Col lg="3" sm="3">
                                            <FormGroup>
                                            <label class="text-white font-mono text-lg" ><b><i>Verse</i></b></label>
                                            <Input
                                                defaultValue={verseId}
                                                placeholder="Verse"
                                                type="text"
                                                style={{backgroundColor:"white"}}
                                                disabled={disabled}
                                                onChange={(e) => setVerseId(e.target.value)}
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
                                    <h6 class="text-lg font-serif text-sky-50 font-bold">Your Bible Reading</h6>
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