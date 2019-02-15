$("#procesarmod").on("click",function(e){
    e.preventDefault();
    cargar_modjm();   
    $("#modal_calculos_mod").modal('show');
});

function cargar_modjm(){
    $(".trfoot").html('<td colspan="25">TOTAL : </td>');
    let datafab=eval($("#datafabrica_para_proceso").val());
    try{
        for(var i=0;i<datafab.length;i++){
            while(datafab[i]['nSetupHH'] == null || datafab[i]['codMaquina'] == null || datafab[i]['codMaquina'] == ""){
                datafab.splice(i,1);
            }
        }
    }catch(err){

    }
    var html='';
    var sumt=0;
    var sumu=0;
    let lote=$("#num_lote").val();
    let unidadjm=0;
    $.each(datafab,function(i,item){
        html+='<tr>';
        html+='<td>'+item.vNombreProceso+'</td>';
        html+='<td>'+item.codMaquina+'</td>';
        html+='<td>'+item.nSetupHH+'</td>';   
        html+='<td>'+item.nProcesoHH+'</td>';
        html+='<td>'+item.nProcesoHM+'</td>';
        html+='<td>'+item.nLimpiezaMaq+'</td>';
        html+='<td>'+item.nLimpiezaAre+'</td>';   
        html+='<td>'+item.nOperadores+'</td>';
        html+='<td>'+item.nSubtotalHH+'</td>';
        html+='<td>'+item.nSubtotalHM+'</td>';
        html+='<td>'+item.nSubtotalHP+'</td>';   
        html+='<td>'+(item.vObservacion == null ? '' : item.vObservacion)+'</td>';
        html+='<td>'+(item.proc_1==null ? 0 : parseFloat(item.proc_1).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_2==null ? 0 : parseFloat(item.proc_2).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_3==null ? 0 : parseFloat(item.proc_3)).toFixed(6)+'</td>';   
        html+='<td>'+(item.proc_4==null ? 0 : parseFloat(item.proc_4).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_5==null ? 0 : parseFloat(item.proc_5).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_6==null ? 0 : parseFloat(item.proc_6).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_7==null ? 0 : parseFloat(item.proc_7).toFixed(6))+'</td>';   
        html+='<td>'+(item.proc_8==null ? 0 : parseFloat(item.proc_8).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_9==null ? 0 : parseFloat(item.proc_9).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_10==null ? 0 : parseFloat(item.proc_10).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_11==null ? 0 : parseFloat(item.proc_11).toFixed(6))+'</td>';   
        html+='<td>'+(item.proc_12==null ? 0 : parseFloat(item.proc_12).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_13==null ? 0 : parseFloat(item.proc_13).toFixed(6))+'</td>';
        html+='<td><strong>'+(item.total == null ? 0 : parseFloat(item.total).toFixed(6))+'</strong></td>';
        unidadjm=parseFloat(item.total/lote).toFixed(6);
        html+='<td><strong>'+unidadjm+'</strong></td>';
        html+='</tr>';
        totales=(item.total==null ? 0 : item.total);
        sumt+=parseFloat(totales);
        sumu+=parseFloat(unidadjm);
    });
    localStorage.setItem("total_mod_fab_fin",parseFloat(sumt).toFixed(6));
    sumt=parseFloat(sumt).toFixed(6);
    sumu=parseFloat(sumu).toFixed(6);
    var foot='<td><strong>'+sumt+'</strong></td><td><strong>'+sumu+'</strong></td>'
    $(".trfoot").append(foot);
    $(".body_fabricacion_proceso").html(html);
}


$(".exportarjm").on("click",function(e){
    e.preventDefault();
    alert("Aun no joven");
});

$("#procesarmod_acon").on("click",function(e){
    e.preventDefault();
    $(".trfoot_acon").html('<td colspan="25">TOTAL : </td>');
    let dataacon=eval($("#dataacondicionado_para_proceso").val());
    try{
        for(var i=0;i<dataacon.length;i++){
            while(dataacon[i]['nSetupHH'] == null || dataacon[i]['codMaquina']== ""){
                dataacon.splice(i,1);
            }
        }
    }catch(err){
    }
    dataacon.splice((dataacon.length-1),1);
    var html='';
    var sumt=0;
    var sumu=0;
    let lote=$("#num_cant_cabecera").val();
    let unidadjm=0;
    $.each(dataacon,function(i,item){
        html+='<tr>';
        html+='<td>'+item.vNombreProceso+'</td>';
        html+='<td>'+item.codMaquina+'</td>';
        html+='<td>'+item.nSetupHH+'</td>';   
        html+='<td>'+item.nProcesoHH+'</td>';
        html+='<td>'+item.nProcesoHM+'</td>';
        html+='<td>'+item.nLimpiezaMaq+'</td>';
        html+='<td>'+item.nLimpiezaAre+'</td>';   
        html+='<td>'+item.nOperadores+'</td>';
        html+='<td>'+item.nSubtotalHH+'</td>';
        html+='<td>'+item.nSubtotalHM+'</td>';
        html+='<td>'+item.nSubtotalHP+'</td>';  
        html+='<td>'+(item.vObservacion == null ? '' : item.vObservacion)+'</td>';
        html+='<td>'+(item.proc_1==null ? 0 : parseFloat(item.proc_1).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_2==null ? 0 : parseFloat(item.proc_2).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_3==null ? 0 : parseFloat(item.proc_3)).toFixed(6)+'</td>';   
        html+='<td>'+(item.proc_4==null ? 0 : parseFloat(item.proc_4).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_5==null ? 0 : parseFloat(item.proc_5).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_6==null ? 0 : parseFloat(item.proc_6).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_7==null ? 0 : parseFloat(item.proc_7).toFixed(6))+'</td>';   
        html+='<td>'+(item.proc_8==null ? 0 : parseFloat(item.proc_8).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_9==null ? 0 : parseFloat(item.proc_9).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_10==null ? 0 : parseFloat(item.proc_10).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_11==null ? 0 : parseFloat(item.proc_11).toFixed(6))+'</td>';   
        html+='<td>'+(item.proc_12==null ? 0 : parseFloat(item.proc_12).toFixed(6))+'</td>';
        html+='<td>'+(item.proc_13==null ? 0 : parseFloat(item.proc_13).toFixed(6))+'</td>';
        unidadjm=parseFloat(item.total/lote).toFixed(6);
        html+='<td><strong>'+(item.total == null ? 0 : parseFloat(item.total).toFixed(6))+'</strong></td>';
        html+='<td><strong>'+unidadjm+'</strong></td>';
        html+='</tr>';
        totales=(item.total==null ? 0 : item.total);
        sumt+=parseFloat(totales);
        sumu+=parseFloat(unidadjm);
    });
    sumt=parseFloat(sumt).toFixed(6);
    sumu=parseFloat(sumu).toFixed(6);
    var foot='<td><strong>'+sumt+'</strong></td><td><strong>'+sumu+'</strong></td>'
    $(".trfoot_acon").append(foot);
    $(".body_fabricacion_proceso_acon").html(html);   
    $("#modal_calculos_mod_acon").modal('show');
});

function calcular_moi(){
    var jsonjm=$("#datamoi").val();
    if(jsonjm=="" || jsonjm==null){
        alertify.error("Realice primero alguna acción");
    }
        var datamoi=JSON.parse(jsonjm);
        var fab='';
        var acon='';
        var pp='';
        var pt='';
        var mp='';
        var datafabricacion=JSON.parse(localStorage.getItem("ratios_moi_fab"));
        var dataacondicionado=JSON.parse(localStorage.getItem("ratios_moi_acon"));
        var dataapp=JSON.parse(localStorage.getItem("ratios_moi_pp"));
        var dataapt=JSON.parse(localStorage.getItem("ratios_moi_pt"));
        var dataamp=JSON.parse(localStorage.getItem("ratios_moi_mp"));
        var totfab=0;
        var unifab=0;
        var sumtot_fab=0;
        var sumun_fab=0;
        var totacon=0;
        var uniacon=0;
        var sumtot_acon=0;
        var sumun_acon=0;
        var totpp=0;
        var sumtot_pp=0;
        var totpt=0;
        var sumtot_pt=0;
        var totmp=0;
        var sumtot_mp=0;
        $.each(datafabricacion,function(i,item){
            fab+='<tr><td>'+item.nom+'</td><td>'+parseFloat(item.dato)+'</td>';
            fab+='<td>'+(datamoi[0].datofab)+'</td><td>'+(datamoi[1].datofab)+'</td><td>'+(datamoi[2].datofab)+'</td>';
            totfab=(parseFloat(item.dato)*parseFloat(datamoi[0].datofab)*parseFloat(datamoi[1].datofab));
            unifab=(totfab/parseFloat(datamoi[2].datofab));
            fab+='<td><strong>'+totfab.toFixed(6)+'</strong></td><td><strong>'+unifab.toFixed(6)+'</strong></td></tr>';
            sumtot_fab+=totfab;
            sumun_fab+=unifab;
        });
        localStorage.setItem("total_moi_fab_fin",sumtot_fab.toFixed(6));
        $.each(dataacondicionado,function(i,item){
            acon+='<tr><td>'+item.nom+'</td><td>'+parseFloat(item.dato)+'</td>';
            acon+='<td>'+(datamoi[0].datoacon)+'</td><td>'+(datamoi[1].datoacon)+'</td><td>'+(datamoi[2].datoacon)+'</td>';
            totacon=(parseFloat(item.dato)*parseFloat(datamoi[0].datoacon)*parseFloat(datamoi[1].datoacon));
            uniacon=(totacon/parseFloat(datamoi[2].datoacon));
            acon+='<td><strong>'+totacon.toFixed(6)+'</strong></td><td><strong>'+uniacon.toFixed(6)+'</strong></td></tr>';
            sumtot_acon+=totacon;
            sumun_acon+=uniacon;
        });
        localStorage.setItem("total_moi_acon_fin",sumtot_acon.toFixed(6));
        $.each(dataapp,function(i,item){
            pp+='<tr><td>'+item.nom+'</td><td>'+parseFloat(item.dato)+'</td>';
            pp+='<td>'+(datamoi[0].datolabpp)+'</td><td>'+(datamoi[1].datolabpp)+'</td><td>'+(datamoi[2].datolabpp)+'</td>';
            totpp=(parseFloat(item.dato)*parseFloat(datamoi[0].datolabpp)*parseFloat(datamoi[1].datolabpp/60));
            pp+='<td><strong>'+totpp.toFixed(6)+'</strong></td></tr>';
            sumtot_pp+=totpp;
        });
        $.each(dataapt,function(i,item){
            pt+='<tr><td>'+item.nom+'</td><td>'+parseFloat(item.dato)+'</td>';
            pt+='<td>'+(datamoi[0].datolabpt)+'</td><td>'+(datamoi[1].datolabpt)+'</td><td>'+(datamoi[2].datolabpt)+'</td>';
            totpt=(parseFloat(item.dato)*parseFloat(datamoi[0].datolabpt)*parseFloat(datamoi[1].datolabpt/60));
            pt+='<td><strong>'+totpt.toFixed(6)+'</strong></td></tr>';
            sumtot_pt+=totpt;
        });
        $.each(dataamp,function(i,item){
            mp+='<tr><td>'+item.nom+'</td><td>'+parseFloat(item.dato)+'</td>';
            mp+='<td>'+(datamoi[0].datolabmp)+'</td><td>'+(datamoi[1].datolabmp)+'</td><td>'+(datamoi[2].datolabmp)+'</td>';
            totmp=(parseFloat(item.dato)*parseFloat(datamoi[0].datolabmp)*parseFloat(datamoi[1].datolabmp/60));
            mp+='<td><strong>'+totmp.toFixed(6)+'</strong></td></tr>';
            sumtot_mp+=totmp;
        });
        let sumalabs=parseFloat(sumtot_pp)+parseFloat(sumtot_pt)+parseFloat(sumtot_mp);
        localStorage.setItem("total_labs_fin",sumalabs.toFixed(6));
        $(".body_moi_fabricacion").html(fab);
        $(".body_moi_acondicionado").html(acon);
        $(".body_moi_pp").html(pp);
        $(".body_moi_pt").html(pt);
        $(".body_moi_mp").html(mp);
        var fabfoot='<td colspan="5">TOTAL : </td><td><strong>'+sumtot_fab.toFixed(6)+'</strong></td><td><strong>'+sumun_fab.toFixed(6)+'</strong></td>';
        $(".foot_moi_fabricacion").html(fabfoot);
        var fabfootacon='<td colspan="5">TOTAL : </td><td><strong>'+sumtot_acon.toFixed(6)+'</strong></td><td><strong>'+sumun_acon.toFixed(6)+'</strong></td>';
        $(".foot_moi_acondicionado").html(fabfootacon);
        var fabfootpp='<td colspan="5">TOTAL : </td><td><strong>'+sumtot_pp.toFixed(6)+'</strong></td>';
        $(".foot_moi_pp").html(fabfootpp);
        var fabfootpt='<td colspan="5">TOTAL : </td><td><strong>'+sumtot_pt.toFixed(6)+'</strong></td>';
        $(".foot_moi_pt").html(fabfootpt);
        var fabfootmp='<td colspan="5">TOTAL : </td><td><strong>'+sumtot_mp.toFixed(6)+'</strong></td>';
        $(".foot_moi_mp").html(fabfootmp);
}

$("#procesarmoi").on("click",function(e){
    e.preventDefault();
    var valid=$("#valid_moi").val();
    if(valid==1){
        calcular_moi();   
        $("#modal_calculos_moi").modal("show");
    }else if(valid==2){
        alertify.error('Ingresar datos correctos');
    }else{
        alertify.error('Llenar todos los datos en la tabla');
    }
});

$(" #ver_otros_2").on("click",function(e){
    e.preventDefault();
    let dataproceso=eval($("#data_proceso_otros2").val());
    let depre=JSON.parse(localStorage.getItem("depreciacion"));
    try{
        for(var i=0;i<(dataproceso.length);i++){
            while(dataproceso[i].dHoramaq == null || dataproceso[i].dHoramaq == "" || dataproceso[i].vArea != 'PP'){
                dataproceso.splice(i,1);
            }
        }
    }catch(err){
    }
    let html="";
    let costojm=0;
    let sumjm=0;
    $.each(dataproceso,function(i,item){
        html+='<tr><td>'+item.vArea+'</td><td>'+item.vMaquina+'</td>';
        costojm=((item.dHoramaq*depre.prod)/60).toFixed(4);
        sumjm+=parseFloat(costojm);
        html+='<td>'+item.dHoramaq+'</td><td>'+depre.prod+'</td><td><strong>'+costojm+'</strong></td></tr>';
    });
    localStorage.setItem("total_otros2_fin",sumjm.toFixed(6));
    $(".body_otros_2_proceso").html(html);
    var fabfoot='<td colspan="4">TOTAL : </td><td><strong>'+sumjm.toFixed(6)+'</strong></td>';
    $(".foot_otros_2").html(fabfoot);
    $("#modal_calculos_otros_2").modal("show");
});

$("#ver_otros_3").on("click",function(e){
    e.preventDefault();
    let dataproceso=eval($("#data_proceso_otros3").val());
    let depre=JSON.parse(localStorage.getItem("depreciacion"));
    try{
        for(var i=0;i<(dataproceso.length);i++){
            while(dataproceso[i].dHoramaq == null || dataproceso[i].dHoramaq == "" || dataproceso[i].vArea != 'MP'){
                dataproceso.splice(i,1);
            }
        }
    }catch(err){
    }
    let html="";
    let costojm=0;
    let sumjm=0;
    $.each(dataproceso,function(i,item){
        html+='<tr><td>'+item.vArea+'</td><td>'+item.vMaquina+'</td>';
        costojm=((item.dHoramaq*depre.cont)/60).toFixed(4);
        sumjm+=parseFloat(costojm);
        html+='<td>'+item.dHoramaq+'</td><td>'+depre.cont+'</td><td><strong>'+costojm+'</strong></td></tr>';
    });
    $(".body_otros_3_proceso").html(html);
    localStorage.setItem("total_otros3_fin",sumjm.toFixed(6));
    var fabfoot='<td colspan="4">TOTAL : </td><td><strong>'+sumjm.toFixed(6)+'</strong></td>';
    $(".foot_otros_3").html(fabfoot);
    $("#modal_calculos_otros_3").modal("show");
});

$("#ver_otros_4").on("click",function(e){
    e.preventDefault();
    let dataproceso=eval($("#data_proceso_otros4").val());
    let depre=JSON.parse(localStorage.getItem("depreciacion"));
    try{
        for(var i=0;i<(dataproceso.length);i++){
            while(dataproceso[i].dHoramaq == null || dataproceso[i].dHoramaq == "" || dataproceso[i].vArea != 'PT'){
                dataproceso.splice(i,1);
            }
        }
    }catch(err){
    }
    let html="";
    let costojm=0;
    let sumjm=0;
    $.each(dataproceso,function(i,item){
        html+='<tr><td>'+item.vArea+'</td><td>'+item.vMaquina+'</td>';
        costojm=((item.dHoramaq*depre.cont)/60).toFixed(4);
        sumjm+=parseFloat(costojm);
        html+='<td>'+item.dHoramaq+'</td><td>'+depre.cont+'</td><td><strong>'+costojm+'</strong></td></tr>';
    });
    $(".body_otros_4_proceso").html(html);
    localStorage.setItem("total_otros4_fin",sumjm.toFixed(6));
    var fabfoot='<td colspan="4">TOTAL : </td><td><strong>'+sumjm.toFixed(6)+'</strong></td>';
    $(".foot_otros_4").html(fabfoot);
    $("#modal_calculos_otros_4").modal("show");
});

function cargarjm5(){
    let dataproceso=eval($("#data_proceso_otros5").val());
    let depre=JSON.parse(localStorage.getItem("depreciacion"));
    try{
        for(var i=0;i<(dataproceso.length);i++){
            while(dataproceso[i].tipo == null || dataproceso[i].tipo == ""){
                dataproceso.splice(i,1);
            }
        }
    }catch(err){
    }
    let html="";
    let lote=$("#num_lote").val();
    let cantidad=$("#num_cant_cabecera").val();
    let volumen;
    let costojm=0;
    let sumjm=0;
    $.each(dataproceso,function(i,item){
        if(item.tipo=='Fabricacion'){
            volumen=lote;
        }else{
            volumen=cantidad;
        }
        html+='<tr><td>'+item.vMaquina+'</td><td>'+item.tipo+'</td>';
        costojm=((item.dHoramaq*depre.prod*volumen)/60).toFixed(4);
        sumjm+=parseFloat(costojm);
        html+='<td>'+item.dHoramaq+'</td><td>'+depre.prod+'</td><td>'+volumen+'</td><td><strong>'+costojm+'</strong></td></tr>';
    });
    $(".body_otros_5_proceso").html(html);
    localStorage.setItem("total_otros5_fin",sumjm.toFixed(6));
    var fabfoot='<td colspan="4">TOTAL : </td><td><strong>'+sumjm.toFixed(6)+'</strong></td>';
    $(".foot_otros_5").html(fabfoot);
}

$("#ver_otros_5").on("click",function(e){
    e.preventDefault();   
    cargarjm5();
    $("#modal_calculos_otros_5").modal("show");
});

$("#procesarmateriaprima").on("click",function(e){
    e.preventDefault();
    $(".trfoot_matprima").html('<td colspan="5">TOTAL : </td>');
    let datamateriaprima=eval($("#data_proceso_materiaprima").val());    
    try{
        for(var i=0;i<datamateriaprima.length;i++){
            while(datamateriaprima[i]['codMateria']==null || datamateriaprima[i]['codMateria']==""){
                datamateriaprima.splice(i,1);
            }
        }
    }catch(err){

    }
    let html="";
    let sumt=0;
    let lote=$("#num_lote").val();
    $.each(datamateriaprima,function(i,item){
        html+='<tr><td>'+item.codMateria+'</td><td>'+item.vNombreMateria+'</td>';
        html+='<td>'+item.nCostoUnidad+'</td><td>'+item.vUnidadMedida+'</td><td>'+item.dCalculo+'</td><td><strong>'+parseFloat(item.nCostoUnidad*item.dCalculo*lote).toFixed(4)+'</strong></td></tr>';
        sumt+=parseFloat(item.nCostoUnidad*item.dCalculo*lote);
    });
    $(".body_materiaprima_proceso").html(html);
    var foot='<td><strong>'+sumt.toFixed(4)+'</strong></td>'
    $(".trfoot_matprima").append(foot);
    $("#modal_calculos_materiaprima").modal("show");
});

$("#procesarmateriaempaque").on("click",function(e){
    e.preventDefault();
    $(".trfoot_matempaque").html('<td colspan="5">TOTAL : </td>');
    let datamateriaempaque=eval($("#data_proceso_materiaempaque").val());
    let cant=$("#num_cant_cabecera").val();    
    try{
        for(var i=0;i<datamateriaempaque.length;i++){
            while(datamateriaempaque[i]['codMateria']==null || datamateriaempaque[i]['codMateria']==""){
                datamateriaempaque.splice(i,1);
            }
        }
    }catch(err){
    }
    let html="";
    let sumt=0;
    $.each(datamateriaempaque,function(i,item){
        html+='<tr><td>'+item.codMateria+'</td><td>'+item.vNombreMateria+'</td>';
        html+='<td>'+item.nCostoUnidad+'</td><td>'+item.vUnidadMedida+'</td><td>'+item.dCalculo+'</td><td><strong>'+parseFloat(item.nCostoUnidad*item.dCalculo*cant).toFixed(4)+'</strong></td></tr>';
        sumt+=parseFloat(item.nCostoUnidad*item.dCalculo*cant);
    });
    $(".body_materiaempaque_proceso").html(html);   
    var foot='<td><strong>'+sumt.toFixed(4)+'</strong></td>'  
    $(".trfoot_matempaque").append(foot);
    $("#modal_calculos_materiaempaque").modal("show");
});

$("#calcularjm").click(function(e){
    e.preventDefault();
    let lote=$("#num_lote").val();
    let cant=$("#num_cant_cabecera").val();
    let materiaprima=(parseFloat(localStorage.getItem("total_materia_prima_fin")*lote).toFixed(6));
    let materiaempaque=(parseFloat(localStorage.getItem("total_materia_empaque_fin")*cant).toFixed(6));
    let total=(parseFloat(materiaprima)+parseFloat(materiaempaque)).toFixed(6);
    calcular_moi();
    cargar_modjm();
    let total_mod=(parseFloat(localStorage.getItem("total_moi_fab_fin"))+parseFloat(localStorage.getItem("total_mod_fab_fin")));
    let total_moda=(parseFloat(localStorage.getItem("total_moi_acon_fin"))+parseFloat(localStorage.getItem("total_mod_acon_fin")));
    let total_otros=(parseFloat(localStorage.getItem("total_labs_fin"))+parseFloat(localStorage.getItem("total_otros2_fin"))+parseFloat(localStorage.getItem("total_otros3_fin"))+parseFloat(localStorage.getItem("total_otros4_fin"))+parseFloat(localStorage.getItem("total_otros5_fin"))+parseFloat(localStorage.getItem("total_insumos_fin"))+parseFloat(localStorage.getItem("total_otros1_fin")));
    let gasto_admin=((parseFloat(total)+parseFloat(total_mod)+parseFloat(total_moda)+parseFloat(total_otros))*30.40/100).toFixed(6);
    let costo_batch=(parseFloat(total)+parseFloat(total_mod)+parseFloat(total_moda)+parseFloat(total_otros)+parseFloat(gasto_admin)).toFixed(6);              
        if(localStorage.getItem("total_materia_prima_fin")==undefined || localStorage.getItem("total_materia_prima_fin")=="NaN" || localStorage.getItem("total_materia_empaque_fin")=="NaN" ||
    localStorage.getItem("total_moi_fab_fin")=="NaN" || localStorage.getItem("total_moi_acon_fin")=="NaN" ||
    localStorage.getItem("total_otros2_fin")=="0.000000" || localStorage.getItem("total_otros3_fin")=="0.000000" ||
    localStorage.getItem("total_otros4_fin")=="0.000000" || localStorage.getItem("total_otros5_fin")=="0.000000"){
        alertify.error("Llena todas las tablas");
    }else{
        let html='';
        html+='<div class="row static-info"><div class="col-md-5 name"> Materia prima : </div><div class="col-md-7 value"> '+materiaprima+' ('+(parseFloat(materiaprima/total)*100).toFixed(6)+' %)'+'</div></div>';
        html+='<div class="row static-info"><div class="col-md-5 name">  Material de empaque : </div><div class="col-md-7 value"> '+materiaempaque+' ('+(parseFloat(materiaempaque/total)*100).toFixed(6)+' %)'+'</div></div>';
        html+='<div class="row static-info"><div class="col-md-5 name"> Total de materias :  </div><div class="col-md-7 value"> '+total+'</div></div>';
        html+='<div class="row static-info"><div class="col-md-5 name"> Mano de obra de fabricación : </div><div class="col-md-7 value"> '+parseFloat(total_mod).toFixed(6)+'</div></div>';
        html+='<div class="row static-info"><div class="col-md-5 name"> Mano de obra acondicionado :  </div><div class="col-md-7 value"> '+parseFloat(total_moda).toFixed(6)+'</div></div>';
        html+='<div class="row static-info"><div class="col-md-5 name"> Otros indirectos :  </div><div class="col-md-7 value"> '+parseFloat(total_otros).toFixed(6)+'</div></div>';
        html+='<div class="row static-info"><div class="col-md-5 name"> Gastos administrativos : </div><div class="col-md-7 value"> '+parseFloat(gasto_admin).toFixed(6)+'</div></div>';
        html+='<hr><div class="row static-info"><div class="col-md-5 name"><strong>COSTO BATCH : </strong></div><div class="col-md-7 value" style="font-size:20px;"> <strong>'+parseFloat(costo_batch).toFixed(6)+'</strong></div></div>';
        html+='<hr><div class="row static-info"><div class="col-md-5 name"><strong>COSTO PRESENTACION : </strong></div><div class="col-md-7 value" style="font-size:20px;"> <strong>'+(parseFloat(costo_batch)/cant).toFixed(6)+'</strong></div></div>';
        html+='<hr><div class="row static-info"><div class="col-md-5 name"><strong>COSTO UNIDAD : </strong></div><div class="col-md-7 value" style="font-size:20px;"> <strong>'+(parseFloat(costo_batch)/lote).toFixed(6)+'</strong></div></div>';
        $(".body_final_reporte").html(html);

        $("#modal_reporte_final").modal("show");
    }
});

function generarresumen(){
    $("#main-btn-resumen").on("click",function(e){
        e.preventDefault();
        let lote=$("#num_lote").val();
        let cant=$("#num_cant_cabecera").val();
        let materiaprima=(parseFloat(localStorage.getItem("total_materia_prima_fin")*lote).toFixed(6));
        let materiaempaque=(parseFloat(localStorage.getItem("total_materia_empaque_fin")*cant).toFixed(6));       
            let total=(parseFloat(materiaprima)+parseFloat(materiaempaque)).toFixed(6);
            calcular_moi();
            cargar_modjm();
            let total_mod=(parseFloat(localStorage.getItem("total_moi_fab_fin"))+parseFloat(localStorage.getItem("total_mod_fab_fin")));
            let total_moda=(parseFloat(localStorage.getItem("total_moi_acon_fin"))+parseFloat(localStorage.getItem("total_mod_acon_fin")));
            let total_otros=(parseFloat(localStorage.getItem("total_labs_fin"))+parseFloat(localStorage.getItem("total_otros2_fin"))+parseFloat(localStorage.getItem("total_otros3_fin"))+parseFloat(localStorage.getItem("total_otros4_fin"))+parseFloat(localStorage.getItem("total_otros5_fin"))+parseFloat(localStorage.getItem("total_insumos_fin"))+parseFloat(localStorage.getItem("total_otros1_fin")));
            let gasto_admin=((parseFloat(total)+parseFloat(total_mod)+parseFloat(total_moda)+parseFloat(total_otros))*30.40/100).toFixed(6);
            let costo_batch=(parseFloat(total)+parseFloat(total_mod)+parseFloat(total_moda)+parseFloat(total_otros)+parseFloat(gasto_admin)).toFixed(6);
            
            
            if(localStorage.getItem("total_materia_prima_fin")==undefined || localStorage.getItem("total_materia_prima_fin")=="NaN" || localStorage.getItem("total_materia_empaque_fin")=="NaN" ||
        localStorage.getItem("total_moi_fab_fin")=="NaN" || localStorage.getItem("total_moi_acon_fin")=="NaN" ||
        localStorage.getItem("total_otros2_fin")=="0.000000" || localStorage.getItem("total_otros3_fin")=="0.000000" ||
        localStorage.getItem("total_otros4_fin")=="0.000000" || localStorage.getItem("total_otros5_fin")=="0.000000"){
            alertify.error("Llena todas las tablas");
        }else{
            let html='';
            html+='<div class="row static-info"><div class="col-md-5 name"> Materia prima : </div><div class="col-md-7 value"> '+materiaprima+' ('+(parseFloat(materiaprima/total)*100).toFixed(6)+' %)'+'</div></div>';
            html+='<div class="row static-info"><div class="col-md-5 name">  Material de empaque : </div><div class="col-md-7 value"> '+materiaempaque+' ('+(parseFloat(materiaempaque/total)*100).toFixed(6)+' %)'+'</div></div>';
            html+='<div class="row static-info"><div class="col-md-5 name"> Total de materias :  </div><div class="col-md-7 value"> '+total+'</div></div>';
            html+='<div class="row static-info"><div class="col-md-5 name"> Mano de obra de fabricación : </div><div class="col-md-7 value"> '+parseFloat(total_mod).toFixed(6)+'</div></div>';
            html+='<div class="row static-info"><div class="col-md-5 name"> Mano de obra acondicionado :  </div><div class="col-md-7 value"> '+parseFloat(total_moda).toFixed(6)+'</div></div>';
            html+='<div class="row static-info"><div class="col-md-5 name"> Otros indirectos :  </div><div class="col-md-7 value"> '+parseFloat(total_otros).toFixed(6)+'</div></div>';
            html+='<div class="row static-info"><div class="col-md-5 name"> Gastos administrativos : </div><div class="col-md-7 value"> '+parseFloat(gasto_admin).toFixed(6)+'</div></div>';
            html+='<hr><div class="row static-info"><div class="col-md-5 name"><strong>COSTO BATCH : </strong></div><div class="col-md-7 value" style="font-size:20px;"> <strong>'+parseFloat(costo_batch).toFixed(6)+'</strong></div></div>';
            html+='<hr><div class="row static-info"><div class="col-md-5 name"><strong>COSTO PRESENTACION : </strong></div><div class="col-md-7 value" style="font-size:20px;"> <strong>'+(parseFloat(costo_batch)/cant).toFixed(6)+'</strong></div></div>';
            html+='<hr><div class="row static-info"><div class="col-md-5 name"><strong>COSTO COSTO UNIDAD : </strong></div><div class="col-md-7 value" style="font-size:20px;"> <strong>'+(parseFloat(costo_batch)/lote).toFixed(6)+'</strong></div></div>';
            $(".body_final_reporte").html(html);

            $("#modal_reporte_final").modal("show");
        }
    });
}

$("#guardar_indicadores").on("click",function(e){
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