$(document).on('click','.modal-analisis',function(e){
    let idreqservicio=$(this).attr('data-id');
    let indexformula=$(this).parent().parent().parent().find('td').eq(0).html();
    let idformula=$(this).parent().parent().parent().find('td').eq(1).find('input').val();

   
    $.ajax({
        url:servidor+'Formula/cargarModalanalisis',
        type:'post',
        dataType:'json',
        data:{
            idreqservicio:idreqservicio,
            indexformula:indexformula,
            idformula:idformula,
            areausuario:sessionStorage.codarea
        },
        success:function(data){
            $('#modal-planeamiento').html(data.modal);
            $('#modal-analisis').modal('show');
            
        }
    });
})