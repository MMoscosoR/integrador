 
    $(document).ready(function(e){
        $.fn.modal.Constructor.prototype.enforceFocus = function() {};
        currentRequest = $.ajax({
            type: "POST",
            dataType : 'json', // data type es la respuesta que recibira del servidor json o html
            url: servidor+"drt/RequerimientoServicio/",
            async: true, // IMPORTANTE PARA ESPERAR Q RESUELVA EL SQL LA CONSULTA. FALSE // SINCRONIZA // TRUE // VA DIRECTO
            beforeSend : function() {
                
            },
            success: function(datos){
              
              oTable = $('#tbl_requerimientoServicios').dataTable({
                                  "stateSave":true,
                                  "ordering":true,
                                  "columns" : datos.columns,
                                  "data" : datos.rows,
                                  'order':[[0,"desc"]]

              });
              
              $('#tbl_requerimientoServicios thead tr').clone(true).appendTo( '#tbl_requerimientoServicios thead' );
                  $('#tbl_requerimientoServicios thead tr:eq(1) th').each( function (i) {
                      
                      if(i!=0){
                      var title = $(this).text();
                      $(this).html( '<input type="text" class="form-control" placeholder="Buscar" />' );

                      $( 'input', this ).on( 'keyup change', function () {
                         
                          if ( oTable.api().columns(i).search() !== this.value ) {
                              oTable
                                    .api().columns(i)
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
          //pintar modal autorizaciones
          $.ajax({
            url:servidor+"drt/Autorizaciones/modalAutorizaciones",
            dataType:"json",
            success:function(data){
                $('#modal-autorizaciones').html(data.modal);
            }
          });

         //declarar el componente modal eliminar documento
        $('#divmodaleliminar').html(confirmacion_eliminar({
            idmodal:'eliminar_archivo',
            idformulario:'formEliminarAdjunto',
            titulo:'Eliminar archivo adjunto',
            campoReferente:'Nombre',
            usuarioLogeado:sessionStorage.idusuario,
            idMenu:sessionStorage.formulario
            }));

          //declarar modal de factibilidad
          $('#factibilidad').html(modal_factibilidad({
                idmodal:'modalFactibilidad',
                titulo:'Factibilidad'
          })) ;
          
          //modal nuevo procesos para produccion
          
          
        $("#input-701").fileinput({
        //uploadUrl:'#',     
        maxFileCount: 5,
        showUpload: false, // hide upload button
        showRemove: true,
        browseOnZoneClick: true,
        //preferIconicPreview: true
        
        
        
    });
        
        if(sessionStorage.idArea!=40){
            
            $('textarea[name=comentariogdv]').prop('readonly',true);
        }
        if(sessionStorage.idArea!=8){
            $('textarea[name=comentariodrt]').prop('readonly',true);
        }
        

        $('select[name=areaSolicitante]').html('<option value="'+sessionStorage.idArea+'">'+sessionStorage.nomarea+'</option>');
        $('select[name=empleado]').html('<option value="'+sessionStorage.idusuario+'">'+sessionStorage.nombreUsuario+'</option>');
        
        $('select[name=cliente]').select2({        
            placeholder:"Seleccionar una opcion",
            allowClear: true,
            ajax: {
                url: servidor+'drt/Cliente/getclientes',
                dataType: 'json',
                delay: 250,
                type: "POST",
                cache: true,
                data: function (term) {
                    return {
                        term: term
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.CardName,
                                id: item.CardCode
                            }
                        })
                    };
                }
            }
        });
        $('select[name=undmedida]').select2({        
            placeholder:"Seleccionar una opcion",
            allowClear: true,
            ajax: {
                url: servidor+'drt/RequerimientoServicio/undMedida',
                dataType: 'json',
                delay: 250,
                type: "POST",
                cache: true,
                data: function (term) {
                    return {
                        term: term
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.vDescripcion,
                                id: item.vDescripcion2
                            }
                        })
                    };
                }
            }
        });

        $('select[name=servicio]').select2({        
            placeholder:"Seleccionar una opcion",
            allowClear: true,
            ajax: {
                url: servidor+'drt/RequerimientoServicio/getServicios',
                dataType: 'json',
                delay: 250,
                type: "POST",
                cache: true,
                data: function (term) {
                    return {
                        term: term
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.vDescripcion,
                                id: item.idServicio
                            }
                        })
                    };
                }
            }
        });
        $('select[name=formafarmaceutica]').select2({        
            placeholder:"Seleccionar una opcion",
            allowClear: true,
            ajax: {
                url: servidor+'drt/RequerimientoServicio/formas_farmaceuticas',
                dataType: 'json',
                delay: 250,
                type: "POST",
                cache: true,
                data: function (term) {
                    return {
                        term: term
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.vDescripcion1,
                                id: item.idFormaFarma
                            }
                        })
                    };
                }
            }
        });
        $('select[name=materialempaque]').select2({        
            placeholder:"Seleccionar una opcion",
            allowClear: true,            
            ajax: {
                url: servidor+'drt/RequerimientoServicio/material_empaque',
                dataType: 'json',
                delay: 250,
                type: "POST",
                cache: true,
                data: function (term) {
                    return {
                        term: term
                    };
                },
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: item.vDescripcion,
                                id: item.idMaterial
                            }
                        })
                    };
                }
            }
        });
        /*
        var data = {
                        id: 8,
                        text: 'dsfsdgsdg'
                    };

                    var newOption = new Option(data.text, data.id, false, false);
                    $('select[name=materialempaque]').append(newOption).trigger('change');
        
        */
    });
    $(document).off('click','#main_btn_nuevo');
    $(document).on('click','#main_btn_nuevo',function(e){
        e.preventDefault();
        $('#nuevo_req_servicio h4.modal-title').html('Nuevo requerimiento de servicio');
        $('#nuevo_req_servicio').modal('show');
        $('input[name=user_logueado]').val(sessionStorage.idusuario);
        $('input[name=form_menu').val(sessionStorage.formulario);        
        $('input[name=fecha]').val(fechaHoy());
        $.ajax({
            url:servidor+'drt/RequerimientoServicio/correlativo',
            type:'post',
            data:{idformulario:sessionStorage.formulario},
            success:function(data){
                $('input[name=nrorequerimiento]').val(data).prop('disabled',true);
            },
            error:function(){
                alertify.error('No se genero el correlativo, porfavor recargar la pagina');
            }
        });
    });


    $(document).off('change','#form_req_servicio select[name=cliente].form-control');
    $(document).on('change','#form_req_servicio select[name=cliente].form-control',function(e){
        
        $.ajax({
            url:servidor+'drt/Cliente/datos',
            dataType:'json',
            type:'post',
            data:{idcliente:$(this).val()},
            success:function(data){
                $('#form_req_servicio div.datos-generales input').prop('readonly',false).val('');
                if(data.CntctPrsn!=null){
                    $('#form_req_servicio input[name=contacto]').val(data.CntctPrsn).prop('readonly',true);
                }
                if(data.E_Mail!=null){
                    $('#form_req_servicio input[name=email]').val(data.E_Mail).prop('readonly',true);
                }
                if(data.Phone1!=null){
                    $(' #form_req_servicio input[name=telefono]').val(data.Phone1).prop('readonly',true);
                }
               
                
            }
        });
    });

    $(document).off('change','select[name=servicio].form-control');
    $(document).on('change','select[name=servicio].form-control',function(e){
        
        $('input:hidden[name=nombreServicio]').val($(this).select2('data')[0]['text']);
        $.ajax({
            url:servidor+'drt/RequerimientoServicio/subservicios',
            dataType:'json',
            type:'post',
            data:{idservicio:$(this).val()},
            success:function(data){
                if(data=='otros'){
                    $('#subdetalle').html('<label class="col-md-2 control-label">Nombre Servicio:</label>'+
                                            '<div class="col-md-4">'+
                                            '<input type="text" class="form-control input-sm" name="nombreServicio">'+
                                            '</div> ');
                }
                else if( (JSON.stringify(data)).substr(0,1)=='['){
                    let checkboxes='<div class=col-md-6><div class="mt-checkbox-list">';
                    $.each(data,function(i,item){
                        checkboxes=checkboxes+'<label class="mt-checkbox mt-checkbox-outline">'+item.vDescripcion+
                                                        '<input type="checkbox" value="'+item.idServicio+'" name="detalleServicio[]" checked>'+
                                                        '<span></span>'+
                                                    '</label>';
                        
                    });
                    checkboxes=checkboxes+'</div></div>';
                    $('#subdetalle').html(checkboxes);
                    

                }
                else{
                    $('#subdetalle').html('');
                }      
                
            }
        });
        $('input[name=codigogi]').val('');

        $.ajax({
            url:servidor+'drt/RequerimientoServicio/buscar_servicio',
            dataType:'json',
            type:'post',
            data:{idservicio:$(this).val()},
            success:function(data){
                if(data.fOtros=='n'){
                    $('#inputprincipioactivo').html('<input type="text" class="form-control input-sm" name="nombreprincipioactivo">');
                }else{
                    $('#inputprincipioactivo').html('<select class="form-control input-sm" name="principioactivo"></select>'+
                                                    '<input type="hidden" class="form-control input-sm" name="nombreprincipioactivo">'
                                                    );
                    
                    $('select[name=principioactivo]').select2({        
                        placeholder:"Escojer un Servicio",
                        ajax: {
                            url: servidor+'drt/RequerimientoServicio/principios_activos',
                            dataType: 'json',
                            delay: 250,
                            type: "POST",
                            cache: true,
                            data: function (term) {
                                return {
                                    term: term
                                };
                            },
                            processResults: function (data) {
                                return {
                                    results: $.map(data, function (item) {
                                        return {
                                            text: item.ItemName,
                                            id: item.ItemCode
                                        }
                                    })
                                };
                            }
                        }
                    });
                }
            }
        });
    });

    $(document).off('change','#form_req_servicio select[name=principioactivo].form-control');
    $(document).on('change','#form_req_servicio select[name=principioactivo].form-control',function(e){
        $('#form_req_servicio input[name=codigogi]').val($(this).val());
        $('#form_req_servicio input[name=nombreprincipioactivo]').val($(this).select2('data')[0]['text']);
    });
    $(document).off('change','select[name=materialempaque]');
    $(document).on('change','select[name=materialempaque]',function(){
        
        
    });
    

    $('#form_req_servicio').validate({
        rules:{
            fecha:{
                required:true,
                dateISO: true
            },
            cliente:{
                required:true
            },
            contacto:{
                maxlength:50,
            },
            telefono:{                
                maxlength:15,
                
            },
            email:{
                email: true,
                maxlength:50
            },
            servicio:{
                required:true
            },
            nombreServicio:{
                required:true
            },
            detalleServicio:{
                required:true
            },
            detalleServicio:{
                required:true
            },
            nombreproducto:{
                required:true,
                maxlength:100
            },
            referente:{
                maxlength:100
            },
            principioactivo:{
                required:true
            },
            presentacion:{
                maxlength:100,
                required:true
            },
            formafarmaceutica:{
                required:true                
            },
            tipo:{
                maxlength:50
            },
            materialempaque:{
                required:true
            },
            empaqueotros:{
                maxlength:50
            },
            lotetentativo:{
                required:true,
               digits:true 
            },
            undmedida:{
                required:true,
                
            },
            primeranio:{
                required:true,
                number: true,
                
            },
            preciotentativo:{
                required:true,
                number: true,
                max: 100000000
            },
            "proyeccion[1]":{
                required:true,
                number: true,
                                
            },
            "proyeccion[2]":{
                required:true,
                number: true,
                                
            },
            "proyeccion[3]":{
                required:true,
                number: true,
                                
            },
            "proyeccion[4]":{
                required:true,
                number: true,
                                
            },
            "proyeccion[5]":{
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
                    url:servidor+'drt/RequerimientoServicio/guardar',
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
            
          },
        invalidHandler: function(event, validator) {
            //event.preventDefault();
            //alertify.error('Por favor!,Verifique los datos ingresados');
        }

        
    });

    $(document).on('hidden.bs.modal','div.modal',function(){
            $(this).find('input').val('');
            $(this).find('.select2-selection__clear').trigger('click');
            $(this).find('.select2-selection__rendered').html('<span class="select2-selection__placeholder">Seleccionar una opcion</span>');
    });