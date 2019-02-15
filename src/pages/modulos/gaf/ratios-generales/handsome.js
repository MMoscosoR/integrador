$(document).ready(function(){
    $.ajaxSetup({
        cache:false
    });
})
var hot=null;
var data=null;
var dataratio=null; 
  data= $.ajax({
            url:servidor+"gaf/RatioGenerales/getDatosIniciales",
            dataType:"json",
            async:false,   
            success:function(data){
                
            }
        }).responseJSON;   
        //console.log(data);
  var datos=data.rows;
  dataratio=datos;
          var cabeceras=data.cabeceras;
          var columnas=data.columnas;
          var hotElement = document.querySelector('#ratiosGenerales');
          var hotElementContainer = hotElement.parentNode;
          var hotSettings = {
            data: datos,
            columns:columnas,
            stretchH: 'all',    
            autoWrapRow: true,
            height: 487,
            maxRows: 22,
            manualRowMove: false,
            manualColumnMove: false,
            rowHeaders: true,
            colHeaders: cabeceras,
            contextMenu: false,
            filters: true,
            dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
            manualRowResize: true,
            manualColumnResize: true,
            language: 'es-MX'
          ,beforeChangeRender: (changes, source) => {
            dataratio=datos;
        }
    };
        

hot= new Handsontable(hotElement, hotSettings);

$(document).off('click','#main-btn-editar');
$(document).on('click','#main-btn-editar',function(e){
    $('#btn-guardar-cambios').attr('disabled',false);
    $.each(columnas,function(i,item){
        if(i>=2){
            item.readOnly=false;
        }
    });
    hot.updateSettings({
        columns:columnas
     });
    
});

var filaseditadas=[];

$(document).off('click','#main-btn-guardar');
$(document).on('click','#main-btn-guardar',function(e){
    hot.validateCells((valid) => {
        if (valid) {
          alertify.confirm('Estas Seguro?',
                function(){
                                      
                    //bloquear celdas
                    $.each(columnas,function(i,item){
                        if(i>=2){
                            item.readOnly=true;
                        }
                    });
                    hot.updateSettings({
                        columns:columnas
                     });
                     hot.unlisten();
                    //enviar datos al servidor
                     
                    $.ajax({
                        url:servidor+"gaf/RatioGenerales/guardarCambios",
                        data:{array_editados:dataratio},
                        type:"post",                        
                        success:function(data){
                            //vaciar array de cambios
                            if(parseInt(data)==1){
                                $('#btn-guardar-cambios').attr('disabled',true);
                                filaseditadas=[]; 
                                alertify.success('Guardado');
                            }else{
                                alertify.error('No se guardo los datos');
                            }
                            
                        }
                    });                    
              
                    
                },
                function(){
                   
                });
        }else{
            alertify.error('Ingrese solo numeros');
        }
      })
});



Handsontable.hooks.add('afterChange', function(e,g){

    hot.validateCells((valid) => {
        if (valid) {
            var rowseditadas=[];
            $.each(e,function(i,item){
                rowseditadas.push(hot.getDataAtRow(item[0]));
            });
            filaseditadas=[...filaseditadas, ...rowseditadas];
            
            
        }else{
            alertify.error('Ingrese solo numeros');
        }
      })
                      
},hot);
 
       