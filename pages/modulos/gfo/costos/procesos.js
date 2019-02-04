


$("#procesarmod").on("click",function(e){
    e.preventDefault();
    //console.log("JM");
    $(".trfoot").html('<td colspan="25">TOTAL : </td>');
    let datafab=eval($("#datafabrica_para_proceso").val());
    for(var i=0;i<datafab.length;i++){
        while(datafab[i]['ind_1'] == null){
            datafab.splice(i,1);
        }
    }
    datafab.splice((datafab.length-1),1);
    var html='';
    var sumt=0;
    var sumu=0;
    $.each(datafab,function(i,item){
        html+='<tr>';
        html+='<td>'+item.vNombreProceso+'</td>';
        html+='<td>'+item.codMaquina+'</td>';
        html+='<td>'+item.ind_1+'</td>';   
        html+='<td>'+item.ind_2+'</td>';
        html+='<td>'+item.ind_3+'</td>';
        html+='<td>'+item.ind_4+'</td>';
        html+='<td>'+item.ind_5+'</td>';   
        html+='<td>'+item.operadores+'</td>';
        html+='<td>'+item.total_hh+'</td>';
        html+='<td>'+item.total_hm+'</td>';
        html+='<td>'+item.total_hp+'</td>';   
        html+='<td>'+(item.observacion == null ? 0 : item.observacion)+'</td>';
        html+='<td>'+(item.proc_1==null ? 0 : item.proc_1)+'</td>';
        html+='<td>'+(item.proc_2==null ? 0 : item.proc_2)+'</td>';
        html+='<td>'+(item.proc_3==null ? 0 : item.proc_3)+'</td>';   
        html+='<td>'+(item.proc_4==null ? 0 : item.proc_4)+'</td>';
        html+='<td>'+(item.proc_5==null ? 0 : item.proc_5)+'</td>';
        html+='<td>'+(item.proc_6==null ? 0 : item.proc_6)+'</td>';
        html+='<td>'+(item.proc_7==null ? 0 : item.proc_7)+'</td>';   
        html+='<td>'+(item.proc_8==null ? 0 : item.proc_8)+'</td>';
        html+='<td>'+(item.proc_9==null ? 0 : item.proc_9)+'</td>';
        html+='<td>'+(item.proc_10==null ? 0 : item.proc_10)+'</td>';
        html+='<td>'+(item.proc_11==null ? 0 : item.proc_11)+'</td>';   
        html+='<td>'+(item.proc_12==null ? 0 : item.proc_12)+'</td>';
        html+='<td>'+(item.proc_13==null ? 0 : item.proc_13)+'</td>';
        html+='<td><strong>'+(item.total == null ? 0 : item.total)+'</strong></td>';
        html+='<td><strong>'+(item.unidad == null ? 0 : item.unidad)+'</strong></td>';
        html+='</tr>';

        sumt+=parseFloat(item.total);
        sumu+=parseFloat(item.unidad);
    });

    var foot='<td><strong>'+sumt+'</strong></td><td><strong>'+sumu+'</strong></td>'

    $(".trfoot").append(foot);

    $(".body_fabricacion_proceso").html(html);
    
    $("#modal_calculos_mod").modal('show');

});


$(".exportarjm").on("click",function(e){
    e.preventDefault();
    alert("Aun no joven");
});

$("#procesarmod_acon").on("click",function(e){
    e.preventDefault();
    //console.log("JM");
    $(".trfoot_acon").html('<td colspan="25">TOTAL : </td>');
    let dataacon=eval($("#dataacondicionado_para_proceso").val());
    for(var i=0;i<dataacon.length;i++){
        while(dataacon[i]['ind_1'] == null){
            dataacon.splice(i,1);
        }
    }
    dataacon.splice((dataacon.length-1),1);
    var html='';
    var sumt=0;
    var sumu=0;
    $.each(dataacon,function(i,item){
        html+='<tr>';
        html+='<td>'+item.vNombreProceso+'</td>';
        html+='<td>'+item.codMaquina+'</td>';
        html+='<td>'+item.ind_1+'</td>';   
        html+='<td>'+item.ind_2+'</td>';
        html+='<td>'+item.ind_3+'</td>';
        html+='<td>'+item.ind_4+'</td>';
        html+='<td>'+item.ind_5+'</td>';   
        html+='<td>'+item.operadores+'</td>';
        html+='<td>'+item.total_hh+'</td>';
        html+='<td>'+item.total_hm+'</td>';
        html+='<td>'+item.total_hp+'</td>';   
        html+='<td>'+(item.observacion == null ? 0 : item.observacion)+'</td>';
        html+='<td>'+(item.proc_1==null ? 0 : item.proc_1)+'</td>';
        html+='<td>'+(item.proc_2==null ? 0 : item.proc_2)+'</td>';
        html+='<td>'+(item.proc_3==null ? 0 : item.proc_3)+'</td>';   
        html+='<td>'+(item.proc_4==null ? 0 : item.proc_4)+'</td>';
        html+='<td>'+(item.proc_5==null ? 0 : item.proc_5)+'</td>';
        html+='<td>'+(item.proc_6==null ? 0 : item.proc_6)+'</td>';
        html+='<td>'+(item.proc_7==null ? 0 : item.proc_7)+'</td>';   
        html+='<td>'+(item.proc_8==null ? 0 : item.proc_8)+'</td>';
        html+='<td>'+(item.proc_9==null ? 0 : item.proc_9)+'</td>';
        html+='<td>'+(item.proc_10==null ? 0 : item.proc_10)+'</td>';
        html+='<td>'+(item.proc_11==null ? 0 : item.proc_11)+'</td>';   
        html+='<td>'+(item.proc_12==null ? 0 : item.proc_12)+'</td>';
        html+='<td>'+(item.proc_13==null ? 0 : item.proc_13)+'</td>';
        html+='<td><strong>'+(item.total == null ? 0 : item.total)+'</strong></td>';
        html+='<td><strong>'+(item.unidad == null ? 0 : item.unidad)+'</strong></td>';
        html+='</tr>';

        sumt+=parseFloat(item.total);
        sumu+=parseFloat(item.unidad);
    });

    var foot='<td><strong>'+sumt+'</strong></td><td><strong>'+sumu+'</strong></td>'

    $(".trfoot_acon").append(foot);

    $(".body_fabricacion_proceso_acon").html(html);
    
    $("#modal_calculos_mod_acon").modal('show');

});

$("#procesarmoi").on("click",function(e){
    e.preventDefault();
    var valid=$("#valid_moi").val();
    if(valid==1){
        var jsonjm=$("#datamoi").val();
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

        $.each(dataacondicionado,function(i,item){
            acon+='<tr><td>'+item.nom+'</td><td>'+parseFloat(item.dato)+'</td>';
            acon+='<td>'+(datamoi[0].datoacon)+'</td><td>'+(datamoi[1].datoacon)+'</td><td>'+(datamoi[2].datoacon)+'</td>';
            totacon=(parseFloat(item.dato)*parseFloat(datamoi[0].datoacon)*parseFloat(datamoi[1].datoacon));
            uniacon=(totacon/parseFloat(datamoi[2].datoacon));
            acon+='<td><strong>'+totacon.toFixed(6)+'</strong></td><td><strong>'+uniacon.toFixed(6)+'</strong></td></tr>';
            sumtot_acon+=totacon;
            sumun_acon+=uniacon;
        });

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
        
        //return false;
        $("#modal_calculos_moi").modal("show");
    }else if(valid==2){
        alertify.error('Ingresar datos correctos');
    }else{
        alertify.error('Llenar todos los datos en la tabla');
    }
});

