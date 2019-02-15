$(document).ready(function(){
    $.ajaxSetup({cache:false});
    $("#calcularjm").prop("disabled", true);
    $(".make-switch").bootstrapSwitch();
 
    cargarautorizaciones();
    ocultarbotones();
    var datausuarios='';
    var dataautorizaciones='';

    function ocultarbotones(){
        $(".visualizar_52_1").hide();
        $(".visualizar_52_2").hide();
        $(".visualizar_52_3").hide();
        $(".visualizar_52_4").hide();
        $(".visualizar_52_5").hide();
        $(".visualizar_52_6").hide();
        $(".visualizar_52_7").hide();
        $(".visualizar_52_8").hide();
        $(".visualizar_52_9").hide();
        $(".visualizar_52_10jm").hide();
        $(".visualizar_52_11").hide();
    }

    if(sessionStorage.getItem('autorizado')==1){
        $(".accionjm").html('<button type="button" class="btn red btn-outline" id="autorizacionjm">Autorizaciones</button>');
    }

    if(sessionStorage.getItem('idusuario')!=24){
        let info='<button class="btn btn-success" type="button" title="Principios faltantes" id="btn_ver_no_creados"><i class="icon-eye"></i></button>';
        $(".infonueva").html(info);
    }

    datausuarios= $.ajax({
        url:servidor+"gaf/reportecostos/getusuarios",
        dataType:"json",
        async:false,   
        success:function(data){
            
        }
    }).responseJSON; 


    dataautorizaciones= $.ajax({
        url:servidor+"gaf/reportecostos/getautorizados",
        type:'post',
        dataType:"json",
        async:false,   
        data:{'idmenu':sessionStorage.getItem("menuactual")},
        success:function(response){
        }
    }).responseJSON;    
      
    function cargarautorizaciones(){
        let html='';
        $.ajax({
            url: servidor+"gaf/reportecostos/cargarautorizaciones",
            type:'post',
            data:{'idmenu':sessionStorage.getItem("menuactual")},
            success:function(response){
                let obj=JSON.parse(response);
                $.each(obj,function(i,item){
                    html+='<div class="form-group">';
                    html+='<label class="col-md-4 control-label">'+item.vAccion+'</label>';
                    html+='<div class="col-md-8">';

                    html+='<select class="form-control usuarios_aut" name="usuarios['+item.idmenuaccion+'][]" style="width:100%;" multiple>';
                    $.each(datausuarios,function(ijm,itemjm){
                        html+='<option  '+inarray(item.idmenuaccion,itemjm.IdUsuario)+' value="'+itemjm.IdUsuario+'">'+itemjm.vUsuario+'</option>';
                    });
                    html+='</select>';
                    html+='</div>';
                    html+='</div>';
                });
                $(".body_aut").html(html);
                $(".usuarios_aut").select2();
            }
        });
    }

    function inarray(v1,v2){
        let sel;
        $.each(dataautorizaciones,function(i,item){
            if(parseInt(item.idmenuaccion)==parseInt(v1) && parseInt(item.idUsuario)==parseInt(v2)){
                sel='selected';
            }
        });

        return sel;
    }
    

    
    $.ajax({
        url : servidor+'/gaf/reportecostos/getactivos',
        type:'post',
        data:{},
        success:function(response){
            var obj_A=JSON.parse(response);
            var obj=obj_A.activos;
            var html='<option value="jm">Seleccione granel</option>';
            $.each(obj,function(i,item){
                let dis;
                if(sessionStorage.getItem('idusuario')==24){
                    dis=(item.dis==0)?'disabled="disabled"':'';
                }else{
                    dis='';
                }
                html += '<option class="14jm" '+dis+' value="'+item.ItemCode+'">'+item.ItemCode+' - '+item.ItemName+' <i class="fa fa-save"></i> </option>';
            });
            
            localStorage.setItem("procesos",JSON.stringify(obj_A.procesos));
            localStorage.setItem("ratios_fabricacion",JSON.stringify(obj_A.ratios_fab));
            localStorage.setItem("ratios_acondicionado",JSON.stringify(obj_A.ratios_acon));
            localStorage.setItem("ratios_moi_fab",JSON.stringify(obj_A.ratios_moi_fab));
            localStorage.setItem("ratios_moi_acon",JSON.stringify(obj_A.ratios_moi_acon));
            localStorage.setItem("ratios_moi_pp",JSON.stringify(obj_A.ratios_moi_pp));
            localStorage.setItem("ratios_moi_pt",JSON.stringify(obj_A.ratios_moi_pt));
            localStorage.setItem("ratios_moi_mp",JSON.stringify(obj_A.ratios_moi_mp));
            localStorage.setItem("depreciacion",JSON.stringify(obj_A.depreciacion));
            $("#lisPrincipios").html(html);
            
            //$(".14jm").prop("disabled", true);
        }


    });
    
});

$("#lisPrincipios").select2();

function permisosusuario(){
    $.ajax({
        url: servidor + "gaf/reportecostos/getautorizaciones",
        type:'post',
        data:{'iduser':sessionStorage.getItem('idusuario'),'idmenu':sessionStorage.getItem('menuactual')},
        success:function(response){
            let obj=JSON.parse(response);
            $.each(obj,function(i,item){
                if(item.vClass=='visualizar_52_11'){
                    $('nav.quick-nav').show();
                    let info='<li>';
                    info+='<a class="active" id="main-btn-resumen">';
                    info+='<span>Generar resumen</span>';
                    info+='<i class="fa fa-sticky-note"></i>';
                    info+='</a></li>';
                    $("#ulEspeciales").append(info);
                    generarresumen();
                }
                $("."+item.vClass+"").show();
            });          
        }
    });
}


$("#lisPrincipios").change(function(e){
    e.preventDefault();
    seteardatos();
    $("#calcularjm").prop("disabled", true);
    $("#main-btn-avances").parent().remove();
    if($(this).val()!="jm"){
        $.ajax({
            url:servidor+'gaf/reportecostos/getdatacabecera',
            type:'post',
            cache:false,
            data:{'idprin':$(this).val()},
            success:function(response){
                let obj=JSON.parse(response);
                let data=obj.cabecera;
                let info=obj.info;
                if(obj){
                    if(data.idFormaFarma==4 || data.idFormaFarma==5 || data.idFormaFarma==10){
                        $("#num_cant").prop("disabled", false);
                    }else{
                        $("#num_cant").prop("disabled", true);
                    }
                    $("#name_forma").val(data.vDescripcion1);
                    $(".lbl_forma").text(data.vDescripcion2);
                    $(".cabecera_data").css('display','none');
                    $(".visualizar").css('display','none');
                    $("#lot_min_diferencia").val(Math.round(info.PlannedQty));
                }
            }
        });
    }else{
        $(".cabecera_data").css('display','none');
        $(".visualizar").css('display','none');
    }
});

$("#btnVer").on("click",function(e){
    e.preventDefault();
    let granel=$("#lisPrincipios").val();
    if(granel!=''){
        $(".visualizar").css('display','inline-block');
        $(".visualizar").css('width','100%');
        $(".cabecera_data").css('display','none');
        $.ajax({
            url: servidor+"gaf/reportecostos/visualizarversiones",
            type:'post',
            data:{'granel':granel},
            success:function(response){
                let html='';
                $(".list-title").text(granel);
                let obj=JSON.parse(response);
                $.each(obj,function(i,item){
                    html+='<li class="mt-list-item jmlist">';
                    html+='<div class="list-icon-container done">';
                    html+='    <i class="icon-check"></i>';
                    html+='</div>';
                    html+='<div class="list-datetime">  </div>';
                    html+='<div class="list-item-content">';
                    html+='    <h3 class="uppercase">';
                    html+='        <a href="javascript:;" class="version_jm" data-value="'+item.idreporteCabecera+'">Versión '+item.nVersion+'</a>';
                    html+='   </h3>';
                    html+='</div>';
                    html+='</li>';
                });
                $('.lista-jm').html(html);               
            }
        });
    }else{
        $(".visualizar").css('display','none');
        alertify.error('Debe escoger un granel');
    }
});


function cargarfabricacion(granel,edit,per,ver){
    $.ajax({
        url:servidor+"gaf/reportecostos/getRutav2",
        type:'post',
        data:{'granel':granel,'tipo':1,'edit':edit,'per':per,'ver':ver},
        success:function(response){
            let tab=JSON.parse(response);
            let datatab=tab.data;
            let dataprocesos=tab.procesos;
            let datamaquinas=tab.maquinas;
            let dataoptions=[];
            let dataoptionsmaq=[];
            $.each(dataprocesos,function(i,item){
                dataoptions[item.idproceso]=item.vNombreProceso;
            });
            $.each(datamaquinas,function(i,item){
                dataoptionsmaq[item.idmaquina]=(item.codMaquina).replace(/\s+/, "");
            });
            log(datatab,dataoptions,dataoptionsmaq);
        }
    });
}

function cargaraacondicionado(granel,edit,per,ver){
    $.ajax({
        url:servidor+"gaf/reportecostos/getRutav2",
        type:'post',
        data:{'granel':granel,'tipo':2,'edit':edit,'per':per,'ver':ver},
        success:function(response){
            let tab=JSON.parse(response);
            let datatab=tab.data;
            let dataprocesos=tab.procesos;
            let datamaquinas=tab.maquinas;
            let dataoptions=[];
            let dataoptionsmaq=[];
            $.each(dataprocesos,function(i,item){
                dataoptions[item.codProceso]=item.vNombreProceso;
            });
            $.each(datamaquinas,function(i,item){
                dataoptionsmaq[item.idmaquina]=(item.codMaquina).replace(/\s+/, "");
            });
            logjm(datatab,dataoptions,dataoptionsmaq);
        }
    });
}

$(document).off('click','#main-btn-nuevo');
$("#main-btn-nuevo").on("click",function(e){
    e.preventDefault();
    seteardatos();
    $(".presjm").css("display","none");
    $("#mod").addClass("tab-pane fade active in");
    $("#mod-tab").parent().addClass("active");
    let granel=$("#lisPrincipios").val();
    $(".cabecera_data").css('display','none');
    $(".cabecera_data").css('width','100%');
    $(".visualizar").css('display','none');
    $("#main-btn-avances").parent().remove();
    $("#main-btn-resumen").parent().remove();
    cargaropciones();
    if(granel!='jm'){
        permisosusuario();
        $.post( servidor+"gaf/reportecostos/verificargranel", { 'granel': granel})
        .success(function( response ) {
               let obj=JSON.parse(response);
               if(obj.respuesta==1){
                    let ver=(parseInt(obj.version)+1);
                    $("#versiongi").val(ver);
               }else{
                $("#versiongi").val(0);
               }
        });
        $('nav.quick-nav').show();
        let info='<li>';
        info+='<a class="active" id="main-btn-avances">';
        info+='<span>Guardar avances</span>';
        info+='<i class="fa fa-save"></i>';
        info+='</a></li>';
        $("#ulEspeciales").append(info);
        guardaravances();
        $(".visualizar_52_10jm").show();
        $("#calcularjm").prop("disabled", false);
        $(".cabecera_data").css('display','inline-block');
        $(".cabecera_data").css('width','100%');
        $(".visualizar").css('display','none');
        $(".novisible").css('display','inline-block');
        $(".novisible").css('width','100%');
        $("#form_costos #idgranel").val(granel);
        let cant=$("#num_cant").val();
        $("#num_cant_cabecera").val(cant);
        $("#comentario_cabe").text("");
        $("#estadogi").val(1);
        $("#titulo_version").val("");
        $("#guardar_indicadores").css("display","inline-block");
        $("#cerrarindicador").text("Seguir editando");
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
        $(".statejm").html('<input type="checkbox" class="make-switch panelswitch" checked data-on-text="&nbsp;&nbsp;&nbsp;&nbsp;ACTIVO&nbsp;&nbsp;&nbsp;&nbsp;" data-off-text="&nbsp;&nbsp;&nbsp;&nbsp;INACTIVO&nbsp;&nbsp;&nbsp;&nbsp;"></input>');
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
        cargarfabricacion(granel);
        cargaraacondicionado(granel);
        cargarinsumo();
        getotros();
    }else{
        $.ajaxSetup({cache:false});
        alertify.error('Debe escoger un granel');
    }
});

$("#lisclones").select2();
function cargaropciones(){
    let html='<option value="jm">Ninguno</option>';
    $.ajax({
        url : servidor+"gaf/reportecostos/listacabeceras",
        type:'post',
        data:{},
        success:function(response){
            let obj=JSON.parse(response);
            $.each(obj,function(i,item){
                html+='<option value="'+item.idGranel+'-'+item.nVersion+'-'+item.nPeriodo+'">'+item.idGranel+' - V'+item.nVersion+' - '+item.ItemName+'</option>';
            });
            $("#lisclones").html(html);
        }
    });
}

$("#num_lote").keyup(function(e){
    let num=$(this).val();
    let pres=$("#num_pres").val();
    let calculo=parseInt((num/pres));
    $("#num_cant").val(calculo);
    $("#num_cant_cabecera").val(calculo);
    cargarinsumo();
    cargarmoi();
    cargarjm5();
    cargar_modjm();
});

$("#num_lote").focusin(function(e){
    $(this).select();
});
$("#num_pres").keyup(function(e){
    let num=$("#num_lote").val();
    let pres=$(this).val();    
    let calculo=parseInt((num/pres));
    $("#num_cant").val(calculo);
    $("#num_cant_cabecera").val(calculo);
    cargarmoi();
    cargarjm5();
    cargar_modjm();
});
$("#num_cant").keyup(function(e){
    let cant=$(this).val();
    $("#num_cant_cabecera").val(cant);
    cargarmoi();
    cargarjm5();
    cargar_modjm();
});
$("#num_pres").focusin(function(e){
    $(this).select();
});
function getotros1(){
    return [];
}
function cargarotros1(datatab){
    (datatab=="" || datatab==null ? tabjm=getotros1() : tabjm=datatab);   
    $("#table_otros1").html("");
    var example1 = document.getElementById('table_otros1');
    var tab1=tabjm;
    var sum0=0;
    $.each(tab1,function(i,item){
        $.each(item,function(x,jm){
            sum0+=parseFloat(jm);
        });
    });
    localStorage.setItem("total_otros1_fin",sum0);
    $("#data_proceso_otros1").val(JSON.stringify(tab1));
    var hot = new Handsontable(example1, {
        data: tab1,
        colWidths: 100,
        colHeaders: ['Materiales', 'Columna', 'Estandarn Ref.','Reactivos'],
        rowHeaders: ['Mat.Prima', 'Prod.Term.'],
        rowHeaderWidth: 100,
        minRows: 2,
        columns: [
            {
                type:'numeric'
            },
            {
                type:'numeric'
            },
            {
                type:'numeric'
            },
            {
                type:'numeric'
            },
          ],beforeChangeRender: (changes, source) => {
            var sumjm=0;
            $.each(tab1,function(i,item){
                $.each(item,function(x,jm){
                    sumjm+=parseFloat(jm);
                });
            });
            localStorage.setItem("total_otros1_fin",sumjm);            
            $("#data_proceso_otros1").val(JSON.stringify(tab1));
        }
    }); 
}

function getInsumo(){
    var lote=$("#num_lote").val();
    return [
        {valor:(lote>0)? lote*0.025 : "0.025"},{valor:(lote>0) ? lote*0.0000282 : "0.0000282"}
    ];
}

function cargarinsumo(){
    $("#table_agua").html("");
    var example1 = document.getElementById('table_agua');
    var datainsumo=getInsumo();
    var sumainsumo;
    sumainsumo=parseFloat(datainsumo[0]['valor'])+parseFloat(datainsumo[1]['valor']);
    localStorage.setItem("total_insumos_fin",sumainsumo);
    var hot = new Handsontable(example1, {
        data: datainsumo,
        colWidths: 140,
        colHeaders: ['Valor'],
        rowHeaders: ['Luz', 'Agua'],
        rowHeaderWidth: 120,
        contextMenu: true,
        minRows: 2,
        columns: [
            {
                data:'valor',
                type:'numeric',
                editor:false
            },
          ]
    }); 
}

var hotmaterias=null;
var columnasmaterias=null;
function cargarmaterias(tab,precios){
    $("#table_materias1").html("");
    var example1 = document.getElementById('table_materias1');
    var yellowRenderer;
    yellowRenderer = function(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        
        if(value!=null && value!=""){
            td.style.backgroundColor = 'yellow';
        }
    };
    let lote=$("#num_lote").val();
    let sumt=0;
    let sumjm=0;
    $.each(tab,function(i,item){
        item.referencia="";
        $.each(precios,function(j,itemjm){
            if(item.codMateria==itemjm.ItemCode){
                item.referencia=itemjm.AvgPrice;
            }
            if(item.referencia!=null &&  item.referencia!=""){
                item.diferencia=parseFloat(item.nCostoUnidad-item.referencia).toFixed(4);
            }else{
                item.diferencia="";
            }
            if(item.dCalculo!=null &&  item.dCalculo!="" && item.nCostoUnidad!=null &&  item.nCostoUnidad!=""){
                item.resultado=parseFloat(item.nCostoUnidad*item.dCalculo*lote).toFixed(4);
            }else{
                item.resultado="";
            }       
        });
        if(item.resultado!=""){
            sumt+=parseFloat(item.resultado);
            sumjm=parseFloat(sumt/lote);
        }
    });

    localStorage.setItem("total_materia_prima_fin",sumjm);
    $("#data_proceso_materiaprima").val(JSON.stringify(tab));
    colorRenderer = function(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);       
        if(value!=null && value!=""){
            if(value>0){
                td.style.backgroundColor = '#90EE90';
            }else{
                td.style.backgroundColor = '#F08080';
            }           
        }
    };
    columnasmaterias=[
        {
            data:'codMateria',
            type:'text'
        },
        {
            data:'vNombreMateria',
            type:'text'
        },
        {
            data:'nCostoUnidad',
            type:'numeric'
        },
        {
            data:'vUnidadMedida',
            type:'text'
        },
        {
            data:'dCalculo',
            type:'numeric'
        },
        {
            data:'referencia',
            type:'numeric',
            renderer: yellowRenderer,
            editor:false
        },{
            data:'diferencia',
            type:'numeric',
            renderer: colorRenderer,
            editor:false
        },{
            data:'resultado',
            type:'numeric',
            editor:false
        }
      ];
 
    hotmaterias = new Handsontable(example1, {
        data: tab,
        colWidths: 250,
        colHeaders: ['Código', 'Material','Costo/Unid','um','(para el cálculo)','Referencia','Diferencia',''],
        minRows: 20,
        minCols: 10,
        /*stretchH: 'all',    
        height: 500,*/
        contextMenu: true,
        hiddenColumns: {
            columns: [7],
        },
        stretchH: 'all', 
        //width: 800, 
        height: 500,
        language: 'es-MX',
        //colWidths: [100, 300, 150,150,150,150,250],
        columns: columnasmaterias
        ,beforeChangeRender: (changes, source) => {     
            hotmaterias.validateCells((valid) => {
                if (valid) {
  
                }else{
                    alertify.error('Ingrese datos correctos');
                }
            });
  
            $.each(tab,function(i,item){
                item.referencia="";
                $.each(precios,function(j,itemjm){
                    if(item.codMateria==itemjm.ItemCode){
                        item.referencia=itemjm.AvgPrice;
                    }
                    if(item.referencia!=null &&  item.referencia!=""){
                        item.diferencia=parseFloat(item.nCostoUnidad-item.referencia).toFixed(4);
                    }else{
                        item.diferencia="";
                    }
                    if(item.dCalculo!=null &&  item.dCalculo!="" && item.nCostoUnidad!=null &&  item.nCostoUnidad!=""){
                        item.resultado=parseFloat(item.nCostoUnidad*item.dCalculo*lote).toFixed(4);
                    }else{
                        item.resultado="";
                    }
                
                });
                if(item.resultado!=""){
                    sumt+=parseFloat(item.resultado);
                    sumjm=parseFloat(sumt/lote);
                }
            });
            var datajm14=hotmaterias.getData();
            localStorage.setItem("total_materia_prima_fin",sumjm);
            $("#data_proceso_materiaprima").val(JSON.stringify(tab));           
          }
    }); 
}

function cargarmaterias2(datatab){
    $("#table_materias2").html("");
    var example1 = document.getElementById('table_materias2');
    let lote=$("#num_cant_cabecera").val();
    let sumt=0;
    let sumjm=0;
    $.each(datatab,function(i,item){
        if(item.dCalculo!=null &&  item.dCalculo!="" && item.nCostoUnidad!=null &&  item.nCostoUnidad!=""){
            item.resultado=parseFloat(item.nCostoUnidad*item.dCalculo*lote).toFixed(4);
            sumt+=parseFloat(item.resultado);    
        }
    });

    sumjm=(parseFloat(sumt)/lote);
    localStorage.setItem("total_materia_empaque_fin",sumjm);
    $("#data_proceso_materiaempaque").val(JSON.stringify(datatab));
    var hot = new Handsontable(example1, {
        data: datatab,
        colWidths: 150,
        colHeaders: ['Código', 'Material','Costo/Unid','um','(para el cálculo)','Resultado'],
        rowHeaders:['PVC','Aluminio','','','','','','','','','','','','','','','','','',''],
        rowHeaderWidth: 150,
        contextMenu: true,
        hiddenColumns: {
            columns: [5,6,7], 
        },
        language: 'es-MX',
        colWidths: [200, 450, 100,100,150,200],
        minRows: 20,
        minCols: 10,
        stretchH: 'all',    
        height: 500,
        columns: [
            {
                data:'codMateria',
                type:'text'
            },
            {
                data:'vNombreMateria',
                type:'text'
            },
            {
                data:'nCostoUnidad',
                type:'numeric'
            },
            {
                data:'vUnidadMedida',
                type:'text'
            },
            {
                data:'dCalculo',
                type:'numeric'
            },
            {
                data:'resultado',
                type:'numeric'
            }
          ],beforeChangeRender: (changes, source) => {
            hot.validateCells((valid) => {
                if (valid) { 
                }else{
                    alertify.error('Ingrese datos correctos');
                }
            });
   
            $.each(datatab,function(i,item){
                if(item.dCalculo!=null &&  item.dCalculo!="" && item.nCostoUnidad!=null &&  item.nCostoUnidad!=""){
                    item.resultado=parseFloat(item.nCostoUnidad*item.dCalculo*lote).toFixed(4);
                    sumt+=parseFloat(item.resultado);    
                }
            });
            sumjm=(parseFloat(sumt)/lote);
            localStorage.setItem("total_materia_empaque_fin",sumjm);
            $("#data_proceso_materiaempaque").val(JSON.stringify(datatab));
          }
    }); 
}

function getotros(granel,edit,per,ver){
    $.ajax({
        url : servidor+'gaf/reportecostos/getOtros',
        type:'post',
        data:{'granel':granel,'edit':edit,'per':per,'ver':ver},
        success:function(response){
            let tab=JSON.parse(response);
            if(edit){
                let datatab1=JSON.parse(tab.otros_1);
                cargarotros1(datatab1);
            }else{
                cargarotros1();
            }
            let datamoi=tab.moi;
            localStorage.setItem("datamoijm",JSON.stringify(datamoi));
            cargarmoi();
            let datatab2=tab.otros_2;
            let datatab3=tab.otros_3;
            let datatab4=tab.otros_4;
            let datatab5=tab.otros_5;
            let datamateria=tab.materia;
            let datamateria2=tab.materia2;
            let dataprecios=tab.precios;
            let datamaquinas=tab.maquinas;
            let datamaqs=[];
            $.each(datamaquinas,function(i,item){
                datamaqs[item.idMaquina]=(item.vCodigo);
            });
            cargarotros2(datatab2);
            cargarotros3(datatab3);
            cargarotros4(datatab4);
            cargarotros5(datatab5,datamaqs,datamaquinas);
            cargarmaterias(datamateria,dataprecios);
            cargarmaterias2(datamateria2);
            
        }
    });
}

function cargarotros2(datatab){
    $("#table_otros2").html("");
    var example1 = document.getElementById('table_otros2');
    let costojm=0;
    let sumjm=0;
    let depre=JSON.parse(localStorage.getItem("depreciacion"));
    $.each(datatab,function(i,item){
        costojm=((item.dHoramaq*depre.prod)/60).toFixed(6);
        sumjm+=parseFloat(costojm);
    });
    localStorage.setItem("total_otros2_fin",sumjm.toFixed(6));
    $("#data_proceso_otros2").val(JSON.stringify(datatab));
    var hot = new Handsontable(example1, {
        data: datatab,
        colWidths: 150,
        colHeaders: ['Área', 'Cod.Máquina', 'H-M'],
        minRows: 15,
        language: 'es-MX',
        contextMenu: true,
        columns: [
            {
                data:'vArea',
                type:'text'
            },
            {
                data:'vMaquina',
                type:'text'
            },
            {
                data:'dHoramaq',
                type:'numeric'
            },
          ],beforeChangeRender: (changes, source) => {
            hot.validateCells((valid) => {
                if (valid) {
  
                }else{
                    alertify.error('Ingrese datos correctos');
                }
            });
            $.each(datatab,function(i,item){
                costojm=((item.dHoramaq*depre.prod)/60).toFixed(6);
                sumjm+=parseFloat(costojm);
            });
            localStorage.setItem("total_otros2_fin",sumjm.toFixed(6));
            $("#data_proceso_otros2").val(JSON.stringify(datatab));           
          }
    }); 
}

function cargarotros3(datatab){
    $("#table_otros3").html("");
    $("#data_proceso_otros3").val(JSON.stringify(datatab));
    let costojm=0;
    let sumjm=0;
    let depre=JSON.parse(localStorage.getItem("depreciacion"));
    $.each(datatab,function(i,item){
        costojm=((item.dHoramaq*depre.cont)/60).toFixed(6);
        sumjm+=parseFloat(costojm);
    });
    localStorage.setItem("total_otros3_fin",sumjm.toFixed(6));
    var example1 = document.getElementById('table_otros3');
    var hot = new Handsontable(example1, {
        data: datatab,
        colWidths: 150,
        language: 'es-MX',
        colHeaders: ['Área', 'Máquina', 'H-M'],
        minRows: 15,
        contextMenu: true,
        columns: [
            {
                data:'vArea',
                type:'text'
            },
            {
                data:'vMaquina',
                type:'text'
            },
            {
                data:'dHoramaq',
                type:'numeric'
            },
          ],beforeChangeRender: (changes, source) => {
            hot.validateCells((valid) => {
                if (valid) {  
                }else{
                    alertify.error('Ingrese datos correctos');
                }
            });
            $.each(datatab,function(i,item){
                costojm=((item.dHoramaq*depre.cont)/60).toFixed(6);
                sumjm+=parseFloat(costojm);
            });
            localStorage.setItem("total_otros3_fin",sumjm.toFixed(6));
            $("#data_proceso_otros3").val(JSON.stringify(datatab));          
          }
    }); 
}

function cargarotros4(datatab){
    $("#table_otros4").html("");
    var example1 = document.getElementById('table_otros4');
    $("#data_proceso_otros4").val(JSON.stringify(datatab));
    let costojm=0;
    let sumjm=0;
    let depre=JSON.parse(localStorage.getItem("depreciacion"));
    $.each(datatab,function(i,item){
        costojm=((item.dHoramaq*depre.cont)/60).toFixed(6);
        sumjm+=parseFloat(costojm);
    });
    localStorage.setItem("total_otros4_fin",sumjm.toFixed(6));
    var hot = new Handsontable(example1, {
        data: datatab,
        language: 'es-MX',
        colWidths: 150,
        colHeaders: ['Área', 'Cod.Máquina', 'H-M'],
        minRows: 15,
        contextMenu: true,
        columns: [
            {
                data:'vArea',
                type:'text'
            },
            {
                data:'vMaquina',
                type:'text'
            },
            {
                data:'dHoramaq',
                type:'numeric'
            },

          ],beforeChangeRender: (changes, source) => {
            hot.validateCells((valid) => {
                if (valid) {  
                }else{
                    alertify.error('Ingrese datos correctos');
                }
            });           
            $.each(datatab,function(i,item){
                costojm=((item.dHoramaq*depre.cont)/60).toFixed(6);
                sumjm+=parseFloat(costojm);
            });
            localStorage.setItem("total_otros4_fin",sumjm.toFixed(6));
            $("#data_proceso_otros4").val(JSON.stringify(datatab));            
          }
    }); 
}

function cargarotros5(datatab,maquinas,datajm){
    $("#table_otros5").html("");
    var hot;
    var example1 = document.getElementById('table_otros5');
    let depre=JSON.parse(localStorage.getItem("depreciacion"));
    $.each(datajm,function(i,item){
        item.vCodigo=(item.vCodigo).replace(/\s+/, "");
    });
    $.each(datatab,function(i,item){
            if(item.vMaquina!="" && item.vMaquina!=null){
                item.vMaquina=(item.vMaquina).replace(/\s+/, "");
                $.each(datajm,function(x,itemx){
                    if(item.vMaquina==(itemx.vCodigo)){
                        item.tipo=itemx.vNombreTipo;
                    }
                })
            }
    });
    let lote=$("#num_lote").val();
    let cantidad=$("#num_cant_cabecera").val();
    let volumen;
    let costojm=0;
    let sumjm=0;
    $.each(datatab,function(i,item){
        if(item.tipo=='Fabricacion'){
            volumen=lote;
        }else{
            volumen=cantidad;
        }
        costojm=((item.dHoramaq*depre.prod*volumen)/60).toFixed(6);
        sumjm+=parseFloat(costojm);
    });
    localStorage.setItem("total_otros5_fin",sumjm.toFixed(6));
    $("#data_proceso_otros5").val(JSON.stringify(datatab));
    hot = new Handsontable(example1, {
        data: datatab,
        colWidths: 150,
        colHeaders: ['Cod.Máquina', 'H-M','Tipo'],
        minRows: 15,
        language: 'es-MX',
        contextMenu: true,
        columns: [
            {
                data: 'vMaquina',
                editor: 'select',
                selectOptions: maquinas
            },
            {
                data:'dHoramaq',
                type:'numeric'
            },
            {
                data:'tipo',
                type:'text',
            }
          ],beforeChangeRender: (changes, source) => {
            hot.validateCells((valid) => {
                if (valid) {
  
                }else{
                    alertify.error('Ingrese datos correctos');
                }
            });

            $.each(datajm,function(i,item){
                item.vCodigo=(item.vCodigo).replace(/\s+/, "");
            });
            $.each(datatab,function(i,item){
                    if(item.vMaquina!="" && item.vMaquina!=null){
                        item.vMaquina=(item.vMaquina).replace(/\s+/, "");
                        $.each(datajm,function(x,itemx){
                            if(item.vMaquina==(itemx.vCodigo)){
                                item.tipo=itemx.vNombreTipo;
                            }
                        })
                    }
            });          
            $.each(datatab,function(i,item){
                if(item.tipo=='Fabricacion'){
                    volumen=lote;
                }else{
                    volumen=cantidad;
                }
                costojm=((item.dHoramaq*depre.prod*volumen)/60).toFixed(6);
                sumjm+=parseFloat(costojm);
            });
            localStorage.setItem("total_otros5_fin",sumjm.toFixed(6));
            $("#data_proceso_otros5").val(JSON.stringify(datatab));
          }
    }); 
}

function cargarmoi(){
    var jm=localStorage.getItem("sumafab");
    var jm2=localStorage.getItem("sumaacon");
    let datamoijm=JSON.parse(localStorage.getItem("datamoijm"));
    var lote=$("#num_lote").val();
    var cantidad=$("#num_cant_cabecera").val();
    $.each(datamoijm,function(i,item){
        datamoijm[0]['datofab']=jm;
        datamoijm[0]['datoacon']=jm2;
        datamoijm[2]['datofab']=lote;
        datamoijm[2]['datoacon']=cantidad;
        datamoijm[2]['datolabpp']='cte';
        datamoijm[2]['datolabpt']='cte';
        datamoijm[2]['datolabmp']='cte';
    });
      
       
    $("#table_moi").html("");
    var datamoi=datamoijm;
    $("#datamoi").val(JSON.stringify(datamoi));
    $("#valid_moi").val(1);
    var example1 = document.getElementById('table_moi');
    var hot = new Handsontable(example1, {
        data: datamoi,
        colWidths: 150,
        colHeaders: ['Fabricación', 'Acondicionado', 'Lab P.P.','Lab P.T.','Lab M.P.'],
        rowHeaders: ['Tiempo','# Personas', 'Volumen'],
        rowHeaderWidth: 100,
        stretchH: 'all',    
        height: 150,
        manualColumnResize: true,
        manualRowResize: true,
        maxRows:3,
        columns: [
            {
                data:'datofab',
                type:'numeric'
            },
            {
                data:'datoacon',
                type:'numeric'
            },
            {
                data:'datolabpp',
                type:'text'
            },
            {
                data:'datolabpt',
                type:'text'
            },
            {
                data:'datolabmp',
                type:'text'
            },
          ],beforeChangeRender: (changes, source) => {
                hot.validateCells((valid) => {
                    if (valid) {
                        $("#valid_moi").val(1);
                    }else{
                        $("#valid_moi").val(2);
                    }
                });
                localStorage.setItem("datamoijm",JSON.stringify(datamoijm));
                $("#datamoi").val(JSON.stringify(datamoi));
            }
    });
    hot.updateSettings({
        cells: function (row, col, prop) {
          var cellProperties = {};     
          if (hot.getDataAtRowProp(row, prop) === 'cte') {0
            cellProperties.editor = false;
          } else {
            cellProperties.editor = 'text';
          }
          return cellProperties;
        }
    });
}


function log(tab,procesos,maquinas){
    $("#table_fabricacion").html("");
    var example1 = document.getElementById('table_fabricacion');
    var hot = new Handsontable(example1, {
    data: tab,
    colHeaders: true,
    nestedHeaders: [
        ['' ,'','Setup',{label: 'Proceso', colspan: 2},'Limpieza','Limpieza Área', '','',{label: 'Subtotal',colspan:4},{label:'Ratios',colspan:13},{label:'Total',colspan:2}],
        [ 'Operacion/Proceso','Máquina','HH', 'HH','HM','HH','HH', 'N. Operadores','Observaciones','HH','HM','JM','HP',
        'Basico','Asig.Familiar','Movilidad','Asig.Educación','Refrig.','Estac.Alim','CTS','Vacac.','Gratif','Bonif.Extra','Essalud',
        'Senati','SCTR','Total','Unitario'],
    ],
    contextMenu: true,
    minRows: 20,
    language: 'es-MX',
    stretchH: 'all',
    height: 600,
    hiddenColumns: {
        columns: [11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
    },
    colWidths: [200, 200, 80,80,80,80,80,150,200,50,50,100,50,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150],
    columns: [
        {
            data: 'vNombreProceso',
            editor: 'select',
            selectOptions: procesos
        },
        {
            data: 'codMaquina',
            editor: 'select',
            selectOptions: maquinas
        },
        {
            data: 'nSetupHH',
            type:'numeric'
        },
        {
            data: 'nProcesoHH',
            type:'numeric'
        },
        {
            data: 'nProcesoHM',
            type:'numeric'
        },
        {
            data: 'nLimpiezaMaq',
            type:'numeric'
        },
        {
            data: 'nLimpiezaAre',
            type:'numeric'
        },
        {
            data:'nOperadores',
            type:'numeric'
        },
        {
            data:'vObservacion'
        },
        {
            data:'nSubtotalHH',
        },
        {
            data:'nSubtotalHM',
        },
        {
            data:'idproceso',
            editor:false
        },
        {
            data:'nSubtotalHP',
        },
        {
            data:'proc_1',
            editor:false
        },
        {
            data:'proc_2',
            editor:false
        },
        {
            data:'proc_3',
            editor:false
        },
        {
            data:'proc_4',
            editor:false
        },
        {
            data:'proc_5',
            editor:false
        },
        {
            data:'proc_6',
            editor:false
        },
        {
            data:'proc_7',
            editor:false
        },
        {
            data:'proc_8',
            editor:false
        },
        {
            data:'proc_9',
            editor:false
        },
        {
            data:'proc_10',
            editor:false
        },
        {
            data:'proc_11',
            editor:false
        },
        {
            data:'proc_12',
            editor:false
        },
        {
            data:'proc_13',
            editor:false
        },
        {
            data:'total',
            editor:false
        },
        {
            data:'unidad',
            editor:false
        }
    ],columnSummary: [         
        {
          destinationRow: 19,
          destinationColumn: 2,
          type: 'sum',
          forceNumeric: true
        },
        {
            destinationRow: 19,
            destinationColumn: 3,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 4,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 5,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 6,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 7,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 9,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 10,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 12,
            type: 'sum',
            forceNumeric: true
          }
      ],beforeChangeRender: (changes, source) => {
        if(changes){          
            var index=changes[0][0];
            if(changes[0][1]=='vNombreProceso'){
                if(changes[0][3]!=null && changes[0][3]!=""){
                    
                    $.each(tab,function(i,item){
                        if(i==(index)){                           
                            item.nSetupHH=0;
                            item.nProcesoHH=0;
                            item.nProcesoHM=0;
                            item.nLimpiezaMaq=0;
                            item.nLimpiezaAre=0;
                            item.nOperadores=0;
                            item.nSubtotalHH=0;
                            item.nSubtotalHM=0;
                            item.nSubtotalHP=0;
                        }            
                    });
                    var procesos=JSON.parse(localStorage.getItem("procesos"));                                     
                    $.each(procesos,function(i,item){                        
                        if(item.vNombreProceso==tab[index]['vNombreProceso']){
                            tab[index]['idproceso']=item.idproceso;
                        }
                    });
                }
            }           
        }

        var datajm=hot.getData();
        var suma=0;
        var sumahm=0;
        var procesosjm=[];
        var arraysumas=[];
        var arraysumashm=[];
        var arraysumashp=[];
        for(var i=0;i<(datajm.length);i++){
            suma=(parseFloat(datajm[i][2])+parseFloat(datajm[i][3])+parseFloat(datajm[i][5])+parseFloat(datajm[i][6]))*parseFloat(parseFloat(datajm[i][7]));
            sumahm=(parseFloat(datajm[i][4]) + parseFloat(datajm[i][2]));
            sumahp=parseFloat(datajm[i][2])+parseFloat(datajm[i][3])+parseFloat(datajm[i][5])+parseFloat(datajm[i][6]);     
            suma=(suma>=0 ? suma : '');
            sumahm=(sumahm>=0 ? sumahm : '');
            sumahp=(sumahp>=0 ? sumahp : '');
            procesosjm[i]=datajm[i][0];
            arraysumas[i]=suma;
            arraysumashm[i]=sumahm;
            arraysumashp[i]=sumahp;
        }           
        var ratios=JSON.parse(localStorage.getItem("ratios_fabricacion"));
        var lote=$("#num_lote").val();
        var sumafabri=0;
        $.each(tab,function(i,item){
            item.nSubtotalHH=arraysumas[i];
            item.nSubtotalHM=arraysumashm[i];
            item.nSubtotalHP=arraysumashp[i];
            if(item.nSubtotalHH!=''){
                item.proc_1=item.nSubtotalHH*parseFloat(ratios[0]);
                item.proc_2=item.nSubtotalHH*parseFloat(ratios[1]);
                item.proc_3=item.nSubtotalHH*parseFloat(ratios[2]);
                item.proc_4=item.nSubtotalHH*parseFloat(ratios[3]);
                item.proc_5=item.nSubtotalHH*parseFloat(ratios[4]);
                item.proc_6=item.nSubtotalHH*parseFloat(ratios[5]);
                item.proc_7=item.nSubtotalHH*parseFloat(ratios[6]);
                item.proc_8=item.nSubtotalHH*parseFloat(ratios[7]);
                item.proc_9=item.nSubtotalHH*parseFloat(ratios[8]);
                item.proc_10=item.nSubtotalHH*parseFloat(ratios[9]);
                item.proc_11=item.nSubtotalHH*parseFloat(ratios[10]); 
                item.proc_12=item.nSubtotalHH*parseFloat(ratios[11]);
                item.proc_13=item.nSubtotalHH*parseFloat(ratios[12]);
                item.total=parseFloat(item.proc_1)+parseFloat(item.proc_2)+parseFloat(item.proc_3)+parseFloat(item.proc_4)
                +parseFloat(item.proc_5)+parseFloat(item.proc_6)+parseFloat(item.proc_7)+parseFloat(item.proc_8)
                +parseFloat(item.proc_9)+parseFloat(item.proc_10)+parseFloat(item.proc_11)+parseFloat(item.proc_12)+parseFloat(item.proc_13);
                item.unidad=item.total/parseFloat(lote);                               
            }   
            sumafabri+=(item.total==null ? 0 : item.total*lote);         
        });        
        for(var i=0;i<arraysumashp.length;i++){
            while(arraysumashp[i] == ""){
                arraysumashp.splice(i,1);
            }
        }
        arraysumashp.splice((arraysumashp.length-1),1);
        var sjm=0;
        for(var m=0;m<arraysumashp.length;m++){
            sjm+=arraysumashp[m];
        }
        localStorage.setItem("sumafab",sjm);
        cargarmoi();       
        var datajm14=hot.getData();
        $("#datafabrica").val(datajm14);
        $("#datafabrica_para_proceso").val(JSON.stringify(tab));
      }
    }); 
}

function logjm(tab,procesos,maquinas){
    $("#table_acondicionado").html("");
    var example1 = document.getElementById('table_acondicionado');
    var hot = new Handsontable(example1, {
    data: tab,
    colHeaders: true,
    nestedHeaders: [
        ['' ,'','Setup',{label: 'Proceso', colspan: 2},'Limpieza','Limpieza Área', '','',{label: 'Subtotal',colspan:4},{label:'Ratios',colspan:13},{label:'Total',colspan:2}],
        [ 'Operacion/Proceso','Máquina','HH', 'HH','HM','HH','HH', 'N. Operadores','Observaciones','HH','HM','JM','HP',
        'Basico','Asig.Familiar','Movilidad','Asig.Educación','Refrig.','Estac.Alim','CTS','Vacac.','Gratif','Bonif.Extra','Essalud',
        'Senati','SCTR','Total','Unitario'],
    ],
    contextMenu: true,
    language: 'es-MX',
    minRows: 20,
    stretchH: 'all',    
    height: 600,
    hiddenColumns: {
        columns: [11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
    },
    colWidths: [200, 200, 80,80,80,80,80,150,200,50,50,100,50,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150],
    columns: [
        {
            data: 'vNombreProceso',
            editor: 'select',
            selectOptions: procesos
        },
        {
            data: 'codMaquina',
            editor: 'select',
            selectOptions: maquinas
        },
        {
            data: 'nSetupHH',
            type:'numeric'
        },
        {
            data: 'nProcesoHH',
            type:'numeric'
        },
        {
            data: 'nProcesoHM',
            type:'numeric'
        },
        {
            data: 'nLimpiezaMaq',
            type:'numeric'
        },
        {
            data: 'nLimpiezaAre',
            type:'numeric'
        },
        {
            data:'nOperadores',
            type:'numeric'
        },
        {
            data:'vObservacion'
        },
        {
            data:'nSubtotalHH',
        },
        {
            data:'nSubtotalHM',
        },
        {
            data:'idproceso',
            editor:false
        },
        {
            data:'nSubtotalHP',
            
        },
        {
            data:'proc_1',
            editor:false
        },
        {
            data:'proc_2',
            editor:false
        },
        {
            data:'proc_3',
            editor:false
        },
        {
            data:'proc_4',
            editor:false
        },
        {
            data:'proc_5',
            editor:false
        },
        {
            data:'proc_6',
            editor:false
        },
        {
            data:'proc_7',
            editor:false
        },
        {
            data:'proc_8',
            editor:false
        },
        {
            data:'proc_9',
            editor:false
        },
        {
            data:'proc_10',
            editor:false
        },
        {
            data:'proc_11',
            editor:false
        },
        {
            data:'proc_12',
            editor:false
        },
        {
            data:'proc_13',
            editor:false
        },
        {
            data:'total',
            editor:false
        },
        {
            data:'unidad',
            editor:false
        }
    ],columnSummary: [        
        {
          destinationRow: 19,
          destinationColumn: 2,
          type: 'sum',
          forceNumeric: true
        },
        {
            destinationRow: 19,
            destinationColumn: 3,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 4,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 5,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 6,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 7,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 9,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 10,
            type: 'sum',
            forceNumeric: true
          },
          {
            destinationRow: 19,
            destinationColumn: 12,
            type: 'sum',
            forceNumeric: true
          }
      ],beforeChangeRender: (changes, source) => {
        if(changes){
            var index=changes[0][0];
            if(changes[0][1]=='vNombreProceso'){
                if(changes[0][3]!=null && changes[0][3]!=""){
                    
                    $.each(tab,function(i,item){
                        if(i==(index)){
                            
                            item.nSetupHH=0;
                            item.nProcesoHH=0;
                            item.nProcesoHM=0;
                            item.nLimpiezaMaq=0;
                            item.nLimpiezaAre=0;
                            item.nOperadores=0;
                            item.nSubtotalHH=0;
                            item.nSubtotalHM=0;
                            item.nSubtotalHP=0;
                        }           
                    });
                    var procesos=JSON.parse(localStorage.getItem("procesos"));                                       
                    $.each(procesos,function(i,item){                        
                        if(item.vNombreProceso==tab[index]['vNombreProceso']){
                            tab[index]['idproceso']=item.idproceso;
                        }
                    });
                }
            }            
        }
        var datajm=hot.getData();
        var suma=0;
        var sumahm=0;
        var arraysumas=[];
        var arraysumashm=[];
        var arraysumashp=[];
        var ratios=JSON.parse(localStorage.getItem("ratios_acondicionado"));
        var cantidad=$("#num_cant_cabecera").val();
        var sumaacon=0;
        for(var i=0;i<(datajm.length);i++){
            suma=(parseFloat(datajm[i][2])+parseFloat(datajm[i][3])+parseFloat(datajm[i][5])+parseFloat(datajm[i][6]))*parseFloat(parseFloat(datajm[i][7]));
            //sumahm=(parseFloat(datajm[i][4]) > 0) ? (parseFloat(datajm[i][4]) + parseFloat(datajm[i][2])) : parseFloat(datajm[i][4]);
            sumahm=(parseFloat(datajm[i][4]) + parseFloat(datajm[i][2]));
            sumahp=(parseFloat(datajm[i][2])+parseFloat(datajm[i][3])+parseFloat(datajm[i][5])+parseFloat(datajm[i][6])); 
            suma=(suma>=0 ? suma : '');
            sumahm=(sumahm>=0 ? sumahm : '');
            sumahp=(sumahp>=0 ? sumahp : '');
            arraysumas[i]=suma;
            arraysumashm[i]=sumahm;
            arraysumashp[i]=sumahp;
        }      
        $.each(tab,function(i,item){
            item.nSubtotalHH=arraysumas[i];
            item.nSubtotalHM=arraysumashm[i];
            item.nSubtotalHP=arraysumashp[i];
            if(item.nSubtotalHH!=''){
                item.proc_1=item.nSubtotalHH*parseFloat(ratios[0]);
                item.proc_2=item.nSubtotalHH*parseFloat(ratios[1]);
                item.proc_3=item.nSubtotalHH*parseFloat(ratios[2]);
                item.proc_4=item.nSubtotalHH*parseFloat(ratios[3]);
                item.proc_5=item.nSubtotalHH*parseFloat(ratios[4]);
                item.proc_6=item.nSubtotalHH*parseFloat(ratios[5]);
                item.proc_7=item.nSubtotalHH*parseFloat(ratios[6]);
                item.proc_8=item.nSubtotalHH*parseFloat(ratios[7]);
                item.proc_9=item.nSubtotalHH*parseFloat(ratios[8]);
                item.proc_10=item.nSubtotalHH*parseFloat(ratios[9]);
                item.proc_11=item.nSubtotalHH*parseFloat(ratios[10]); 
                item.proc_12=item.nSubtotalHH*parseFloat(ratios[11]);
                item.proc_13=item.nSubtotalHH*parseFloat(ratios[12]);
                item.total=parseFloat(item.proc_1)+parseFloat(item.proc_2)+parseFloat(item.proc_3)+parseFloat(item.proc_4)
                +parseFloat(item.proc_5)+parseFloat(item.proc_6)+parseFloat(item.proc_7)+parseFloat(item.proc_8)
                +parseFloat(item.proc_9)+parseFloat(item.proc_10)+parseFloat(item.proc_11)+parseFloat(item.proc_12)+parseFloat(item.proc_13);
                item.unidad=item.total/parseFloat(cantidad);
            }
            sumaacon+=(item.total==null ? 0 : item.total);
        });
        localStorage.setItem("total_mod_acon_fin",sumaacon);
        for(var i=0;i<arraysumashp.length;i++){
            while(arraysumashp[i] == ""){
                arraysumashp.splice(i,1);
            }
        }
        arraysumashp.splice((arraysumashp.length-1),1);
        var sjm=0;
        for(var m=0;m<arraysumashp.length;m++){
            sjm+=arraysumashp[m];
        }
        localStorage.setItem("sumaacon",sjm);
        cargarmoi();
        var datajm14=hot.getData();
        $("#dataacondicionado").val(datajm14);
        $("#dataacondicionado_para_proceso").val(JSON.stringify(tab));
      }
    });    
}