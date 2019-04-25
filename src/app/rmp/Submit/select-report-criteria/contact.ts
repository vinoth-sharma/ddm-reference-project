export class Contact{
 
    name: string;
    email: string;
    descr: string;
     
    constructor(name,email){
    this.name = name;
    this.email = email;
    this.descr = this.name + ' ' + this.email;
    }
    } 
    