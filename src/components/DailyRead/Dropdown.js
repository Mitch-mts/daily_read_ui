import React, { useState } from "react";
import { BOOK_DATA } from "./utility/BookData";
import axios from "axios";
import * as api from "./api/ApiConstants.js"

import {
    Row,
    Col,
  } from "reactstrap";

const Dropdown = () => {
    const books = BOOK_DATA.books;
    const [bookName, setBookName] = useState()
    const [testament, setTestamant] = useState()
    const chapterNumbers = [];
    const verseNumbers = [];
    const bookList = []
    const [bookId, setBookId] = useState()
    const [chapterId, setChapterId] =useState()
    const [chapter, setChapter] = useState()
    const [verse, setVerse] = useState([])
    const [verseId, setVerseId] = useState('1')
    const url = api.BIBLE_API + api.BOOK + bookId + api.CHAPTER + chapterId



    var filteredBookByTestament = books.filter(book => book.testament === testament)
    var filteredBooks = books.filter(name => name.book === bookName);
   

    filteredBookByTestament.map(book => bookList.push(book.book))    

    filteredBooks.map(chapter => {
        for(let i = 1; i <= chapter.chapters; i++){
            chapterNumbers.push(i)
        }
    })

    filteredBooks.forEach(chapter => {        
        for (let i = 1; i <= chapter.verses; i++) {
            verseNumbers.push(i);
        }})

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

    const handleRequest = () => {
        axios.get(url)
        .then(handleResponse)
        .catch((error) => {
        })
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

            // let bibleVerse

            setVerse(verse)
            setChapter(chapter)
            setBookName(book)
            setVerseId(verseId)

         
            if(testament === "NT"){
                setTestamant("New Testament")
            }else{
                setTestamant("Old Testament")
            }
        })

        
    }

    return(
        <>
        <Row>
            <Col lg="3" sm="3">
                <select id="small" value={testament} onChange={handleOnChangeTestament} class="block w-full p-2 mb-3 text-sm text-blue-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-blue-500 dark:placeholder-gray-400 dark:text-blue-900 dark:focus:ring-blue-900 dark:focus:border-blue-500">
                    <option>Select Testament</option>
                    <option value="OT">Old Testament</option>
                    <option value="NT">New Testament</option>
                </select>
            </Col>

            <Col lg="3" sm="3">
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
            </Col>

            <Col lg="3" sm="3">
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
            </Col>

            <Col lg="3" sm="3">
            <button onClick={handleRequest}>Submit</button>

            </Col>
        </Row>

        <Row>
            <p>{verse}</p>
        </Row>

        </>
    )
}

export default Dropdown