export class Transaction {
    constructor(
        public id: string,
        public title: string,
        public seller: string,
        public buyer: string,
        public price: number,
        ) {
    }
}