var row_selected=null;

$(document).off('click','#tbl_requerimientoServicios tbody tr');
$(document).on('click','#tbl_requerimientoServicios tbody tr',function(){
    row_selected=$(this);
    $('#tbl_requerimientoServicios tbody tr').css('background-color','').css('color','black');
    row_selected.css('background-color','#32c5d2').css('color','black');
});


function setearDatos(data){
    var inputs=$('#form_edicion_req_servicio input[data]');
            var textareas=$('#form_edicion_req_servicio textarea[data]');
            var input=null;
            var textarea=null;
            $.each(inputs,function(i,item){
                input=inputs.eq(i);
                input.val(data.requerimiento[input.attr('data')]).prop('readonly',true);
                if(input.attr('data')=='Fecha'){
                    input.val((data.requerimiento[input.attr('data')].split(' '))[0]).prop('readonly',true);
                }
            });

            $.each(textareas,function(i,item){
                textarea=textareas.eq(i);
                textarea.val(data.requerimiento[textarea.attr('data')]).prop('readonly',true);
            });
            if(data.requerimiento.vNombreServicio=='Documentacion'){
                
                let checkboxes='<div class=col-md-6><div class="mt-checkbox-list">';
                    $.each(data.subservicios,function(i,item){
                        checkboxes=checkboxes+'<label class="mt-checkbox mt-checkbox-outline">'+item.vDescripcion+
                                                        '<input type="checkbox" value="'+item.idServicio+'" checked disabled>'+
                                                        '<span></span>'+
                                                    '</label>';
                        
                    });                    
                    checkboxes=checkboxes+'</div></div>';
                    
                    $('#subdetalle_edicion').html(checkboxes);
            }
            else{
                
                $('#subdetalle_edicion').html('');
            }
            $('#form_edicion_req_servicio select[name=preciomoneda]').val(data.requerimiento['cMoneda']).prop('disabled',true);
            $.each(data.requerimiento.vProVentaAnual.split(';'),function(i,item){
                $('#form_edicion_req_servicio input[name="proyeccion['+(i+1)+']"]').val(item).prop('readonly',true);
            });

    if(data.requerimiento.iCajaDuplex==null){
        $('#form_edicion_req_servicio input:checkbox').removeProp('checked');
    }
            
}
//click en ver detalles
$(document).on('click','.ver_detalles',function(e){
    let idregistro=$(this).attr('data-id');
    $('#inputprincipioactivoedicion').html('<input type="text" class="form-control input-sm editable" data="vNombreGranel">');
    $('.seccion-aprobacion').show();
    $('.usuariofirmante').html('');
    $('.fecha_aprobacion').html('');
    $('#editar_req_servicio div.modal-footer button.btn-primary').hide();
    $.ajax({
        url:servidor+'drt/RequerimientoServicio/visualizarRequerimiento',
        type:'post',
        data:{idregistro:idregistro},
        success:function(data){
            data= JSON.parse(data);
            
            //cargar datos al modal
            setearDatos(data);
            //div de adjuntos
            var listaAdjunto=null;
            listaAdjunto='<div class="col-md-12"><div class="list-group">';
            $.each(data.adjuntos,function(i,item){
                listaAdjunto+='<a target="_blank" href="'+servidor+item.vRuta+'" class="list-group-item">'+item.nombreDocumento+'</a>';
            })
            listaAdjunto+='</div></div>';
            $('#form_edicion_req_servicio div.adjuntos').html(listaAdjunto);
            if(data.requerimiento.iAprobacionByDRT!=0){
                $('.detalle_aprobacion').show(); 
                $('#btn_aprobacion_servicio').hide();
                $('.usuariofirmante').html('').html(data.requerimiento.firmante).show();                
                $('.fecha_aprobacion').html('').html(data.requerimiento.dAprobacionDRT).show();
                $('i.glyphicon.glyphicon-info-sign').prop('title',data.requerimiento.tComentario);
            }else{
                
                $('#btn_aprobacion_servicio').show();
                if(sessionStorage.idArea!=8){
                    $('#btn_aprobacion_servicio').prop('disabled',true);
                }
                $('.detalle_aprobacion').hide();              
                
            }
            $('#editar_req_servicio').modal('show');
            
        }
    });

});
//click en bt aprobacion
$(document).on('click','#btn_aprobacion_servicio',function(e){
    $('#modal_aprobacion_servicio').modal('show');
});


//evento de cierre de modal
$('#editar_req_servicio').off('hidden.bs.modal');
$('#editar_req_servicio').on('hidden.bs.modal',function(e){
    $('.editable').prop('readonly',false);
    $('#editar_req_servicio div.modal-footer button.btn-primary').show();
});

//click editar
$(document).off('click','#main_btn_editar');
$(document).on('click','#main_btn_editar',function(e){
    
    if(row_selected!=null){
        let estado=(row_selected.find('td').eq(11).find('span').html());
        if(estado!='Aprobado'){
        let idregistro=row_selected.find('td').eq(0).find('button').attr('data-id');
    
        $('.seccion-aprobacion').hide();
        $('#editar_req_servicio').modal('show');
        
        $.ajax({
            url:servidor+'drt/RequerimientoServicio/visualizarRequerimiento',
            type:'post',
            data:{idregistro:idregistro},
            success:function(data){
                data= JSON.parse(data);
                
                //cargar datos al modal

                if(data.requerimiento.vPrincipioActivo==null){
                    $('#inputprincipioactivoedicion').html('<input type="text" class="form-control input-sm editable" name="nombreprincipioactivo" data="vNombreGranel">');
                }else{
                    $('#inputprincipioactivoedicion').html('<select class="form-control input-sm" name="principioactivo" style="width:100%"></select>'+
                                                    '<input type="hidden" class="form-control input-sm" name="nombreprincipioactivo" >'
                                                    );
                    }
                $('#form_edicion_req_servicio select[name=principioactivo]').select2({
                    placeholder: "Seleccione una opcion",
                    allowClear: true,
                    data:data.principiosactivos
                });
                //setead modal
                $('#form_edicion_req_servicio select[name=principioactivo]').val(data.requerimiento.vPrincipioActivo).trigger('change');
                $('#form_edicion_req_servicio input[name=user_logueado]').val(sessionStorage.idusuario);
                $('#form_edicion_req_servicio input[name=form_menu').val(sessionStorage.formulario);  
                $('#form_edicion_req_servicio input[name=idRegistro').val(idregistro);      
                
                setearDatos(data);
                $('.editable').prop('readonly',false);
                $('#form_edicion_req_servicio select[name=preciomoneda').prop('disabled',false);
                if(sessionStorage.idArea!=40){
                   
                    $('#form_edicion_req_servicio textarea[name=comentariogdv]').attr('readonly',true);
                }
                if(sessionStorage.idArea!=8){
                    $('#form_edicion_req_servicio textarea[name=comentariodrt]').attr('readonly',true);
                }
                
                var listaAdjunto=null;
                listaAdjunto='<div class="col-md-12"><ul class="list-group">';
                $.each(data.adjuntos,function(i,item){
                    listaAdjunto+='<li class="list-group-item"><span class="badge badge-danger"><a class="btn-eliminar-adjunto" data-id="'+item.idregistro+'">Eliminar</a></span><a target="_blank" href="'+servidor+item.vRuta+'">'+item.nombreDocumento+'</a></li>';
                })
                listaAdjunto+='</ul></div>';
                $('#form_edicion_req_servicio div.adjuntos').html(listaAdjunto);

                $('#editar_req_servicio').modal('show');



                $('#editar_req_servicio').modal('show');
            }
        });
        }else{
            alertify.error('El registro ya esta aprobado!');
        }
    }
    else{
        alertify.error('Porfavor!,Seleccionar un registro');
    }
    
});
$(document).off('change','#form_edicion_req_servicio select[name=principioactivo].form-control');
$(document).on('change','#form_edicion_req_servicio select[name=principioactivo].form-control',function(e){
    $('#form_edicion_req_servicio input[name=codigogi]').val($(this).val());
    $('#form_edicion_req_servicio input[name=nombreprincipioactivo]').val($(this).select2('data')[0]['text']);
});
var archivoSeleccionado=null;
$(document).on('click','.btn-eliminar-adjunto',function(e){
    e.preventDefault();
    archivoSeleccionado=$(this).parent().parent();
    var li=$(this).attr('data-id');
    var archivoNombre=$(this).parent().parent().find('a[target=_blank]').text();
    console.log(archivoNombre);
    $('#eliminar_archivo input[name=eliminar_registro]').val(li);
    $('#eliminar_archivo span.referencia').html(archivoNombre);
    $('div.alert-danger').hide();
    $('#eliminar_archivo').modal('show');
 
});
var contador_intento=0;
$(document).off('submit','#formEliminarAdjunto');
$(document).on('submit','#formEliminarAdjunto',function(event){
    event.preventDefault();
    
    $.ajax({
        url:servidor+'RequerimientoServicio/eliminarAdjunto',
        type:'post',
        data:$(this).serialize(),
        success:function(data){
            if(data=='1'){
                archivoSeleccionado.hide();
                $('#eliminar_archivo.modal.in').modal('hide');
                $('#eliminar_archivo.modal-backdrop').hide();
                alertify.success('Eliminado correctamente');

                intentos_delete=0;
            }else{
                contador_intento++;
                if(contador_intento<sessionStorage.intentos){
                    $('.alert.alert-danger').show();
                    console.log(contador_intento);
                    $('.alert.alert-danger').html('<strong>'+contador_intento+'/'+sessionStorage.intentos+'</strong> Intentos,para bloquear pantalla').show();
                    alertify.error('Contraseña errada');
                }else{
                    console.log('Session cerrada');
                    contador_intento=0;
                    $('#btn_bloquear_pantalla').trigger('click');
                }
            }
        }
    });
});

$('#form_edicion_req_servicio').validate({
    rules:{
        nombreproducto:{
            required:true,
            maxlength:100
        },
        principioactivo:{
            required:true
        },
        referente:{
            maxlength:100
        },
        presentacion:{
            maxlength:100,
            required:true
        },
        tipo:{
            maxlength:50
        },
        lotetentativo:{
            required:true,
           digits:true 
        },
        preciotentativo:{
            required:true,
            number: true,
            max: 100000000
        },
        primeranio:{
            required:true,
            number: true,
            
        },
        segundoanio:{
            required:true,
            number: true,        
            
        },
        inversionInicial:{
            required:true,
            number: true,
            max: 100000000
        }
    },
    submitHandler: function(form,e) {
        e.preventDefault();
        var formData=new FormData(form);                
        $.ajax({
            url:servidor+'RequerimientoServicio/guardar',
            type:'post',
            data:formData,            
            cache: true,
            contentType: false,
            processData: false, 
            success:function(data){
                $('.modal.in').modal('hide');
                $('.modal-backdrop').hide();
                alertify.success('Guardado con exito');
                $('a[data-id=41]').trigger('click');
            }
            
        });
    
  }
});

$('#form_detalle_aprobacion').submit(function(e){
    e.preventDefault();
    let idregistro=row_selected.find('td').eq(0).find('button').attr('data-id');
    $.ajax({
        url:servidor+'drt/RequerimientoServicio/aprobacionServicion',
        data:$(this).serialize()+'&idregistro='+idregistro+'&idusuariofirma='+sessionStorage.idusuario,
        type:'post',
        success:function(data){
            alertify.success('Requerimiento aprobado exitosamente!');
            $('a[data-id=41]').trigger('click');
            $('.modal.in').modal('hide');
            $('.modal-backdrop').hide();
            
            
        }        
    });
});