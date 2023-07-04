function getBibleBook(bookNumber) {
    // Check if the book number is valid.
    if (bookNumber < 1 || bookNumber > 66) {
      return "Invalid Book Selected"
    }
  
    // Get the list of Old Testament books.
    const oldTestamentBooks = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
                            "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
                            "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
                            "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
                            "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
                            "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
                            "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
                            "Zephaniah", "Haggai", "Zechariah", "Malachi"];
  
    // Get the list of New Testament books.
    const newTestamentBooks = ["Matthew", "Mark", "Luke", "John", "Acts", "Romans",
                           "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
                           "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
                           "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
                           "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
                           "Jude", "Revelation"];
  
    // Return the book name based on the book number.
    if (bookNumber <= 39) {
      return oldTestamentBooks[bookNumber - 1];
    } else {
      return newTestamentBooks[bookNumber - 40];
    }
  }
  