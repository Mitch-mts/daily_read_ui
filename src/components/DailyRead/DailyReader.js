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
    Nav,
    Collapse,
    Container,
    Row,
    Col,
  } from "reactstrap";


const DailyReader = () => {
    const [pills, setPills] = React.useState("1");
    const [collapseOpen, setCollapseOpen] = React.useState(false);
    const [books, setBooks] = useState('')
    const [book, setBook] = useState('Mark')
    const [testament, setTestamant] = useState('Old')
    const [title, setTitle] = useState('Reading for today')
    const [colour, setColour] = useState('royalblue')
    const [chapter, setChapter] = useState(1)
    const [verse, setVerse] = useState(1)
    const [counter, setCounter] = useState(0)

    const url = api.BASE_URL + api.BOOK + books + api.CHAPTER + chapter
    console.log("bible reading url ====>> " + url)


    const bookOptions = [
        {
            name: "Matthew"
        },
        {
            name: "Mark"
        },
        {
            name: "Luke"
        },
        {
            name: "John"
        }
    ]

    const testamentOptions = [
        {
            name: "Old"
        },
        {
            name: "New"
        }
    ]

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
    }
   
    const handleMouseEnter = () => {
        let heading = title === "Reading for today" ? "Select your reading for today" : "Reading for today"
        setTitle("Select your reading for today")
        setColour("purple")
    }

    const handleOnMouseLeave = () => {
        setTitle("Reading for today")
        setColour("royalblue")
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
                                        <UncontrolledDropdown nav>
                                            <DropdownToggle
                                            aria-haspopup={true}
                                            caret
                                            color="default"
                                            href="#"
                                            nav
                                            >
                                                <p>Testament: {testament}</p>
                                            </DropdownToggle>

                                            <DropdownMenu>
                                            {testamentOptions.map(testament => {
                                                        return(
                                                            <DropdownItem
                                                                href="#"
                                                                onClick={(e) => e.preventDefault()}
                                                            >
                                                                {testament.name}
                                                            </DropdownItem>
                                                        )
                                                })}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>

                                        <UncontrolledDropdown nav>
                                            <DropdownToggle
                                            aria-haspopup={true}
                                            caret
                                            color="default"
                                            href="#"
                                            nav
                                            >
                                                <p>Book: {book}</p>
                                            </DropdownToggle>

                                            <DropdownMenu>
                                                {bookOptions.map(book => {
                                                        return(
                                                            <DropdownItem
                                                                href="#"
                                                                onClick={(e) => e.preventDefault()}
                                                            >
                                                                {book.name}
                                                            </DropdownItem>
                                                        )
                                                })}
                                                
                                            </DropdownMenu>
                                        </UncontrolledDropdown>

                                        <UncontrolledDropdown nav>
                                            <DropdownToggle
                                            aria-haspopup={true}
                                            caret
                                            color="default"
                                            href="#"
                                            nav
                                            >
                                                <p>Chapter: {chapter}</p>
                                            </DropdownToggle>

                                            <DropdownMenu>
                                                {bookOptions.map(() => {
                                                        return(
                                                            <DropdownItem
                                                                href="#"
                                                                onClick={(e) => e.preventDefault()}
                                                            >
                                                                {counter}
                                                            </DropdownItem>
                                                        )
                                                })}
                                                
                                            </DropdownMenu>
                                        </UncontrolledDropdown>

                                        <UncontrolledDropdown nav>
                                            <DropdownToggle
                                            aria-haspopup={true}
                                            caret
                                            color="default"
                                            href="#"
                                            nav
                                            >
                                                <p>Verse: {verse}</p>
                                            </DropdownToggle>

                                            <DropdownMenu>
                                                {bookOptions.map(book => {
                                                        return(
                                                            <DropdownItem
                                                                href="#"
                                                                onClick={(e) => e.preventDefault()}
                                                            >
                                                                {book.name}
                                                            </DropdownItem>
                                                        )
                                                })}
                                                
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Nav>
                                </Collapse>
                                <Button className="btn-round" color="success" type="button">
                                    Open Reading
                                </Button>
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
                                        I think that’s a responsibility that I have, to push
                                        possibilities, to show people, this is the level that
                                        things could be at. So when you get something that has
                                        the name Kanye West on it, it’s supposed to be pushing
                                        the furthest possibilities. I will be the leader of a
                                        company that ends up being worth billions of dollars,
                                        because I got the answers. I understand culture. I am
                                        the nucleus.
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