$(document).ready(function(){

    var jm;

    eventos();

    function eventos(){
        $.ajax({
            url:servidor+"prd/calendario/fechas",
            type:"post",
            data:{},
            success:function(response){
                jm=JSON.parse(response);
                $('#calendarjm').fullCalendar({
                    events: jm,
                    header: {
                    left: '',
                    center: 'prev title next',
                    right: ''
                }
                });
            }
        });
    }

    $.ajax({
        url:servidor+'prd/calendario/usuarios',
        type:"post",
        success:function(data){
            let users=JSON.parse(data);
            

            $('select[name="usersjm[]"]').find('option').remove();
            $.each(users,function(i,item){
                $('select[name="usersjm[]"]').append('<option value="'+item.iduser+'">'+item.nameuser+'</option>');
            });
        }
    });
   
    $('#userjmselect2').select2({
        placeholder: "Selecciones uno o más usuarios"
    });

    /*$(".form_datetime_ini").datepicker({
        
    });

    $(".form_datetime_fin").datepicker({
        
    });*/
    
});



$(document).on('click','#main_btn_nuevo',function(e){
    e.preventDefault();
        $('#nueva_fecha h4.modal-title').html('Nueva fecha para insumo');
        $('#nueva_fecha').modal('show');
        $('input[name=user_logueado]').val(sessionStorage.idusuario);
        $('input[name=form_menu').val(sessionStorage.formulario);        
        $('input[name=fecha]').val(fechaHoy());
        $.ajax({
            url: servidor+"prd/calendario/getInsumospiloto",
            type:'post',
            data:{},
            success:function(response){
                var obj=JSON.parse(response);
                let html='<option value="">Insumo...</option>';
                $.each(obj,function(i,item){
                    html+='<option value="'+item.codigo+'">'+item.codigo+" - "+item.name+'</option>';
                });

                $("#lisInsumos").html(html);
            }
        });
});