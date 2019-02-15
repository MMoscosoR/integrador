$(document).ready(function(){
    $.ajaxSetup({
        cache:false
    });
})
  var hot=null;
  var data=null;

$(".prod_3").focusin(function(e){
    $(this).select();
});

$(".cal_3").focusin(function(e){
    $(this).select();
});



$(".prod_3").keyup(function(e){
    e.preventDefault();
    let cant_prod=$(this).val();
    let cant_cal=$(".cal_3").val();
    let factor_prod=$(".prod_2").text();
    let factor_cal=$(".cal_2").text();

    let depre_prod=(parseFloat(factor_prod/cant_prod)).toFixed(4);
    let depre_cal=(parseFloat(factor_cal/cant_cal)).toFixed(4);

    $(".prod_4").text(depre_prod);
    $(".cal_4").text(depre_cal);
});

$(".cal_3").keyup(function(e){
    e.preventDefault();
    let cant_prod=$(".prod_3").val();
    let cant_cal=$(this).val();
    let factor_prod=$(".prod_2").text();
    let factor_cal=$(".cal_2").text();

    let depre_prod=(parseFloat(factor_prod/cant_prod)).toFixed(4);
    let depre_cal=(parseFloat(factor_cal/cant_cal)).toFixed(4);

    $(".prod_4").text(depre_prod);
    $(".cal_4").text(depre_cal);
});

  data= $.ajax({
            url:servidor+"gaf/Depreciacion/getDatosIniciales",
            dataType:"json",
            async:false,   
            success:function(data){
                
            }
        }).responseJSON;   
        
        var depre=data.rows;
        var sumprod=0;
        var sumcal=0;
        $.each(depre,function(i,item){
            if(item.Descripcion=="Maquinarias" || item.Descripcion=="Equipos"){
                sumprod+=parseFloat(item.Produccion);
                sumcal+=parseFloat(item.Control);
            }
        });
        sumprod=sumprod.toFixed(4);
        sumcal=sumcal.toFixed(4);

        calculo(sumprod,sumcal);

var datosdepre=null;     

  var datos=data.rows;
  var datosdepre=datos;
          var cabeceras=data.cabeceras;
          var columnas=data.columnas;
          var hotElement = document.querySelector('#tab_depreciacion');
          var hotElementContainer = hotElement.parentNode;
          var hotSettings = {
            data: datos,
            columns:columnas,
            stretchH: 'all',    
            autoWrapRow: true,
            height: 300,
            minRows: 6,
            manualRowMove: false,
            manualColumnMove: false,
            //rowHeaders: true,
            colHeaders: cabeceras,
            contextMenu: false,
            filters: true,
            dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
            manualRowResize: true,
            manualColumnResize: true,
            language: 'es-MX',
        
            beforeChangeRender: (changes, source) => {
                let sum_prod=0;
                let sum_cal=0;
                $.each(datos,function(i,item){
                    item.Total=(parseFloat(item.Produccion)+parseFloat(item.Ventas)+
                    parseFloat(item.Control)+parseFloat(item.Mantenimiento)+parseFloat(item.Administracion)).toFixed(4);
                    if(item.Descripcion=="Maquinarias" || item.Descripcion=="Equipos"){
                        sum_prod+=parseFloat(item.Produccion);
                        sum_cal+=parseFloat(item.Control);
                    }
                    
                    calculo2(sum_prod,sum_cal);
                    
                });

                datosdepre=datos;
            }
            
          };

          function calculo(sum,cal){
            $(".prod_1").text(parseFloat(sum).toFixed(4));
            $(".cal_1").text(parseFloat(cal).toFixed(4));
            var factor_prod=(parseFloat((parseFloat(sum).toFixed(4)*12)/365)).toFixed(4);
            var factor_cal=(parseFloat((parseFloat(cal).toFixed(4)*12)/365)).toFixed(4);
            $(".prod_2").text(factor_prod);
            $(".cal_2").text(factor_cal);
            var datosjm=data.depreciacion;
            $(".prod_3").val(($(".prod_2").text()/datosjm.prod).toFixed(0));
            $(".cal_3").val(($(".cal_2").text()/datosjm.cont).toFixed(0));
            $(".prod_4").text(datosjm.prod);
            $(".cal_4").text(datosjm.cont);
          }

          function calculo2(sum,cal){
            $(".prod_1").text(parseFloat(sum).toFixed(4));
            $(".cal_1").text(parseFloat(cal).toFixed(4));
            //console.log(sum);
            //console.log(cal);
            var factor_prod=(parseFloat((parseFloat(sum).toFixed(4)*12)/365)).toFixed(4);
            var factor_cal=(parseFloat((parseFloat(cal).toFixed(4)*12)/365)).toFixed(4);
            //console.log(factor_prod);
            //console.log(factor_cal);
            $(".prod_2").text(factor_prod);
            $(".cal_2").text(factor_cal);
            var depre_prod=(parseFloat(factor_prod/($(".prod_3").val()))).toFixed(4);
            var depre_cal=(parseFloat(factor_cal/($(".cal_3").val()))).toFixed(4);
            $(".prod_4").text(depre_prod);
            $(".cal_4").text(depre_cal);
          }


hot= new Handsontable(hotElement, hotSettings);

$(document).off('click','#main-btn-editar');
$(document).on('click','#main-btn-editar',function(e){
    $('#btn-guardar-cambios').attr('disabled',false);
    $(".prod_3").prop("readonly", false);
    $(".cal_3").prop("readonly", false);
    $.each(columnas,function(i,item){
        if(i>=2 && i<7){
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
                    
                    var depreciacion_produccion=$(".prod_4").text();
                    var depreciacion_control=$(".cal_4").text();
                    var data_depre=hot.getData();
                  
                    $.ajax({
                        url:servidor+"gaf/Depreciacion/guardarCambios",
                        data:{array_editados:datosdepre,depreciacion_produccion:depreciacion_produccion,depreciacion_control:depreciacion_control},
                        type:"post",                        
                        success:function(data){
                            //vaciar array de cambios
                            if(data>0){
                                $('#btn-guardar-cambios').attr('disabled',true);
                                filaseditadas=[]; 
                                alertify.success('Guardado');
                                $(".prod_3").prop("readonly", true);
                                $(".cal_3").prop("readonly", true);
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
 
       