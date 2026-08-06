export type BookCopyParams = {
    bookId? : string;
    copyId? : string
}

export interface BookCopyBody {
    accessionNumber? : string; 
    status? : "available" | "borrowed" | "reserved" | "lost"; 
    condition? :  "new" | "good" | "damaged";
    purchaseDate? : Date; 
    price? : number;
}