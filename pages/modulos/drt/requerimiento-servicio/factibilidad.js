$(document).on('click','.btn-factibilidad',function(e){
    var idReg=$(this).attr('data-id');
    $.ajax({
        url:servidor+'drt/Factibilidad/reqServicio',
        type:'post',
        data:{idreg:idReg},
        success:function(data){
            data=JSON.parse(data);
            $('#form_factibilidad input[name=VMatEmpaque]').val(data.requerimiento.material).prop('readonly',true);
            $('#form_factibilidad input[name=iLoteTentativo]').val(data.requerimiento.iLoteTentativo+' '+data.requerimiento.vUndMedida).prop('readonly',true);
            $('#form_factibilidad input[name=vNombreProducto]').val(data.requerimiento.vNombreProducto).prop('readonly',true);
            $('#form_factibilidad input[name=vNombreGranel]').val(data.requerimiento.vNombreGranel).prop('readonly',true);
            $('#form_factibilidad input[name=idrequerimiento]').val(data.requerimiento.idRequerimiento);
            $('#tbl_formulas').html(data.tabla);
        }
    });
    $('#modalFactibilidad').modal('show');
});

$(document).on('click','#btn-agregar-formula',function(e){
    alertify.confirm('Creación de nueva formula', 
                        'Una vez creada la nueva formula no se podra eliminar ...', 
                        function(){
                            $.ajax({
                                url:servidor+'drt/Formula/guardar',
                                type:'post',
                                data:{idrequerimiento:$('#form_factibilidad input[name=idrequerimiento]').val(),
                                        idusuario: sessionStorage.idusuario
                                        },
                                dataType : 'json',
                                success:function(data){
                                    if(data!=0){
                                    $('#tbl_formulas tbody').append(
                                        '<tr>'+            
                                            '<td>'+(Number($("#tbl_formulas tbody tr").length)+1)+'</td>'+
                                            '<td>'+data.dcreacion+'<input type="hidden" value="'+data.idformula+'"></td>'+
                                            '<td><center><button type="button" class="btn btn-default btn-sm modal-formulacion" data-id="'+data.idreqServicio+'">Detalle formula</button></center></td>'+
                                            '<td><center><button type="button" class="btn btn-default btn-sm modal-analisis" data-id="'+data.idreqServicio+'">Detalle analisis</button></center></td>'+
                                            '<td><center><button type="button" class="btn btn-default btn-sm modal-produccion" data-id="'+data.idreqServicio+'">Detalle produccion</button></center></td>'+
                                            '<td>'+data.estado+'</td>'+                                            
                                        '</tr>'
                                    );
                                    }else{
                                        alertify.error('No se registro la formula');
                                    }
                                }
                            })
                            
                            
                            }
                        , function(){ 
                            
                        });
    
});

//abrir modal formulacion
$(document).off('click','.modal-formulacion');
$(document).on('click','.modal-formulacion',function(e){
    let idreqservicio=$(this).attr('data-id');
    let indexformula=$(this).parent().parent().parent().find('td').eq(0).html();
    let idformula=$(this).parent().parent().parent().find('td').eq(1).find('input').val();
    
    $.ajax({
        url:servidor+'drt/Formula/cargarModal',
        type:'post',
        dataType:'json',
        data:{
            idreqservicio:idreqservicio,
            indexformula:indexformula,
            idformula:idformula,
            areausuario:sessionStorage.codarea
        },
        success:function(data){
            $('#modal-planeamiento').html(data.modal);
            $('#modal-formulacion').modal('show');
            
        }
    });
})

$(document).off('click','#btn-agregar-insumo');
$(document).on('click','#btn-agregar-insumo',function(e){
    $.ajax({
        url:servidor+'drt/Formula/cargarModalInsumo',
        type:'post',
        dataType:'json',
        data:{
            tipoinsumo:'formulacion',
            idformula:$('input[name=idformula]').val()           
        },
        success:function(data){
            $('#agregar-insumo').html(data.modalInsumo);
            $('select').select2({
                placeholder:'Seleccione una opcion'                
            });
            
            $('#form-nuevo-insumo select[name=descripcion]').hide().select2('destroy');
            $('#modal-insumos').modal('show');
        } 
    });
    
});
//cambio de codigo, validar si es producto nuevo o existente y si existe el tipo de cambio en el dia
$(document).off('change','#form-nuevo-insumo select[name=codigo]');
$(document).on('change','#form-nuevo-insumo select[name=codigo]',function(e){
    var codigoinsumo=$(this).val();
    if(codigoinsumo==0){        
        $('#form-nuevo-insumo div.descripcion-variable').show();
        $('#form-nuevo-insumo input:not([type=hidden])').val('');
    }else{       
        $('#form-nuevo-insumo div.descripcion-variable').hide();
        $.ajax({
            url:servidor+'drt/Formula/getDatosInsumo',
            type:'post',
            dataType:'json',
            data:{idinsumo:codigoinsumo},
            success:function(data){ 
                         
                $('#form-nuevo-insumo input[name=descripcion]').val(data.ItemName);
                $('#form-nuevo-insumo input[name=MinOrdrQty]').val(data.MinOrdrQty);
                $('#form-nuevo-insumo input[name=unidadmedida]').val(data.BuyUnitMsr);
                if(data.LastPurCur=='S/'){
                    $('#form-nuevo-insumo input[name=preciounitario]').val(Number(data.LastPurPrc/sessionStorage.cambiodolar).toFixed(6)*1); 
                }else{
                    $('#form-nuevo-insumo input[name=preciounitario]').val(data.LastPurPrc);
                }
                
            }
        });
    }
    
});

$(document).off('click','.btn-eliminar-formulacion');
$(document).on('click','.btn-eliminar-formulacion',function(e){
    let iddetalle=$(this).attr('data-id');
    let tipo=$(this).attr('data-tipo');
    let fila=$(this).parent().parent();
    alertify.confirm('Eliminar Insumo', 'Una vez eliminado no se podra recuperar la informacion', 
                        function(){ 
                            $.ajax({
                                url: servidor+'drt/Formula/eliminarInsumo',
                                type:"post",
                                dataType:"json",                                
                                data:{iddetalle:iddetalle,
                                        idusuario:sessionStorage.idusuario,
                                        tipoinsumo:tipo
                                    },
                                success:function(data){
                                    if(data.resultado>0){
                                        fila.hide();
                                        if(tipo=='formulacion'){
                                            $('#subtotal-formulacion').html(data.ntotal);
                                        }
                                        if(tipo=='empaque'){
                                            $('#subtotal-empaque').html(data.ntotal);
                                        }                                        
                                        alertify.success('Eliminado');
                                    }
                                }
                            });
                         },
                         function(){
                              
                        });
    
});
$(document).off('change','.input-cant-util');
$(document).on('change','.input-cant-util',function(e){
    let iddetalle=$(this).attr('data-id');
    let tipo=$(this).attr('data-tipo');
    let nuevovalor=$(this).val();
    let subtotal=$(this).parent().parent().find('td').eq(8);
    if(nuevovalor>0){
    $.ajax({
        url:servidor+"drt/Formula/modificarInsumo",
        type:"post",
        dataType:"json",
        data:{
            iddetalle:iddetalle,
            nuevovalor:nuevovalor,
            tipoinsumo:tipo
            },
        success:function(data){
              subtotal.html(data.nuevosubtotal);
              if(tipo=='formulacion'){
                $('#subtotal-formulacion').html(data.ntotal);
              }
              if(tipo=='empaque'){
                $('#subtotal-empaque').html(data.ntotal);
              }
        }
    });
    }else{
        alertify.error('Debe indicar una cantidad mayor a "0"');
    }
});
//cambio en cantidad piloto
$(document).on('change','.input-cant-piloto',function(e){
    let iddetalle   =$(this).attr('data-id');
    let tipo        =$(this).attr('data-tipo');
    let nuevovalor  =$(this).val();
    $.ajax({
        url:servidor+'drt/Formula/modificarCantPiloto',
        type:"post",
        dataType:"json",
        data:{
            iddetalle:iddetalle,
            tipo:tipo,
            nuevovalor:nuevovalor
        },
        success:function(data){
            if(tipo=='formulacion'){
                $('#subtotal-piloto-formulacion').html(data.total);
            }
            if(tipo=='empaque'){
                $('#subtotal-piloto-empaque').html(data.total);
            }
        }
    })
});

//insumo material

$(document).off('click','#btn-agregar-insumo_empaque');
$(document).on('click','#btn-agregar-insumo_empaque',function(e){
    $.ajax({
        url:servidor+'drt/Formula/cargarModalInsumo',
        type:'post',
        dataType:'json',
        data:{
            tipoinsumo:'empaque',
            idformula:$('input[name=idformula]').val(),
                       
        },
        success:function(data){
            $('#agregar-insumo').html(data.modalInsumo);
            $('select').select2({
                placeholder:'Seleccione una opcion'                
            });
            
            $('#form-nuevo-insumo select[name=descripcion]').hide().select2('destroy');
            $('#modal-insumos').modal('show');
        } 
    });
    
});

