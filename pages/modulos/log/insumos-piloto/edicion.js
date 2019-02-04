var row_selected=null;

$(document).off('click','#tbl_solitudmuestras tbody tr');
$(document).on('click','#tbl_solitudmuestras tbody tr',function(){
    row_selected=$(this);
    $('#tbl_solitudmuestras tbody tr').css('background-color','').css('color','black');
    row_selected.css('background-color','#32c5d2').css('color','black');
});


function pasarDatos(data){

    $.each(data[0],function(i,item){
        $('#'+i+'').val(item);
      
    });
            
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
        url:servidor+'muestraspiloto/visualizarpiloto',
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
            $('#form_edicion_insumo_piloto div.adjuntos').html(listaAdjunto);
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
        let codigojm=row_selected.children('td').eq(0).text();

        $('.seccion-aprobacion').hide();
        $('#editar_insumo_pedido').modal('show');
        
        $.ajax({
            url:servidor+'log/muestraspiloto/visualizarPiloto',
            type:'post',
            data:{codigojm:codigojm},
            success:function(data){
                data= JSON.parse(data);
                
                pasarDatos(data);
              
              

                $('#editar_insumo_pedido').modal('show');


            }
        });
        
    }
    else{
        alertify.error('Porfavor!,Seleccionar un registro');
    }
    
});


$('#form_edicion_insumo_piloto').validate({
    rules:{
        nomInsumo:{
            required:true,
            maxlength:100
        },
        preInsumo:{
            required:true,
            number: true,
            max: 100000000
        },
        moninsumo:{
            required:true,
            maxlength:10
            
        },
        segundoanio:{
            required:true,
            number: true,        
            
        },
        unimedInsumo:{
            required:true,
            maxlength:10
        },
        uniordInsumo:{
            required:true,
            number: true,
            max: 100000000
        }
    },
    submitHandler: function(form,e) {
        e.preventDefault();
        //var formData=new FormData(form);                
        $.ajax({
            url:servidor+'log/muestraspiloto/guardar',
            type:'post',
            data:$("#form_edicion_insumo_piloto").serialize()+"&dolar="+sessionStorage.cambiodolar,            
            cache: true,
            success:function(data){
                $('.modal.in').modal('hide');
                $('.modal-backdrop').hide();
                alertify.success('Guardado con exito');
                $('a[data-id=46]').trigger('click');
            }
            
        });
    
  }
});

$('#form_detalle_aprobacion').submit(function(e){
    e.preventDefault();
    let idregistro=row_selected.find('td').eq(0).find('button').attr('data-id');
    $.ajax({
        url:servidor+'RequerimientoServicio/aprobacionServicion',
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