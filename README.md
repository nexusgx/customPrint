# customPrint
small javascript class to make printing from code easier

`````js

printer=new customPrint;
printer.elements=[
  {type:'h1',content:'Printing'},
  {type:'div',content:'HELLO WORLD'},
  {type:'img',src:'image.jpg'}
];
printer.stylesheets=['layout.css','print.css'];
printer.style='.override{display:none;}';

printer.print();

`````
