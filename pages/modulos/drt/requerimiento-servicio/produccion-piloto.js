$(document).off('click','#btn-agregar-proceso-produccion');
$(document).on('click','#btn-agregar-proceso-produccion',function(e){
    e.preventDefault();
    idformula=$('input[name=idformula]').val();
    idrequerimiento=$('input[name=idrequerimiento]').val();   
    $.ajax({
        url:servidor+"drt/Formula/cargaModalAgregarProceso",
        dataType:"json",
        type:'post',
        data:{
                tipoProduccion:1,
                idformula:idformula,
                idrequerimiento:idrequerimiento
            },
        success:function(data){
          $('#modal-agregar-proceso').html(data.modal);
          $('#modal-nuevo-proceso').modal('show');
        }
    });
    
});

$(document).off('click','#btn-agregar-proceso-acondicionamiento');
$(document).on('click','#btn-agregar-proceso-acondicionamiento',function(e){
    e.preventDefault();
    idformula=$('input[name=idformula]').val();
    idrequerimiento=$('input[name=idrequerimiento]').val();   
    $.ajax({
        url:servidor+"drt/Formula/cargaModalAgregarProceso",
        dataType:"json",
        type:'post',
        data:{
                tipoProduccion:2,
                idformula:idformula,
                idrequerimiento:idrequerimiento
            },
        success:function(data){
          $('#modal-agregar-proceso').html(data.modal);
          $('#modal-nuevo-proceso').modal('show');
        }
    });
});
$(document).off('change','.input-horas-proceso');
$(document).on('change','.input-horas-proceso',function(e){
    var campo=$(this).attr('name');
    var idreg=$(this).attr('data-id');
    var valor=$(this).val();
    var idformula=$('input[name=idformula]').val();
    var tabla_target=$(this).parent().parent().parent().parent().parent();
    var fila_targethh=$(this).parent().parent().parent().find('td.subtotal-hh');
    var fila_targethm=$(this).parent().parent().parent().find('td.subtotal-hm');
    var tipoproceso=tabla_target.attr("data-tipo");    

    
    if($.isNumeric(valor)){       
        
        $.ajax({
            url:servidor+"drt/Formula/ingresoHorasPorProceso",
            type:"post",
            dataType:'json',
            data:{iddetalle:idreg,valor:valor,name:campo,tipoproceso:tipoproceso,idformula:idformula},
            success:function(data){
                console.log(data);
                //tvertical
                tabla_target.find('th.'+campo).html(data.totales.tvertical);
                //thorizontal
                fila_targethh.html(data.totales.subthombre);
                fila_targethm.html(data.totales.subtmaquina);
                //totales
                tabla_target.find('th.totalhh').html(data.totales.ttotalhombre);
                tabla_target.find('th.totalhm').html(data.totales.ttotalmaquina);
                
            }
            
        })
    }else{
        alertify.error('solo numeros');
    }
});

$(document).off('click','.btn-eliminar-proceso');
$(document).on('click','.btn-eliminar-proceso',function(e){
    e.preventDefault();
    var idformula=$('input[name=idformula]').val();
    var idreg=$(this).attr('data-id');    
    var tabla_target=$(this).parent().parent().parent().parent();
    var tipoproceso=tabla_target.attr("data-tipo");
    var fila_target=$(this).parent().parent();
    
    $.ajax({
        url:servidor+"drt/Formula/deleteHoraPorProceso",
        type:"post",
        dataType:'json',
        data:{idformula:idformula,iddetalle:idreg,tipoproceso:tipoproceso},
        success:function(data){           
            console.log(data);
            fila_target.hide();
            tabla_target.find('tfoot th.nSetupHH').html(data.totales.setup);
            tabla_target.find('tfoot th.nProcesoHH').html(data.totales.procesohh);
            tabla_target.find('tfoot th.nProcesoHM').html(data.totales.procesohm);
            tabla_target.find('tfoot th.nLimpiezaMaq').html(data.totales.limhh);
            tabla_target.find('tfoot th.nLimpiezaAre').html(data.totales.limparea);

            tabla_target.find('tfoot th.totalhh').html(data.totales.ttotalhombre);
            tabla_target.find('tfoot th.totalhm').html(data.totales.ttotalmaquina);

        }
    })
      
});