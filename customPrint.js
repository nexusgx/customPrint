var customPrint=function(){
    this.elements=[];
    this.element_loading=0;
    this.print=function(){
        //before anything event
        if(typeof this.before!=='undefined')
            this.before();
        
        var element={},
            style={},
            print_iframe,
            style_int,
            i,
            eles=this.elements,
            iframe=document.createElement('iframe');
        
        //hide print iframe away from innocent eyes
        iframe.style="position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;";
        iframe.id='prnt' + (new Date).getTime();
        document.body.appendChild(iframe);
        //iframe.contentDocument.write('<!doctype html><html><head></head><body></body></html>');
        
        //load start event
        if(typeof this.load_start!=='undefined')
            this.load_start(iframe);
        
        //load all external stylesheets
        if(typeof this.stylesheets!=='undefined'){
            this.element_loading++;
            style=document.createElement('style');
            for(i=0;i<this.stylesheets.length;i++){
                style.textContent += '@import "' + this.stylesheets[i] + '";'+"\r";
            }
            style_int = setInterval(function() {
              try {
                style.sheet.cssRules; // only populated once file is loaded
                if(this.stylesheets.length===style.sheet.cssRules.length){
                    this.element_loading--;
                    clearInterval(style_int);
                }
              } catch (e){}
            }, 10);  

            iframe.contentDocument.getElementsByTagName('head')[0].appendChild(style);
            
        }
        
        //add any bit of CSS you want
        if(typeof this.styles!=='undefined'){
            element=document.createElement('style');
            element.textContent=this.styles;
            iframe.contentDocument.getElementsByTagName('head')[0].appendChild(element);
        }
        
        //loop through all elements
        for(i=0;i<eles.length;i++){
            
            //set element to div if it's not provided
            if(typeof eles[i].type==='undefined')
                eles[i].type='div';
                
            //create a page break
            else if(eles[i].type==='page break'){
                eles[i].type='div';
                eles[i].style='page-break-before:always;overflow:hidden;width:1px;height:1px';
            }
            
            if(typeof eles[i].content==='undefined')
                eles[i].content='';
            
            element=document.createElement(eles[i].type);
            
            //if the element is an image, account for it in the loading total, and set it's source
            if(eles[i].type==='img'){
                this.element_loading++;
                element.src=eles[i].src;
                eles[i].onload=function(){
                    this.element_loading--;
                };
            }
            element.innerHTML=eles[i].content;
            
            //set the classes and styles if there are any
            if(typeof eles[i].class!=='undefined')
                element.className=eles[i].class;
            if(typeof eles[i].style!=='undefined')
                element.style=eles[i].style;
            
            //send to iframe
            iframe.contentDocument.body.appendChild(element);
        }
        
        //after elements have been added event (not necessarily images or stylesheets loaded)
        if(typeof this.elements_added!=='undefined')
            this.elements_added(iframe);
        
        this.iframe=iframe;
        print_iframe=function(){
            if(this.element_loading>0){ //not everything is loaded; try again in 50ms
                setTimeout(print_iframe,50);
            }
            else{ //everything's loaded
                if(typeof this.load_end!=='undefined')
                    this.load_end(iframe);
                    console.log('printing')
                iframe.contentWindow.print();
                setTimeout(function(){iframe.remove();},10000)
            }
        };
        setTimeout(print_iframe,50);
    }
};
