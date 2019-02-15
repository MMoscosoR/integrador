$(document).off('click','#main-btn-editar');

$(document).on('click','#main-btn-editar',function(e){
    e.preventDefault();
    seteardatos();
    $(".presjm").css("display","none");
    $("#mod").addClass("tab-pane fade active in");
    $("#mod-tab").parent().addClass("active");
    let granel=$("#lisPrincipios").val();
    $(".cabecera_data").css('display','none');
    $(".cabecera_data").css('width','100%');
    $(".visualizar").css('display','none');
    $("#periodogi").val("jm");
    $("#versiongi").val(0);
    $("#tipogi").val(1);
    $("#calcularjm").prop("disabled", true);
    $("#titulo_version").val("");
    $("#main-btn-avances").parent().remove();
    $("#main-btn-resumen").parent().remove();
    if(granel!='jm'){
        cargaropciones();
        permisosusuario();
        var tipojm=1;
        $.ajax({
            url : servidor+"gaf/reportecostos/visualizarversiones",
            type:'post',
            data:{'granel':granel,'tipo':tipojm},
            success:function(response){
                let resp=JSON.parse(response);
                let obj=resp.versiones;
                if(resp.respuesta==1){
                    let html='';
                    $(".list-title").text(granel);
                    $.each(obj,function(i,item){
                        html+='<li class="mt-list-item jmlistjm" style="height:80px;" data-ref="'+item.nVersion+'" data-value="'+item.nPeriodo+'">';
                        html+='<div class="list-icon-container done">';
                        html+='</div>';
                        html+='<div class="list-datetime" style="width:350px;"> <input type="checkbox" data-ref="'+item.nVersion+'" value="'+item.idGranel+'" class="make-switch checkjm" '+(parseInt(item.iEstado)==1 ? 'checked' : '')+' data-on-text="ACTIVO" data-off-text="INACTIVO"> </div>';
                        html+='<div class="list-item-content">';
                        html+='    <h3 class="">';
                        html+='        <a href="#">V'+item.nVersion+'- '+item.vTitulo+'</a>';
                        html+='   </h3>';
                        html+='</div>';
                        html+='</li>';

                    });
                                    
                    $('.lista-jm-jm').html(html);
                    
                    $(".jmlistjm").click(function(){
                        var jm=$(this);
                        $('.jmlistjm').css('background-color','').css('color','black');
                        jm.css('background-color','#C0C0C0');
                        var rep=jm.attr("data-value");
                        var rep2=jm.attr("data-ref");
                        
                        $("#periodogi").val(rep);
                        $("#versiongi").val(rep2);
                    });

                    $(".make-switch").bootstrapSwitch();
                    $("#cerrarindicador").text("Cerrar");
                    $('.checkjm').on('switchChange.bootstrapSwitch', function (event, state) {
                        let cab;
                        let estado;
                        let vers;
                        if($(this).is(":checked")){
                            cab=$(this).val();
                            estado=1;
                            vers=$(this).attr("data-ref");
                        }else{
                            cab=$(this).val();
                            estado=0;
                            vers=$(this).attr("data-ref");
                        }
                        $.post( servidor+"gaf/reportecostos/actualizarcabecera", { 'idGranel': cab,'iEstado':estado,'nVersion':vers})
                        .success(function( response ) {
                            
                        });
                    });
                    $("#modal_versiones").modal("show");
                }else{
                    $.ajaxSetup({cache:false});
                    alertify.error('Este principio no tiene versiones creadas');
                }
            }
        });
  

    }else{
        $.ajaxSetup({cache:false});
        alertify.error('Debe escoger un granel');
    }
});

$(document).off('click','#main-btn-guardar');

$("#main-btn-guardar").on("click",function(e){
    e.preventDefault();
    
    alertify.confirm('Estas Seguro?',
    function(){
    let dataf=$("#datafabrica_para_proceso").val();
    let dataa=$("#dataacondicionado_para_proceso").val();
    let datamoi=$("#datamoi").val();
    let datamateriaprima=$("#data_proceso_materiaprima").val();
    let datamateriaempaque=$("#data_proceso_materiaempaque").val();
    let dataotros2=$("#data_proceso_otros2").val();
    let dataotros3=$("#data_proceso_otros3").val();
    let dataotros4=$("#data_proceso_otros4").val();
    let dataotros5=$("#data_proceso_otros5").val();
    let dataotros1=$("#data_proceso_otros1").val();
    let periodo;
    if($("#periodogi").val()!='jm'){
        periodo=(parseInt($("#periodogi").val())+1);
    }else{
        periodo=0;
    }
    let version=$("#versiongi").val();
    $.ajax({
        url: servidor+"gaf/reportecostos/guardardatatotal",
        type:'post',
        data:$(".cabecera_data #form_costos").serialize()+"&cabecera[usuarioCreador]="+sessionStorage.getItem("idusuario")+
        "&datamodf="+dataf+"&datamoda="+dataa+"&datamateriaprima="+datamateriaprima+
        "&datamateriaempaque="+datamateriaempaque+"&datamoi="+datamoi+"&dataotros2="+dataotros2+"&dataotros3="+dataotros3
        +"&dataotros4="+dataotros4+"&dataotros5="+dataotros5+"&dataotros1="+dataotros1+"&periodo="+periodo+"&version="+version,
        
        success:function(response){
            if(parseInt(response)==1){
                $('#modal_reporte_final').modal('hide');
                $('.modal.in').modal('hide');
                $('.modal-backdrop').hide();
                alertify.success('Guardado con exito');
                $('a[data-id=24]').trigger('click');
            }else{
                alertify.error('Hay tablas vacías');
                $.ajaxSetup({cache:false});
            }
        }
    });

    
});

});

$("#aceptar_version").on("click",function(e){
    e.preventDefault();
    
    var rep=$("#periodogi").val();
    var ver=$("#versiongi").val();
    var tip=$("#tipogi").val();

    let granel=$("#lisPrincipios").val();

    if(rep!="jm"){
        
        $.ajax({
            url:servidor+"gaf/reportecostos/getcabecera",
            type:'post',
            data:{'granel':granel,'per':rep,'ver':ver},
            success:function(response){
                var jmjm=JSON.parse(response);
                let comentario=(jmjm.vComentario == null ? "" : jmjm.vComentario);
                let titulojm=(jmjm.vTitulo == null ? "" : jmjm.vTitulo);
                let estadojm=(jmjm.iEstado == null ? "" : jmjm.iEstado);
                $("#comentario_cabe").text(comentario);
                $("#titulo_version").val(titulojm);
                $("#estadogi").val(estadojm);
                var est=$("#estadogi").val();
                $(".statejm").html('<input type="checkbox" class="make-switch form-control panelswitch" '+(est==1 ? 'checked' : '')+' data-on-text="&nbsp;&nbsp;ACTIVO&nbsp;&nbsp;" data-off-text="&nbsp;&nbsp;&nbsp;&nbsp;INACTIVO&nbsp;&nbsp;&nbsp;&nbsp;"></input>');   
                $(".make-switch").bootstrapSwitch();
                $('.panelswitch').on('switchChange.bootstrapSwitch', function (event, state) {
                    var iestado=0;
                    if($(this).is(':checked')){
                        iestado=1;
                    }else{
                        iestado=0;
                    }
                    $("#estadogi").val(iestado);
                });
            }
        });
        
        
        
        $("#modal_versiones").modal("hide");
        $(".cabecera_data").css('display','inline-block');
        $(".cabecera_data").css('width','100%');
        $(".visualizar").css('display','none');
        $("#calcularjm").prop("disabled", false);
        $("#form_costos #idgranel").val(granel);
        let cant=$("#num_cant").val();
        $("#num_cant_cabecera").val(cant);
        $(".novisible").css('display','inline-block');
        $(".novisible").css('width','100%');
        cargarfabricacion(granel,1,rep,ver);
        cargaraacondicionado(granel,1,rep,ver);
        cargarotros1();
        cargarinsumo();
        getotros(granel,1,rep,ver);
        if(tip==2){
            $(".novisible").css('display','none');
            $(".presjm").css("display","inline-block");
            $("#mod").removeClass();
            $("#mod").addClass("tab-pane fade");
            $("#mod-tab").removeClass();
            $("#mod-tab").parent().addClass("");
            $("#main-btn-avances").parent().remove();
            permisosusuario();
        }else{
            $('nav.quick-nav').show();
            let info='<li>';
            info+='<a class="active" id="main-btn-avances">';
            info+='<span>Guardar avances</span>';
            info+='<i class="fa fa-save"></i>';
            info+='</a></li>';
            $("#ulEspeciales").append(info);
            guardaravances();
        }
        
        $("#moi").removeClass();
        $("#moi").addClass("tab-pane fade");
        $("#moi-tab").parent().removeClass();
        $("#moi-tab").parent().addClass("");
        $("#otros").removeClass();
        $("#otros").addClass("tab-pane fade");
        $("#otros-tab").parent().removeClass();
        $("#otros-tab").parent().addClass("");
        $("#materias").removeClass();
        $("#materias").addClass("tab-pane fade");
        $("#materias-tab").parent().removeClass();
        $("#materias-tab").parent().addClass("");                       
    }else{
        $("#calcularjm").prop("disabled", true);
        alertify.error('Seleccione una versión');
    }
});

function seteardatos(){
    localStorage.removeItem("total_materia_empaque_fin");
    localStorage.removeItem("total_materia_prima_fin");
    localStorage.removeItem("total_mod_acon_fin");
    localStorage.removeItem("total_mod_fab_fin");
    localStorage.removeItem("total_moi_acon_fin");
    localStorage.removeItem("total_moi_fab_fin");
    localStorage.removeItem("total_otros2_fin");
    localStorage.removeItem("total_otros3_fin");
    localStorage.removeItem("total_otros4_fin");
    localStorage.removeItem("total_otros5_fin");
    localStorage.removeItem("total_otros1_fin");
}

$("#lisclones").on("change",function(e){
    e.preventDefault();
    let datajm=$(this).val();
    alertify.confirm('Estas Seguro?',
    function(){
            datajm=datajm.split("-");
            if(datajm.length>1){
                let granel=datajm[0];
                let ver=datajm[1];
                let rep=datajm[2];
                cargarfabricacion(granel,1,rep,ver);
                cargaraacondicionado(granel,1,rep,ver);
                cargarotros1();
                cargarinsumo();
                getotros(granel,1,rep,ver);
                alertify.success("Clonado con éxito");
            }else{               
                let granel=$("#lisPrincipios").val();
                cargarfabricacion(granel);
                cargaraacondicionado(granel);
                cargarinsumo();
                getotros();
            }
    },function(){
                   
    });
});
function guardaravances(){

$("#main-btn-avances").on("click",function(e){
    e.preventDefault();
    alertify.confirm('Estas seguro de guardar avance?',function(){
        let dataf=$("#datafabrica_para_proceso").val();
        let dataa=$("#dataacondicionado_para_proceso").val();
        let datamoi=$("#datamoi").val();
        let datamateriaprima=$("#data_proceso_materiaprima").val();
        let datamateriaempaque=$("#data_proceso_materiaempaque").val();
        let dataotros2=$("#data_proceso_otros2").val();
        let dataotros3=$("#data_proceso_otros3").val();
        let dataotros4=$("#data_proceso_otros4").val();
        let dataotros5=$("#data_proceso_otros5").val();
        let dataotros1=$("#data_proceso_otros1").val();
        let periodo;
        if($("#periodogi").val()!='jm'){
            periodo=(parseInt($("#periodogi").val())+1);
        }else{
            periodo=0;
        }
        let version=$("#versiongi").val();
        $.ajax({
            url: servidor+"gaf/reportecostos/guardaravance",
            type:'post',
            data:$(".cabecera_data #form_costos").serialize()+"&cabecera[usuarioCreador]="+sessionStorage.getItem("idusuario")+
            "&datamodf="+dataf+"&datamoda="+dataa+"&datamateriaprima="+datamateriaprima+
            "&datamateriaempaque="+datamateriaempaque+"&datamoi="+datamoi+"&dataotros2="+dataotros2+"&dataotros3="+dataotros3
            +"&dataotros4="+dataotros4+"&dataotros5="+dataotros5+"&dataotros1="+dataotros1+"&periodo="+periodo+"&version="+version,
            
            success:function(response){
                if(parseInt(response)==1){
                    $('.modal.in').modal('hide');
                    $('#modal_reporte_final').modal('hide');
                    alertify.success('Guardado con exito');
                    $('a[data-id=24]').trigger('click');
                }else{
                    alertify.error('Hay tablas vacías');
                    $.ajaxSetup({cache:false});
                }
            }
        });
    },function(){
    });
});

}

$(document).off('click','#main_btn_visualizar');

$(document).on('click','#main_btn_visualizar',function(e){
    e.preventDefault();
    seteardatos();

    let granel=$("#lisPrincipios").val();
    $(".cabecera_data").css('width','100%');
    $(".visualizar").css('display','none');
    $(".cabecera_data").css('display','none');
    $(".cabecera_data").css('width','100%');
    $(".visualizar").css('display','none');
    $("#periodogi").val("jm");
    $("#versiongi").val(0);
    $("#tipogi").val(2);
    $("#calcularjm").prop("disabled", true);
    $("#main-btn-avances").parent().remove();
    $("#main-btn-resumen").parent().remove();
    if(granel!='jm'){
        cargaropciones();
        var tipojm=2;
        $.ajax({
            url : servidor+"gaf/reportecostos/visualizarversiones",
            type:'post',
            data:{'granel':granel,'tipo':tipojm},
            success:function(response){
                let resp=JSON.parse(response);
                let obj=resp.versiones;
                if(resp.respuesta==1){
                    let html='';
                    $(".list-title").text(granel);               
                    $.each(obj,function(i,item){
                        html+='<li class="mt-list-item jmlistjm" data-ref="'+item.nVersion+'" data-value="'+item.nPeriodo+'">';
                        html+='<div class="list-icon-container done">';
                        html+='</div>';
                        html+='<div class="list-datetime" style="width:300px;"> '+item.fechajm+' </div>';
                        html+='<div class="list-item-content">';
                        html+='    <h3 class="">';
                        html+='        <a href="#">V'+item.nVersion+'- '+item.vTitulo+'</a>';
                        html+='   </h3>';
                        html+='</div>';
                        html+='</li>';
                    });
                    $('.lista-jm-jm').html(html);
                    $(".jmlistjm").click(function(){
                        var jm=$(this);
                        $('.jmlistjm').css('background-color','').css('color','black');
                        jm.css('background-color','#C0C0C0');
                        var rep=jm.attr("data-value");
                        var rep2=jm.attr("data-ref");
                        
                        $("#periodogi").val(rep);
                        $("#versiongi").val(rep2);
                    });
                    $("#cerrarindicador").text("Cerrar");
                    $("#modal_versiones").modal("show");
                    
                }else{
                    $.ajaxSetup({cache:false});
                    alertify.error('Este principio no tiene versiones creadas');
                }
            }
        });
  

    }else{
        $.ajaxSetup({cache:false});
        alertify.error('Debe escoger un granel');
    }
});

$("#main-btn-autorizar").on("click",function(e){
    e.preventDefault();
    $("#modal_autorizaciones").modal("show");
});

$("#guardar_autos").on("click",function(e){
    e.preventDefault();
    $.ajax({
        url : servidor+'gaf/reportecostos/guardarautorizaciones',
        type:'post',
        data:$("#form-autorizaciones").serialize()+"&iduser="+sessionStorage.getItem('idusuario')+"&idmenu="+sessionStorage.getItem('menuactual'),
        success:function(response){
            $('#modal_autorizaciones').modal('hide');
            $('.modal.in').modal('hide');
            $('.modal-backdrop').hide();
            alertify.success('Guardado con exito');
            $('a[data-id=24]').trigger('click');
        }
    });
});
var row_selected=null;
function cargardatosnocreados(){
    $.ajax({
        url: servidor + "gaf/reportecostos/RelacionActivos",
        data: {},
        type: "post",
        dataType: "json",
       success: function(data) {
          $('#tbl_granelesnocreados').dataTable({
            "ordering": true,
            "columns": [{title:"Código"},{title:"Nombre"}],
            "data": data,
            destroy: true,
            'order': [
              [0, "asc"]
            ]
          });
    
        }
      });

      $(document.body).on('click', '#tbl_granelesnocreados tbody tr', function(ev) {
        row_selected = $(this);
        $('#tbl_granelesnocreados tbody tr').css('background-color', '').css('color', 'black');
        row_selected.css('background-color', '#95A5A6').css('color', 'black');
      });
}

$("#aceptargranel").on("click",function(e){
    
    if(row_selected!=null){    
        let codgranel = row_selected.find('td').eq(0).html();
        $("#lisPrincipios").val(codgranel);
        $("#lisPrincipios").select2();
        $("#modal_graneles_no_creados").modal("hide");
    }else{
        alertify.error("Debe escoger un principio");
    }
});

$("body").on("click",".infonueva #btn_ver_no_creados",function(e){
    e.preventDefault();
    cargardatosnocreados();

    $("#modal_graneles_no_creados").modal("show");

});