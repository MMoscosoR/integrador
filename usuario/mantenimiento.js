var row_selected=null;
        $(document).ready(function (e) {
           
            currentRequest = $.ajax({
				  type: "POST",
				  dataType : 'json', // data type es la respuesta que recibira del servidor json o html
				  url: servidor+"sis/Usuario/lista_usuarios",
				  async: true, // IMPORTANTE PARA ESPERAR Q RESUELVA EL SQL LA CONSULTA. FALSE // SINCRONIZA // TRUE // VA DIRECTO
				  beforeSend : function() {
				  	
				  },
				  success: function(datos){
                    
					oTable = $('#tbl_usuarios').dataTable({
                                        "stateSave":true,
										"ordering":true,
										"columns" : datos.columns,
										"data" : datos.rows
										

                    });
                    
                    $('#tbl_usuarios thead tr').clone(true).appendTo( '#tbl_usuarios thead' );
                        $('#tbl_usuarios thead tr:eq(1) th').each( function (i) {
                            
                            if(i!=0){
                            var title = $(this).text();
                            $(this).html( '<input type="text" class="form-control" placeholder="Buscar" />' );

                            $( 'input', this ).on( 'keyup change', function () {
                                if ( oTable.column(i).search() !== this.value ) {
                                    oTable
                                        .column(i)
                                        .search( this.value )
                                        .draw();
                                }
                            } );
                            }
                            else{
                                $(this).html('').removeClass('sorting_asc');
                            }
                        } );
 
                  }
                });
               
                $.ajax({
                    url:servidor+'sis/Area/lista_areas',
                    type:"post",
                    success:function(data){
                        let areas=JSON.parse(data);
                        $('select[name=IdArea]').find('option:not(:first)').remove();
                        $.each(areas,function(i,item){
                            $('select[name=IdArea]').append('<option value="'+item.IdArea+'">'+item.CCodArea+' - '+item.VNombreArea+'</option>');
                        });

                        $('select[name="user_utorizaciones[]"]').find('option').remove();
                        $.each(areas,function(i,item){
                            $('select[name="user_utorizaciones[]"]').append('<option value="'+item.IdArea+'">'+item.CCodArea+'</option>');
                        });
                    }
                });
                
                $.ajax({
                    url:servidor+'sis/Usuario/lista_usuarios_json',
                    type:"post",
                    success:function(datos){
                        let usuarios_json=JSON.parse(datos);
                        $('select[name=sel_clon]').find('option:not(:first)').remove();
                        $.each(usuarios_json,function(i,item){
                            $('select[name=sel_clon]').append('<option value="'+item.IdUsuario+'">'+item.VNombreUsuario+'</option>');
                        });
                    }
                });
                
                
                $('#autorizacionselect2').select2({
                    placeholder: "Selecciones una o mas areas"
                });
                
                
        });
            //click en el boton de ver detalles
            $(document).off('click','.ver_detalles');
            $(document).on('click','.ver_detalles',function(ev){
                $('#modal_detalle_usuario').modal('show');
                $('#modal_detalle_usuario .modal-title').text('Vizualizar detalles');

                    $.ajax({
                        url:servidor+'sis/menu',
                        type: "post",
                        data:{idusuario:$(this).attr('data-id')},
                        success:function(data){
                            let datos=JSON.parse(data);
                            $.each(datos,function(i,valor){
                                if(i=='menu'){
                                    menu=valor;
                                }
                            });
                            
                            let cuerpo=armar_tabla_accesos(menu);
                            $('#modal_tbl_permiso tbody').html(cuerpo); 
                            $('#modal_tbl_permiso').DataTable({
                                scrollY:        '50vh',
                                scrollCollapse: true,
                                paging:         false
                            });
                        },
                        complete: function(){
                            $('form input:text').prop('disabled',true);
                            $('form input:password').prop('disabled',true);                             
                            $('form select').prop('disabled',true);
                            $(":checkbox").prop('disabled', true );                            
                            $('#btn_form_guardar').hide();
                            }
                    });
                    buscar_usuario($(this).attr('data-id'));                    
                
            });
            
            //click en el boton nuevo
            $(document).off('click','#main_btn_nuevo'); 
            $(document).on('click','#main_btn_nuevo',function(e){
                e.preventDefault();
                
                $('#modal_detalle_usuario').modal('show');
                $('#modal_detalle_usuario .modal-title').text('Nuevo Usuario');
                $('input[name=user_logueado]').val(sessionStorage.idusuario);
                $('input[name=form_menu').val(sessionStorage.formulario);                
                $('input[name="VDni"]').rules('add', {
                    required:true,
                    rangelength:[8,8],
                    digits:true,
                    remote:{
                        url: servidor+'sis/Usuario/validar_dni_unico',
                        type: "post",
                        data:{
                            accion:$('form input[name=IdUsuario]').val()
                        }                                                         
                    }
                });
                
                $.ajax({
                        url:servidor+'sis/menu',
                        type: "post",
                        data:{idusuario:500000},
                        success:function(data){
                            let datos=JSON.parse(data);
                            $.each(datos,function(i,valor){
                                if(i=='menu'){
                                    menu=valor;
                                }
                            });
                            
                            let cuerpo=armar_tabla_accesos(menu);
                            $('#modal_tbl_permiso tbody').html(cuerpo); 
                            $('#modal_tbl_permiso').DataTable({
                                scrollY:        '50vh',
                                scrollCollapse: true,
                                paging:         false
                            });
                        }
                        
                    });
            });
            //cambio dni
            $(document).off('change','input[name=VDni]');
            $(document).on('change','input[name=VDni]',function(e){
                $.ajax({
                    url:servidor+'sis/Usuario/buscar_por_dni',
                    type:"post",
                    data:{dni:$(this).val()},
                    success:function(data){
                        if(data!='null'){
                        let user_planilla=JSON.parse(data);
                            
                            $('input[name=VUsuarioApePat]').val(user_planilla.APEPAT);
                            $('input[name=VUsuarioApeMat]').val(user_planilla.APEMAT);
                            $('input[name=VNombreUsuario]').val(user_planilla.NOMBRE); 
                            let nombres=(user_planilla.NOMBRE).split(' ');                         
                            $('input[name=VUsuarioNombres]').val(nombres[0]+' '+user_planilla.APEPAT);                            
                            $('input[name=VCodUsuario]').val(nombres[0]+'.'+user_planilla.APEPAT);
                            $('input[name=VCargo]').val(user_planilla.CARGO);
                            $('input[name=VTelefono]').val(user_planilla.TELEFONO);
                            $('input[name=VEmail]').val((nombres[0]+'.'+user_planilla.APEPAT+'@induquimica.com.pe').toLowerCase());
                            $('input[name=DFechaInicio]').val(user_planilla.FECHAING);
                            $('input[name=DFechaCese]').val(user_planilla.FECHATERMINO);
                            $('select[name=NEstado]').val(1);
                        }else{
                            //alert('No se encontro a nadie con ese dni');
                        }
                            
                    }
                });
            });
            //cuando se elija usuario en clonar se oculte la grilla
            $(document).on('change','select[name=sel_clon]',function(data){
                let valor=$(this).val();
                if(valor!=''){
                    $('.tabla_relacion_permisos').hide();
                }
                else{
                    $('.tabla_relacion_permisos').show()
                }
            });

            //seleccion de fila
            
            $(document).off('click','#tbl_usuarios tbody tr');
            $(document).on('click','#tbl_usuarios tbody tr',function(){
                row_selected=$(this);
                $('#tbl_usuarios tbody tr').css('background-color','').css('color','black');
                row_selected.css('background-color','#32c5d2').css('color','black');
                
                
            });

            //cick en el boton editar
            $(document).off('click','#main_btn_editar'); 
            $(document).on('click','#main_btn_editar',function(e){
                if(row_selected!=null){

                    $('#modal_detalle_usuario').modal('show');
                    $('#modal_detalle_usuario .modal-title').text('Editar Usuario');
                    $('input[name=user_logueado]').val(sessionStorage.idusuario);
                    $('input[name=form_menu').val(sessionStorage.formulario);
                    
                    let idusuario= row_selected.find('td').eq(1).html();

                    $( 'input[name="VDni"]' ).rules( "remove" );
                    $('input[name="VDni"]').rules('add', {
                        required:true,
                        rangelength:[8,8],
                        digits:true                        
                    });
                    $.ajax({
                            url:servidor+'sis/menu',
                            type: "post",
                            data:{idusuario:idusuario},
                            beforeSend:function(){
                                $('#btn_form_guardar').prop('disabled',true);
                            },
                            success:function(data){
                                $('input[name=idusuario]').val(idusuario);
                                let datos=JSON.parse(data);
                                $.each(datos,function(i,valor){
                                    if(i=='menu'){
                                        menu=valor;
                                    }
                                });
                                
                                let cuerpo=armar_tabla_accesos(menu);
                                $('#modal_tbl_permiso tbody').html(cuerpo); 
                                $('#modal_tbl_permiso').DataTable({
                                    scrollY:        '50vh',
                                    scrollCollapse: true,
                                    paging:         false
                                });
                            },
                            complete:function(){
                                $('input[name=VDni]').prop('readonly',true);
                                $('#btn_form_guardar').prop('disabled',false);
                            }
                        }); 
                        buscar_usuario(idusuario);
                }else{
                    alertify.error('Seleccione un registro porfavor');
                }
            });
        
            
            //control de checkboxes
            $(document).off('click','input:checkbox');
            $(document).on('click','input:checkbox',function(e){
                    var check_checked=$(this);
                    let valclass=check_checked.attr('class');
                    

                    if(check_checked.hasClass('col')){
                        $('.'+valclass.substr(4,1)).prop('checked', $(this).prop("checked"));
                        if(valclass=='col t'){
                            $(":checkbox").prop('checked', $(this).prop("checked"));
                        }
                    }
                    if(valclass.substr(0,3)=='row'){
                        //alert(valclass.substr(6));
                        $('.id'+valclass.substr(6)).prop('checked', $(this).prop("checked"));
                    }
                    

                });
            //acciones realizadas cuando se cierra el modal
            $('#modal_detalle_usuario').on('hidden.bs.modal', function (e) {               
                $('#modal_tbl_permiso').dataTable().fnDestroy();
                $('form input:text').prop('disabled',false).val('');
                $('form input:password').prop('disabled',false).val('');                             
                $('form select').prop('disabled',false).val('');
                $(":checkbox").prop('disabled', false ).val('');                            
                $('#btn_form_guardar').show();
                $('input[name=VDni]').prop('readonly',false);
                $('label.error').hide();
                $('.tabla_relacion_permisos').show();
                $('form input[name=IdUsuario]').val('');
                $('form select[name="user_utorizaciones[]"]').val(null).trigger('change.select2');
               
            })

            //validar y enviar formulario  



                $('#form_modal_usuario').validate({                    
                    rules:{
                       
                        VUsuarioApePat:{
                            required:true,
                            rangelength:[1,50]
                        },
                        VUsuarioApeMat:{
                            required:true,
                            rangelength:[1,50]
                        },
                        VNombreUsuario:{
                            required:true,
                            rangelength:[1,50]
                        },
                        VUsuarioNombres:{
                            required:true,
                            rangelength:[1,50]
                        },
                        VCodUsuario:{
                            required:true,
                            rangelength:[1,50]
                        },
                        VPwdUsuario:{
                            required:true,
                            rangelength:[7,20]
                        },
                        IdArea:{
                            required:true
                        },
                        VCargo:{
                            required:true,
                            rangelength:[1,50]
                        },
                        VTelefono:{
                            required:true,
                            rangelength:[5,15],
                            digits:true
                        },
                        VEmail:{
                            required:true,
                            email: true,
                            rangelength:[5,50]
                        },
                        DFechaInicio:{
                            required:true,
                            rangelength:[5,20]
                        },
                        DFechaCese:{
                            required:true,
                            rangelength:[5,20]
                        },
                        NEstado:{
                            required:true
                        }

                    },                                                          
                    submitHandler: function(form,e) {
                            e.preventDefault();
                            $.ajax({
                                url:servidor+'sis/Usuario/guardar_usuario',
                                type:"post",
                                data:$('#form_modal_usuario').serialize(),
                                beforeSend:function(){

                                },
                                success:function(data){
                                    if(data==1){
                                        $('.modal.in').modal('hide');
                                        $('.modal-backdrop').hide();
                                        alertify.success('Guardado con exito');
                                        $('a[data-id=36]').trigger('click');

 
                                    }else{
                                        alertify.error('Error, porfavor vuelva a intentarlo');
                                    }
                                    
                                },
                                error:function(){
                                    alertify.error('Ups,Error con el servidor');
                                }
                            });
                        
                      },
                    invalidHandler: function(event, validator) {
                        //alertify.waring('Por favor!,Verifique los datos ingresados');
                    }

                });
    var intentos_delete=0;
    $(document).off('click','#main_btn_eliminar');
    $(document).on('click','#main_btn_eliminar',function(e){
        if(row_selected!=null){
            let idusuario= row_selected.find('td').eq(1).html();
            $('.m--font-danger').html(idusuario);            
            //limpiar inputs
            $('label.error').hide();
            $('#form_eliminar input').val('');
            $('textarea[name=txtmotivo]').val('');
            $('#modal_eliminar_usuario').modal('show');
            $('.alert.alert-danger').hide();
            $('#btn_conf_eliminar').prop('disabled',false);
            intentos_delete=0;
            //set values
            $('input[name=eliminar_user_logueado]').val(sessionStorage.idusuario);
            $('input[name=eliminar_form_menu').val(sessionStorage.formulario);
            $('input[name=eliminar_IdUsuario').val(idusuario);

            
        }
        else{
            alertify.error('Seleccione un registro primero');
        }
    });

    //formulario delete
    
    $('#form_eliminar').validate({
        rules:{
            txtpass:{
                required:true,
                rangelength:[7,20]                
            },
            txtmotivo:{
                required:true,
                rangelength:[1,250],
            }
        },
        submitHandler: function(form,e) {
            e.preventDefault();
            $.ajax({
                url:servidor+'sis/Usuario/eliminar',
                type:"post",
                data:$('#form_eliminar').serialize(),
                beforeSend:function(){
                },
                success:function(data){
                    if(data==1){

                        $('.modal.in').modal('hide');
                        $('.modal-backdrop').hide();
                        alertify.success('Eliminado correctamente');
                        $('a[data-id=36]').trigger('click');
                        intentos_delete=0;

                    }else{
                        intentos_delete++;
                        //cambiar por variable de sesion intentos
                        if(intentos_delete<sessionStorage.intentos){
                            $('.alert.alert-danger').show();
                            console.log(intentos_delete);
                            $('.alert.alert-danger').html('<strong>'+intentos_delete+'/'+sessionStorage.intentos+'</strong> Intentos,para bloquear pantalla');
                            alertify.error('Contraseña cerrada');
                        }else{
                            console.log('Session cerrada');
                            $('#btn_conf_eliminar').prop('disabled',true);
                            $('#btn_bloquear_pantalla').trigger('click');
                        }
                        
                    }
                    
                },
                error:function(){
                    alertify.error('Ups,Error con el servidor');
                }
            });
        
      }

    });

     //test
     $(document).off('click','#btn_autorizaciones');
     $(document).on('click','#btn_autorizaciones',function(e){
         if(row_selected!=null){
             let botones=$('#modal-test button.test');
             botones.prop('disabled',true);
             botones.removeClass('green');
             botones.addClass('default');
            let idusuario= row_selected.find('td').eq(1).html();
            $.ajax({
                url:servidor+'sis/Usuario/get_autorizaciones',
                type:"post",
                data:{idusuario:idusuario},
                success:function(data){

                    let autorizacion=JSON.parse(data);
                    $.each(autorizacion,function(i,item){

                        $.each(botones,function(j,buton){
                            console.log(botones.eq(j).attr('data-name'));
                            if(botones.eq(j).attr('data-name')==item.idArea){
                                botones.eq(j).removeClass('default');
                                botones.eq(j).addClass('green');
                                botones.eq(j).prop('disabled',false);
                            }
                        });
                    });

                }
            });
            $('#modal-test').modal('show');
         }else{
            alertify.error('Seleccionar un registro');
         }
        
     });

            
            
            


            