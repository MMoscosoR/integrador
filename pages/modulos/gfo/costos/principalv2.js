$(document).ready(function(){
    $.ajaxSetup({cache:false});
    $.ajax({
        url : servidor+'/gfo/reportecostos/getactivos',
        type:'post',
        data:{},
        success:function(response){
            var obj_A=JSON.parse(response);
            var obj=obj_A.activos;
            var html='<option value="">Seleccione...</option>';
            $.each(obj,function(i,item){
                html += '<option value="'+item.ItemCode+'">'+item.ItemCode+" - "+item.ItemName+'</option>';
            });
            localStorage.setItem("procesos",JSON.stringify(obj_A.procesos));
            localStorage.setItem("ratios_fabricacion",JSON.stringify(obj_A.ratios_fab));
            localStorage.setItem("ratios_acondicionado",JSON.stringify(obj_A.ratios_acon));
            localStorage.setItem("ratios_moi_fab",JSON.stringify(obj_A.ratios_moi_fab));
            localStorage.setItem("ratios_moi_acon",JSON.stringify(obj_A.ratios_moi_acon));
            localStorage.setItem("ratios_moi_pp",JSON.stringify(obj_A.ratios_moi_pp));
            localStorage.setItem("ratios_moi_pt",JSON.stringify(obj_A.ratios_moi_pt));
            localStorage.setItem("ratios_moi_mp",JSON.stringify(obj_A.ratios_moi_mp));
            $("#lisPrincipios").html(html);
        }
    });
});

$("#lisPrincipios").select2();
$("#lisPrincipios").change(function(e){
    e.preventDefault();
    $.ajax({
        url:servidor+'gfo/reportecostos/getdatacabecera',
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
                $("#lot_min_diferencia").val(Math.round(info.MinOrdrQty));
            }
        }
    });
});

$("#btnVer").on("click",function(e){
    e.preventDefault();
    let granel=$("#lisPrincipios").val();
    if(granel!=''){
        $(".visualizar").css('display','inline-block');
        $(".visualizar").css('width','100%');
        $(".cabecera_data").css('display','none');
        $.ajax({
            url: servidor+"gfo/reportecostos/visualizarversiones",
            type:'post',
            data:{'granel':granel},
            success:function(response){
                let html='';
                $(".list-title").text(granel);
                let obj=JSON.parse(response);
                $.each(obj,function(i,item){
                    html+='<li class="mt-list-item">';
                    html+='<div class="list-icon-container done">';
                    html+='    <i class="icon-check"></i>';
                    html+='</div>';
                    html+='<div class="list-datetime">  </div>';
                    html+='<div class="list-item-content">';
                    html+='    <h3 class="uppercase">';
                    html+='        <a href="javascript:;">Versión '+i+'</a>';
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

function cargarfabricacion(granel){
    $.ajax({
        url:servidor+"gfo/reportecostos/getRutav2",
        type:'post',
        data:{'granel':granel,'tipo':1},
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

function cargaraacondicionado(granel){
    $.ajax({
        url:servidor+"gfo/reportecostos/getRutav2",
        type:'post',
        data:{'granel':granel,'tipo':2},
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

$(document).off('click','#main_btn_nuevo');

$(document).on('click','#main_btn_nuevo',function(e){
    e.preventDefault();
    
    let granel=$("#lisPrincipios").val();
    $(".cabecera_data").css('display','none');
    $(".cabecera_data").css('width','100%');
    $(".visualizar").css('display','none');
    if(granel!=''){
        $(".cabecera_data").css('display','inline-block');
        $(".cabecera_data").css('width','100%');
        $(".visualizar").css('display','none');
        $("#form_costos #idgranel").val(granel);
        let cant=$("#num_cant").val();
        $("#num_cant_cabecera").val(cant);
        
        cargarfabricacion(granel);
        cargaraacondicionado(granel);
        cargarotros1();
        getotros();
        //var datamoi=getmoi();
        cargarmoi();
        cargarmaterias2();

    }else{
        $.ajaxSetup({cache:false});
        alertify.error('Debe escoger un granel');
    }
});

$("#num_lote").keyup(function(e){
    let num=$(this).val();
    let pres=$("#num_pres").val();
    
    let calculo=parseInt((num/pres));
    $("#num_cant").val(calculo);
    $("#num_cant_cabecera").val(calculo);
    cargarmoi();
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
});

$("#num_cant").keyup(function(e){
    let cant=$(this).val();
    $("#num_cant_cabecera").val(cant);
    cargarmoi();
});

$("#num_pres").focusin(function(e){
    $(this).select();
});

function getotros1(){
    return [
        
      ];
}

function cargarotros1(){

    $("#table_otros1").html("");
    var example1 = document.getElementById('table_otros1');
 
    var hot = new Handsontable(example1, {
        data: getotros1(),
        colWidths: 150,
        colHeaders: ['Materiales', 'Columna', 'Estandarn Ref.','Reactivos'],
        rowHeaders: ['Materia prima', 'Prod. Terminados'],
        rowHeaderWidth: 150,
        contextMenu: true,
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
          ]
    }); 
}

function cargarmaterias(tab,precios){

    $("#table_materias1").html("");
    var example1 = document.getElementById('table_materias1');
    var yellowRenderer;
    yellowRenderer = function(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.backgroundColor = 'yellow';
    };
    var hot = new Handsontable(example1, {
        data: tab,
        colWidths: 150,
        colHeaders: ['Código', 'Material','Costo/Unid','um','(para el cálculo)','Referencia'],
        minRows: 20,
        minCols: 10,
        contextMenu: true,
        colWidths: [100, 300, 150,150,150,150],
        columns: [
            {
                data:'codigo',
                type:'text'
            },
            {
                data:'material',
                type:'text'
            },
            {
                data:'costo',
                type:'numeric'
            },
            {
                data:'um',
                type:'text'
            },
            {
                data:'calculo',
                type:'numeric'
            },
            {
                data:'referencia',
                type:'numeric',
                renderer: yellowRenderer,
                editor:false
            }
          ],beforeChangeRender: (changes, source) => {

            hot.validateCells((valid) => {
                if (valid) {
  
                }else{
                    alertify.error('Ingrese datos correctos');
                }
            });
            $.each(tab,function(i,item){
                item.referencia="";
                $.each(precios,function(j,itemjm){
                    if(item.codigo==itemjm.ItemCode){
                        item.referencia=itemjm.AvgPrice;
                    }
                });
            });

            var datajm14=hot.getData();
            $("#datamateriaprima").val(datajm14);
            
          }
    }); 
}

function cargarmaterias2(){
    $("#table_materias2").html("");
    var example1 = document.getElementById('table_materias2');
    var hot = new Handsontable(example1, {
        data: getotros1(),
        colWidths: 150,
        colHeaders: ['Código', 'Material','Costo/Unid','um','(para el cálculo)'],
        rowHeaders:['PVC','Aluminio','','','','','','','','','','','','','','','','','',''],
        rowHeaderWidth: 150,
        contextMenu: true,
        colWidths: [200, 450, 100,100,150],
        minRows: 20,
        minCols: 10,
        columns: [
            {
                type:'text'
            },
            {
                type:'text'
            },
            {
                type:'numeric'
            },
            {
                type:'text'
            },
            {
                type:'numeric'
            },
          ],beforeChangeRender: (changes, source) => {

            hot.validateCells((valid) => {
                if (valid) {
  
                }else{
                    alertify.error('Ingrese datos correctos');
                }
            });
            

            var datajm14=hot.getData();
            $("#datamateriaempaque").val(datajm14);
            
          }
    }); 
}

function getotros(){
    $.ajax({
        url : servidor+'gfo/reportecostos/getOtros',
        type:'post',
        data:{},
        success:function(response){
            let tab=JSON.parse(response);
            let datatab2=tab.otros_2;
            let datatab3=tab.otros_3;
            let datatab4=tab.otros_4;
            let datatab5=tab.otros_5;
            let datamateria=tab.materia;
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
        }
    });
}

function cargarotros2(datatab){
    $("#table_otros2").html("");
    var example1 = document.getElementById('table_otros2');
 
    var hot = new Handsontable(example1, {
        data: datatab,
        colWidths: 150,
        colHeaders: ['Área', 'Cod.Máquina', 'H-M'],
        minRows: 20,
        contextMenu: true,
        columns: [
            {
                data:'area',
                type:'text'
            },
            {
                data:'cod_maq',
                type:'text'
            },
            {
                data:'h_m',
                type:'numeric'
            },

          ]
    }); 
}

function cargarotros3(datatab){
    $("#table_otros3").html("");
    var example1 = document.getElementById('table_otros3');
    var hot = new Handsontable(example1, {
        data: datatab,
        colWidths: 150,
        colHeaders: ['Área', 'Máquina', 'H-M'],
        minRows: 20,
        contextMenu: true,
        columns: [
            {
                data:'area',
                type:'text'
            },
            {
                data:'cod_maq',
                type:'text'
            },
            {
                data:'h_m',
                type:'numeric'
            },
          ]
    }); 
}

function cargarotros4(datatab){
    $("#table_otros4").html("");
    var example1 = document.getElementById('table_otros4');
    var hot = new Handsontable(example1, {
        data: datatab,
        colWidths: 150,
        colHeaders: ['Área', 'Cod.Máquina', 'H-M'],
        minRows: 20,
        contextMenu: true,
        columns: [
            {
                data:'area',
                type:'text'
            },
            {
                data:'cod_maq',
                type:'text'
            },
            {
                data:'h_m',
                type:'numeric'
            },

          ]
    }); 
}

function cargarotros5(datatab,maquinas,datajm){
    $("#table_otros5").html("");
    var hot;
    var example1 = document.getElementById('table_otros5');
    hot = new Handsontable(example1, {
        data: datatab,
        colWidths: 150,
        colHeaders: ['Cod.Máquina', 'Tipo', 'H-M'],
        minRows: 20,
        contextMenu: true,
        columns: [
            {
                data: 'vCodigo',
                editor: 'select',
                selectOptions: maquinas
            },
            {
                data:'tipo',
                type:'text',
            },
            {
                data:'h_m',
                type:'numeric'
            },

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
                    if(item.vCodigo!="" && item.vCodigo!=null){
                        item.vCodigo=(item.vCodigo).replace(/\s+/, "");
                        $.each(datajm,function(x,itemx){
                            if(item.vCodigo==(itemx.vCodigo)){
                                item.tipo=itemx.vNombreTipo;
                            }
                        })
                    }
            });
          }
    }); 
}


function getmoi(jm,jm2){
    var lote=$("#num_lote").val();
    var cantidad=$("#num_cant_cabecera").val();
    var obj=[{datofab:(jm != null && jm > 0 ? jm : 0),datoacon:(jm2 != null && jm2 > 0 ? jm2 : 0),datolabpp:"",datolabpt:"",datolabmp:""},
    {datofab:"",datoacon:"",datolabpp:"",datolabpt:"",datolabmp:""},{datofab:lote,datoacon:cantidad,datolabpp:"cte",datolabpt:"cte",datolabmp:"cte"}];
    
    return obj;
}

function cargarmoi(){
    
    var jm=localStorage.getItem("sumafab");
    var jm2=localStorage.getItem("sumaacon");
    $("#table_moi").html("");
    var datamoi=getmoi(jm,jm2);
    var example1 = document.getElementById('table_moi');
    var hot = new Handsontable(example1, {
        data: datamoi,
        colWidths: 150,
        colHeaders: ['Fabricación', 'Acondicionado', 'Lab P.P.','Lab P.T.','Lab M.P.'],
        rowHeaders: ['Tiempo','# Personas', 'Volumen'],
        rowHeaderWidth: 150,
        //minRows: 3,
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
                //console.log(datajm14);
                //$("#datamoi").val(JSON.stringify(datajm14));
                hot.validateCells((valid) => {
                    if (valid) {
                        $("#valid_moi").val(1);
                    }else{
                        $("#valid_moi").val(2);
                    }
                });
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
    hiddenColumns: {
        columns: [11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],

    },
    colWidths: [200, 200, 50,50,50,50,50,150,200,50,50,100,50,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150],
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
            data: 'ind_1',
            type:'numeric'
        },
        {
            data: 'ind_2',
            type:'numeric'
        },
        {
            data: 'ind_3',
            type:'numeric'
        },
        {
            data: 'ind_4',
            type:'numeric'
        },
        {
            data: 'ind_5',
            type:'numeric'
        },
        {
            data:'operadores',
            type:'numeric'
        },
        {
            data:'observacion'
        },
        {
            data:'total_hh',
            //editor:false
        },
        {
            data:'total_hm',
            //editor:false
        },
        {
            data:'idproceso',
            editor:false
        },
        {
            data:'total_hp',
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
                            
                            item.ind_1=0;
                            item.ind_2=0;
                            item.ind_3=0;
                            item.ind_4=0;
                            item.ind_5=0;
                            item.operadores=0;
                            item.total_hh=0;
                            item.total_hm=0;
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
            sumahm=(parseFloat(datajm[i][4]) > 0) ? (parseFloat(datajm[i][4]) + parseFloat(datajm[i][2])) : parseFloat(datajm[i][4]);
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
        var sumajm=0;
        $.each(tab,function(i,item){
            item.total_hh=arraysumas[i];
            item.total_hm=arraysumashm[i];
            item.total_hp=arraysumashp[i];
            if(item.total_hh!=''){
                item.proc_1=item.total_hh*parseFloat(ratios[0]);
                item.proc_2=item.total_hh*parseFloat(ratios[1]);
                item.proc_3=item.total_hh*parseFloat(ratios[2]);
                item.proc_4=item.total_hh*parseFloat(ratios[3]);
                item.proc_5=item.total_hh*parseFloat(ratios[4]);
                item.proc_6=item.total_hh*parseFloat(ratios[5]);
                item.proc_7=item.total_hh*parseFloat(ratios[6]);
                item.proc_8=item.total_hh*parseFloat(ratios[7]);
                item.proc_9=item.total_hh*parseFloat(ratios[8]);
                item.proc_10=item.total_hh*parseFloat(ratios[9]);
                item.proc_11=item.total_hh*parseFloat(ratios[10]); 
                item.proc_12=item.total_hh*parseFloat(ratios[11]);
                item.proc_13=item.total_hh*parseFloat(ratios[12]);
                item.total=parseFloat(item.proc_1)+parseFloat(item.proc_2)+parseFloat(item.proc_3)+parseFloat(item.proc_4)
                +parseFloat(item.proc_5)+parseFloat(item.proc_6)+parseFloat(item.proc_7)+parseFloat(item.proc_8)
                +parseFloat(item.proc_9)+parseFloat(item.proc_10)+parseFloat(item.proc_11)+parseFloat(item.proc_12)+parseFloat(item.proc_13);
                item.unidad=item.total/parseFloat(lote);
            }
            
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
    hiddenColumns: {
        columns: [11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
    },
    colWidths: [200, 200, 50,50,50,50,50,150,200,50,50,100,50,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150],
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
            data: 'ind_1',
            type:'numeric'
        },
        {
            data: 'ind_2',
            type:'numeric'
        },
        {
            data: 'ind_3',
            type:'numeric'
        },
        {
            data: 'ind_4',
            type:'numeric'
        },
        {
            data: 'ind_5',
            type:'numeric'
        },
        {
            data:'operadores',
            type:'numeric'
        },
        {
            data:'observacion'
        },
        {
            data:'total_hh',
            //editor:false
        },
        {
            data:'total_hm',
            //editor:false
        },
        {
            data:'idproceso',
            editor:false
        },
        {
            data:'total_hp',
            
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
                            
                            item.ind_1=0;
                            item.ind_2=0;
                            item.ind_3=0;
                            item.ind_4=0;
                            item.ind_5=0;
                            item.operadores=0;
                            item.total_hh=0;
                            item.total_hm=0;
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

        for(var i=0;i<(datajm.length);i++){
            suma=(parseFloat(datajm[i][2])+parseFloat(datajm[i][3])+parseFloat(datajm[i][5])+parseFloat(datajm[i][6]))*parseFloat(parseFloat(datajm[i][7]));
            sumahm=(parseFloat(datajm[i][4]) > 0) ? (parseFloat(datajm[i][4]) + parseFloat(datajm[i][2])) : parseFloat(datajm[i][4]);
            sumahp=(parseFloat(datajm[i][2])+parseFloat(datajm[i][3])+parseFloat(datajm[i][5])+parseFloat(datajm[i][6])); 
            suma=(suma>=0 ? suma : '');
            sumahm=(sumahm>=0 ? sumahm : '');
            sumahp=(sumahp>=0 ? sumahp : '');
            arraysumas[i]=suma;
            arraysumashm[i]=sumahm;
            arraysumashp[i]=sumahp;
        }      
        $.each(tab,function(i,item){
            item.total_hh=arraysumas[i];
            item.total_hm=arraysumashm[i];
            item.total_hp=arraysumashp[i];
            if(item.total_hh!=''){
                item.proc_1=item.total_hh*parseFloat(ratios[0]);
                item.proc_2=item.total_hh*parseFloat(ratios[1]);
                item.proc_3=item.total_hh*parseFloat(ratios[2]);
                item.proc_4=item.total_hh*parseFloat(ratios[3]);
                item.proc_5=item.total_hh*parseFloat(ratios[4]);
                item.proc_6=item.total_hh*parseFloat(ratios[5]);
                item.proc_7=item.total_hh*parseFloat(ratios[6]);
                item.proc_8=item.total_hh*parseFloat(ratios[7]);
                item.proc_9=item.total_hh*parseFloat(ratios[8]);
                item.proc_10=item.total_hh*parseFloat(ratios[9]);
                item.proc_11=item.total_hh*parseFloat(ratios[10]); 
                item.proc_12=item.total_hh*parseFloat(ratios[11]);
                item.proc_13=item.total_hh*parseFloat(ratios[12]);
                item.total=parseFloat(item.proc_1)+parseFloat(item.proc_2)+parseFloat(item.proc_3)+parseFloat(item.proc_4)
                +parseFloat(item.proc_5)+parseFloat(item.proc_6)+parseFloat(item.proc_7)+parseFloat(item.proc_8)
                +parseFloat(item.proc_9)+parseFloat(item.proc_10)+parseFloat(item.proc_11)+parseFloat(item.proc_12)+parseFloat(item.proc_13);
                item.unidad=item.total/parseFloat(cantidad);
            }
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
        localStorage.setItem("sumaacon",sjm);
        cargarmoi();
        var datajm14=hot.getData();
        $("#dataacondicionado").val(datajm14);
        $("#dataacondicionado_para_proceso").val(JSON.stringify(tab));
      }
    }); 

    $("#calcularjm").click(function(e){
        e.preventDefault();
        alertify.confirm('Estas Seguro?',
        function(){
        let dataf=$("#datafabrica").val();
        let dataa=$("#dataacondicionado").val();
        let datamoi=$("#datamoi").val();
        let datamateriaprima=$("#datamateriaprima").val();
        let datamateriaempaque=$("#datamateriaempaque").val();
        $.ajax({
            url: servidor+"gfo/reportecostos/guardardata",
            type:'post',
            data:$(".cabecera_data #form_costos").serialize()+"&cabecera[usuarioCreador]="+sessionStorage.getItem("idusuario")+
            "&datamodf="+dataf+"&datamoda="+dataa+"&datamoi="+datamoi+"&datamateriaprima="+datamateriaprima+
            "&datamateriaempaque="+datamateriaempaque,
            cache:false,
            success:function(response){
                //console.log(response);
                if(parseInt(response)==1){
                    setTimeout(alertify.success('Guardado con exito'),3000);
                    $.ajaxSetup({cache:false});
                    $('a[data-id=52]').trigger('click');
                }else{
                    alertify.error('Hay tablas vacías');
                    $.ajaxSetup({cache:false});
                }
            }
        });

    });
    });
}






