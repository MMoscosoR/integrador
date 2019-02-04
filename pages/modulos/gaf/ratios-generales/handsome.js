$(document).ready(function(){
    $.ajaxSetup({
        cache:false
    });
})
  var hot=null;
  var data=null;

  data= $.ajax({
            url:servidor+"gaf/RatioGenerales/getDatosIniciales",
            dataType:"json",
            async:false,   
            success:function(data){
                
            }
        }).responseJSON;   

  var datos=data.rows;
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
          };

hot= new Handsontable(hotElement, hotSettings);

$(document).off('click','#main_btn_editar');
$(document).on('click','#main_btn_editar',function(e){
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

$(document).off('click','#btn-guardar-cambios');
$(document).on('click','#btn-guardar-cambios',function(e){
    hot.validateCells((valid) => {
        if (valid) {
          alertify.confirm('Estas Seguro?',
                function(){
                    console.log(filaseditadas);
                                      
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
                        data:{array_editados:filaseditadas},
                        type:"post",                        
                        success:function(data){
                            //vaciar array de cambios
                            if(data>0){
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
 
       