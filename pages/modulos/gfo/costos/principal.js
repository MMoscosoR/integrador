$(document).ready(function(){

    $.ajax({
        url : servidor+'/gfo/reportecostos/getactivos',
        type:'post',
        data:{},
        success:function(response){
            let obj=JSON.parse(response);
            let html='<option value="">Seleccione...</option>';
            $.each(obj,function(i,item){
                html += '<option value="'+item.ItemCode+'">'+item.ItemCode+" - "+item.ItemName+'</option>';
            });

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
        data:{'idprin':$(this).val()},
        success:function(response){
            var obj=JSON.parse(response);
            $("#name_forma").val(obj.vDescripcion1);
            $(".lbl_forma").text(obj.vDescripcion2);
            $(".cabecera_data").css('display','none');
        }
    });
});


$("#num_lote").keyup(function(e){
    let num=$(this).val();
    let pres=$("#num_pres").val();

    let calculo=parseInt((num/pres));
    $("#num_cant").val(calculo);
});

$("#num_lote").focusin(function(e){
    $(this).select();
});

$("#num_pres").keyup(function(e){
    let num=$("#num_lote").val();
    let pres=$(this).val();

    let calculo=parseInt((num/pres));
    $("#num_cant").val(calculo);
});

$("#num_pres").focusin(function(e){
    $(this).select();
});


function cargarprocesos(item){
    $.ajax({
        url: servidor+"gfo/reportecostos/cargarprocesos",
        type:'post',
        data:{'tipo':item},
        success:function(response){
            var obj=JSON.parse(response);
            //console.log(obj);
            var html='<option value="">Seleccione...</option>';
            $.each(obj,function(i,item){
                html+='<option value="'+item.idproceso+'">'+item.vNombreProceso+'</option>';
            });
            if(item==1){
                $("#selec_procesos").html(html);
            }else{
                $("#selec_procesosfab").html(html);
            }
            
        }
    });
}

function inputs(jm){
    let inputs='';
    for(let i=0;i<8;i++){
        let read=(i==6 || i==7) ? 'readonly' :'';
        let clas=(i==6) ? 'subhh'+jm :'';
        let clasjm=(i==7) ? 'subhm'+jm :'';
        inputs+='<td><input type="text" '+read+' name="data['+jm+'][]"  class="input_jm '+clas+' '+clasjm+'" style="width:50px;border:0;" value="0"></td>';
    }
    return inputs;
}

function inputsacon(jm){
    let inputs='';
    for(let i=0;i<8;i++){
        let read=(i==6 || i==7) ? 'readonly' :'';
        let clas=(i==6) ? 'subhha'+jm :'';
        let clasjm=(i==7) ? 'subhma'+jm :'';
        inputs+='<td><input type="text"  '+read+' name="dataacondicionado['+jm+'][]" class="input_jm '+clas+' '+clasjm+'" style="width:50px;border:0;" value="0"></td>';
    }
    return inputs;
}

function cargarmaterias(item){
    $.ajax({
        url: servidor+"gfo/reportecostos/cargarmaterias",
        type:'post',
        data:{'tipo':item},
        success:function(response){
            var obj=JSON.parse(response);
            //console.log(obj);
            var html='<option value="">Seleccione...</option>';
            $.each(obj,function(i,item){
                html+='<option value="'+item.ItemCode+'">'+item.ItemCode+' - '+item.ItemName+'</option>';
            });
            if(item==1){
                $("#selec_materia").html(html);
            }else{
                $("#selec_empaque").html(html);
            }
            
        }
    });
}

$("#form_detalle_proceso").submit(function(e){
    e.preventDefault();
    $.ajax({
        url:servidor+'gfo/reportecostos/nuevoproceso',
        type:'post',
        data:$(this).serialize(),
        success:function(response){
            let indexjm=$("#tbl_procesos_produccion tbody tr:last").index();
            let new_index=indexjm+1;
            //console.log(new_index); return false;
            let item=JSON.parse(response);
            let html='<tr><td>'+item.codProceso+'</td><td>'+item.vNombreProceso+'</td><td><input type="hidden" name="data['+new_index+'][]" value="'+item.codProceso+'"><input type="hidden" name="data['+new_index+'][]" value="'+item.vNombreProceso+'">'+cargaMaquinas(item.maquinas,1,new_index)+'</td>'+inputs(new_index)+'<td><input type="text" class="jm" style="width:200px;" name="data['+new_index+'][]"></td><td><button type="button" class="btn btn-danger deljm">x</button></td></tr>';
            $("#tbl_procesos_produccion .bodyjm").append(html);
            $('#modal_proceso_nuevo').modal('hide');
            $(".selectorjm_maquinas").select2();

            $(".bodyjm .input_jm").focusin(function(){	   
                $(this).select();
            });

            $(".bodyjm .input_jm").keyup(function(e){
                mostrarjm();
            });

            $(".bodyjm14 .input_jm").focusin(function(){	   
                $(this).select();
            });

            $(".bodyjm14 .input_jm").keyup(function(e){
                mostrarjm();
            });

            $('.input_jm').on('input', function () { 
                this.value = this.value.replace(/[^0-9]/g,'');
            });
        }
    });
});

$("#form_detalle_materiaprima").submit(function(e){
    e.preventDefault();
    $.ajax({
        url:servidor+'gfo/reportecostos/nuevamateria',
        type:'post',
        data:$(this).serialize(),
        success:function(response){
            
            let item=JSON.parse(response);
            let html='<tr><td>'+item.ItemCode+'</td><td>'+item.ItemName+'</td>';
            html+='<td><input type="text" name="dataprima[]" value="'+item.costounidad+'"><input type="hidden" name="dataprima[]" value="'+item.ItemCode+'"><input type="hidden" name="dataprima[]" value="'+item.ItemName+'"></td>';
            html+='<td><input type="hidden" name="dataprima[]" value="'+item.BuyUnitMsr+'">'+item.BuyUnitMsr+'</td><td><input type="text" name="dataprima[]" value="'+item.calculo+'"></td>';
            $(".body_matprima").append(html);
            $('#modal_materiaprima').modal('hide');
        }
    });
});

$("#form_detalle_materiaempaque").submit(function(e){
    e.preventDefault();
    $.ajax({
        url:servidor+'gfo/reportecostos/nuevamateria',
        type:'post',
        data:$(this).serialize(),
        success:function(response){
            
            let item=JSON.parse(response);
            let html='<tr><td>'+item.ItemCode+'</td><td>'+item.ItemName+'</td>';
            html+='<td><input type="text" name="dataempaque[]" value="'+item.costounidad+'"><input type="hidden" name="dataempaque[]" value="'+item.ItemCode+'"><input type="hidden" name="dataempaque[]" value="'+item.ItemName+'"></td>';
            html+='<td><input type="hidden" name="dataempaque[]" value="'+item.tipo_calculo+'"><input type="hidden" name="dataempaque[]" value="'+item.BuyUnitMsr+'">'+item.BuyUnitMsr+'</td><td><input type="text" name="dataempaque[]" value="'+item.calculo+'"></td>';
            $(".body_matempaque").append(html);
            $('#modal_materiaempaque').modal('hide');
            $(this)[0].reset();
        }
    });
});

$("#form_detalle_procesofab").submit(function(e){
    e.preventDefault();
    $.ajax({
        url:servidor+'gfo/reportecostos/nuevoproceso',
        type:'post',
        data:$(this).serialize(),
        success:function(response){
            let indexjm=$("#tbl_procesos_acondicionado tbody tr:last").index();
            //let indexjm2=$("#tbl_procesos_produccion tbody tr:last").index();
            
            let new_index=indexjm+1;
            //console.log(new_index); return false;
            
            let item=JSON.parse(response);
            let html='<tr><td>'+item.codProceso+'</td><td>'+item.vNombreProceso+'</td><td><input type="hidden" name="dataacondicionado['+new_index+'][]" value="'+item.codProceso+'"><input type="hidden" name="dataacondicionado['+new_index+'][]" value="'+item.vNombreProceso+'">'+cargaMaquinas(item.maquinas,2,new_index)+'</td>'+inputsacon(new_index)+'<td><input type="text" class="jm" style="width:200px;" name="dataacondicionado['+new_index+'][]"></td><td><button type="button" class="btn btn-danger deljm14">x</button></td></tr>';
            
            $('#modal_proceso_nuevofab').modal('hide');
            $("#tbl_procesos_acondicionado .bodyjm14").append(html);
            $(".selectorjm_maquinas").select2();

            $(".bodyjm .input_jm").focusin(function(){	   
                $(this).select();
            });

            $(".bodyjm .input_jm").keyup(function(e){
                mostrarjm();
            });

            $(".bodyjm14 .input_jm").focusin(function(){	   
                $(this).select();
            });

            $(".bodyjm14 .input_jm").keyup(function(e){
                mostrarjm();
            });

            $('.input_jm').on('input', function () { 
                this.value = this.value.replace(/[^0-9]/g,'');
            });
        }
    });
});

function llenartablamoi(){
    let inputst='';
    let inputsp='';
    let inputsr='';

    for(let i=0;i<5;i++){
        inputst+='<td><input type="text" name="datamoi[tiempo]"></td>';
        inputsp+='<td><input type="text" name="datamoi[personas]"></td>';
        inputsr+='<td><input style="border:0;" type="text" name="datamoi[respuestas]"></td>';
    }

    let html='<tr><td>TIEMPO</td>'+inputst+'</tr>';
    html+='<tr><td># PERSONAS</td>'+inputsp+'</tr>';
    html+='<tr><td># VOLUMEN</td>'+inputsr+'</tr>';
    $(".body_moi").html(html);
}

function llenartablaotros1(){
    let inputst='';
    let inputsp='';
    let inputsr='';

    for(let i=0;i<4;i++){
        inputst+='<td><input type="text" name="dataotros[mp]"></td>';
        inputsp+='<td><input type="text" name="dataotros[excipientes]"></td>';
        inputsr+='<td><input type="text" name="dataotros[pt]"></td>';
    }

    let html='<tr><td>MATERIA PRIMA</td>'+inputst+'</tr>';
    html+='<tr><td>EXCIPIENTES</td>'+inputsp+'</tr>';
    html+='<tr><td>PROD. TERMINADOS</td>'+inputsr+'</tr>';
    $(".body_otros_1").html(html);
}


$("#add_otrojm").on('click',function(e){
    e.preventDefault();
    let selecttip='<select class="form-control" name="dataotros[data]"><option value="PP">PP</option><option value="MP">MP</option><option value="PT">PT</option></select>';
    let jm='<tr><td>'+selecttip+'</td><td><input type="text" name="dataotros[data]"></td><td><input type="text" name="dataotros[data]"></td>';
    jm+='<td><button class="btn btn-danger delotrojm">x</button></td></tr>'
    $(".body_otros_2").append(jm);
});

$("#add_matprimajm").on('click',function(e){

});

/*$("#selec_procesos").change(function(e){
    e.preventDefault();
    let cod=$(this).val();
    $.ajax({
        url:servidor+"gfo/reportecostos/getMaquinas",
        type:'post',
        data:{'cod':cod},
        success:function(response){
            let obj=JSON.parse(response);
            let html='<option value="na">N.A</option>';
            $.each(obj,function(i,item){
                html+='<option value="'+item.vCodigo+'">'+item.vCodigo+' - '+item.vNombre+'</option>';
            });
            $("#selec_maquinas").html(html);
        }
    });
});*/

$("#add_materiaprimajm").on('click',function(e){
    e.preventDefault();
    $("#selec_materia").select2();
    cargarmaterias(1);
    $('#modal_materiaprima').modal('show');    
});

$("#add_materiaempaque").on('click',function(e){
    e.preventDefault();
    $("#selec_empaque").select2();
    cargarmaterias(2);
    $('#modal_materiaempaque').modal('show');    
});

$("#add_proceso").on('click',function(e){
    e.preventDefault();
    $("#selec_procesos").select2();
    //$("#selec_maquinas").select2(); 
    
    $('#modal_proceso_nuevo').modal('show');

    cargarprocesos(1);
    /*let inputs='<tr>';
    inputs+='<td><input type="text" name="data[]" style="width:40px;"></td>';
    inputs+='<td><input type="text" name="data[]" style="width:150px;"></td>';
    inputs+='<td><input type="text" name="data[]" style="width:200px;"></td>';
    for(let i=0;i<7;i++){
        inputs+='<td><input type="number" name="data[]" style="width:50px;" value="0.00"></td>';
    }
    inputs+='<td><input type="text" name="data[]" style="width:200px;"></td>';
    inputs+='<td><button type="button" class="btn btn-danger deljm">x</button></td>';
    inputs+='</tr>';
    $("#tbl_procesos_produccion .bodyjm").append(inputs);*/
});

$("#add_procesojm").on('click',function(e){
    e.preventDefault();

    $("#selec_procesosfab").select2();
    //$("#selec_maquinas").select2(); 
    
    $('#modal_proceso_nuevofab').modal('show');

    cargarprocesos(2);
    /*let inputs='<tr>';
    
    inputs+='<td><input type="text" name="dataacondicionado[]" style="width:40px;"></td>';
    inputs+='<td><input type="text" name="dataacondicionado[]" style="width:150px;"></td>';
    inputs+='<td><input type="text" name="dataacondicionado[]" style="width:200px;"></td>';
    for(let i=0;i<7;i++){
        inputs+='<td><input type="number" name="dataacondicionado[]" style="width:50px;" value="0.00"></td>';
    }
    inputs+='<td><input type="text" name="dataacondicionado[]" style="width:200px;"></td>';
    inputs+='<td><button type="button" class="btn btn-danger deljm14">x</button></td>';
    inputs+='</tr>';
    $("#tbl_procesos_acondicionado .bodyjm14").append(inputs);*/
});

$(document).on('click',"#btnNuevo",function(e){
    e.preventDefault();
    
    let granel=$("#lisPrincipios").val();
    llenartablamoi();
    llenartablaotros1();
    if(granel!=''){
        $(".cabecera_data").css('display','inline-block');
        $(".cabecera_data").css('width','100%');
        cargardata();
        cargardataacon();
    }else{
        alert("Seleccione un granulado");
    }
});





function cargardata(){
    let granel=$("#lisPrincipios").val();

        
        $.ajax({
            url:servidor+"gfo/reportecostos/getRuta",
            type:'post',
            data:{'granel':granel},
            success:function(response){
                let tab=JSON.parse(response);
                let html='';
                let html14='';
                $.each(tab,function(i,item){
                        html+='<tr><td>'+item.codProceso+'</td><td>'+item.vNombreProceso+'</td><td style="width:200px;"><input type="hidden" name="data['+i+'][]" value="'+item.codProceso+'"><input type="hidden" name="data['+i+'][]" value="'+item.vNombreProceso+'">'+cargaMaquinas(item.maquinas,1,i)+'</td>'+inputs(i)+'<td><input type="text" class="jm" style="width:150px;" name="data['+i+'][]"></td><td><button type="button" class="btn btn-danger deljm">x</button></td></tr>';
                    $(".selectorjm").select2();
                });
                $(".bodyjm").html(html);
                $(".selectorjm_maquinas").select2();

                $(".bodyjm .input_jm").focusin(function(){	   
                    $(this).select();
                });

                $(".bodyjm .input_jm").keyup(function(e){
                    let valor=$(this).val();
                    if(valor==''){
                        $(this).val(0);
                    }
                    mostrarjm();
                });

                $('.input_jm').on('input', function () { 
                    this.value = this.value.replace(/[^0-9]/g,'');
                });


            }
        });
       

}

function cargardataacon(){
    let granel=$("#lisPrincipios").val();
    
        
        $.ajax({
            url:servidor+"gfo/reportecostos/getRutajm",
            type:'post',
            data:{'granel':granel},
            success:function(response){
                let tab=JSON.parse(response);
                let html='';
                let html14='';
                $.each(tab,function(i,item){
                    html+='<tr><td>'+item.codProceso+'</td><td>'+item.vNombreProceso+'</td><td style="width:200px;"><input type="hidden" name="dataacondicionado['+i+'][]" value="'+item.codProceso+'"><input type="hidden" name="dataacondicionado['+i+'][]" value="'+item.vNombreProceso+'">'+cargaMaquinas(item.maquinas,2,i)+'</td>'+inputsacon(i)+'<td><input type="text" class="jm" style="width:150px;" name="dataacondicionado['+i+'][]"></td><td><button type="button" class="btn btn-danger deljm14">x</button></td></tr>';
                    $(".selectorjm").select2();
                });
                $(".bodyjm14").html(html);
                $(".selectorjm_maquinas").select2();


                $(".bodyjm14 .input_jm").focusin(function(){	   
                    $(this).select();
                });

                $(".bodyjm14 .input_jm").keyup(function(e){
                    let valor=$(this).val();
                    if(valor==''){
                        $(this).val(0);
                    }
                    mostrarjm();
                });

                $('.input_jm').on('input', function () { 
                    this.value = this.value.replace(/[^0-9]/g,'');
                });


            }
        });
       

}

function mostrarjm(){
    /*let jm14=$("#form_costos").serialize();
    console.log(jm14); return false;*/
    $.ajax({
        url: servidor+"gfo/reportecostos/calculardata",
        type: 'post',
        data: $("#form_costos").serialize(),
        success:function(response){
            let obj=JSON.parse(response);
            //for(let i=2;i<=9;i++){
            $('#tbl_procesos_produccion .total_fab_2').text(obj.sum_2);
            $('#tbl_procesos_produccion .total_fab_3').text(obj.sum_3);
            $('#tbl_procesos_produccion .total_fab_4').text(obj.sum_4);
            $('#tbl_procesos_produccion .total_fab_5').text(obj.sum_5);
            $('#tbl_procesos_produccion .total_fab_6').text(obj.sum_6);
            $('#tbl_procesos_produccion .total_fab_7').text(obj.sum_7);
            $('#tbl_procesos_produccion .total_fab_8').text(obj.sum_8);
            $('#tbl_procesos_produccion .total_fab_9').text(obj.sum_9);
            //}
            //$('#tbl_procesos_produccion .total_fab_2').text("jm");
            $('#tbl_procesos_acondicionado .total_aco_2').text(obj.sum2_2);
            $('#tbl_procesos_acondicionado .total_aco_3').text(obj.sum2_3);
            $('#tbl_procesos_acondicionado .total_aco_4').text(obj.sum2_4);
            $('#tbl_procesos_acondicionado .total_aco_5').text(obj.sum2_5);
            $('#tbl_procesos_acondicionado .total_aco_6').text(obj.sum2_6);
            $('#tbl_procesos_acondicionado .total_aco_7').text(obj.sum2_7);
            $('#tbl_procesos_acondicionado .total_aco_8').text(obj.sum2_8);
            $('#tbl_procesos_acondicionado .total_aco_9').text(obj.sum2_9);
            let totalsubhh=obj.sub_hhprod;
            //console.log(totalsubhh.length);
            for(let i=0;i<totalsubhh.length;i++){
                $("#tbl_procesos_produccion .subhh"+i+"").val(totalsubhh[i]);
            }

            let totalsubhm=obj.sub_hmprod;
            //console.log(totalsubhh.length);
            for(let i=0;i<totalsubhm.length;i++){
                $("#tbl_procesos_produccion .subhm"+i+"").val(totalsubhm[i]);
            }

            //$("#tbl_procesos_acondicionado .subhha7").val(14);
            //let indexjm=($("#tbl_procesos_produccion tbody tr:last").index()+1);
            //console.log(indexjm); 
            let totalsubhhacon=obj.sub_hhacon;
            //console.log(totalsubhh.length);
            for(let i=0;i<totalsubhhacon.length;i++){
                $("#tbl_procesos_acondicionado .subhha"+i+"").val(totalsubhhacon[i]);
            }

            let totalsubhmacon=obj.sub_hmacon;
            //console.log(totalsubhh.length);
            for(let i=0;i<totalsubhmacon.length;i++){
                $("#tbl_procesos_acondicionado .subhma"+i+"").val(totalsubhmacon[i]);
            }

            //mostrarjm();
        }
    });
}

function cargaMaquinas(maquinas,item,mich){

    let resp=(item==1 ? 'data['+mich+'][maq][]' : 'dataacondicionado['+mich+'][maq][]');
    
    let jm='<select name="'+resp+'" class="form-control selectorjm_maquinas" multiple style="width:100%;">';
    jm+='<option value="na">N.A</option>';
    for(let i=0;i<maquinas.length;i++){
        jm+='<option value="'+maquinas[i]['vCodigo']+'">'+maquinas[i]['vCodigo']+'-'+maquinas[i]['vNombre']+'</option>';
    }
    jm+='</select>';
    return jm;
}



$("body").on("click",".bodyjm .deljm",function(e){
    e.preventDefault();
    $(this).parent().parent().remove();
    mostrarjm();
});

$("body").on("click",".body_otros_2 .delotrojm",function(e){
    e.preventDefault();
    $(this).parent().parent().remove();
});

$("body").on("click",".bodyjm14 .deljm14",function(e){
    e.preventDefault();
    $(this).parent().parent().remove();
    mostrarjm();
});

$("#calcularjm").on("click",function(e){
    e.preventDefault();
    $.ajax({
        url : servidor +"gfo/reportecostos/regDatos",
        type: 'post',
        data: $("#form_costos").serialize()+"&user="+sessionStorage.idusuario,
        success:function(response){

        }
    });
});
