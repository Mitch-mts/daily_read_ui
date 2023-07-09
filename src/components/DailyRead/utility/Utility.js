export class Utility{
    getBibleBooks(){
        fetch(this.contextPath + 'src/books.json', { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => d.data);
    }
    
}