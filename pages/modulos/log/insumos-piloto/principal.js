
$(document).ready(function(e){
    
    var oTable=null;
        currentRequest = $.ajax({
            type: "POST",
            dataType : 'json', // data type es la respuesta que recibira del servidor json o html
            url: servidor+"log/muestraspiloto/solicitudMuestra",
            async: false, // IMPORTANTE PARA ESPERAR Q RESUELVA EL SQL LA CONSULTA. FALSE // SINCRONIZA // TRUE // VA DIRECTO
            beforeSend : function() {
                
            },
            success: function(datos){
              
              oTable = $('#tbl_solitudmuestras').dataTable({
                                  "stateSave":true,
                                  "ordering":true,
                                  "columns" : datos.columns,
                                  "data" : datos.rows,
                                  'order':[[0,"desc"]]

              });
              
              $('#tbl_solitudmuestras thead tr').clone(true).appendTo( '#tbl_solitudmuestras thead' );
                  $('#tbl_solitudmuestras thead tr:eq(1) th').each( function (i) {
                      //console.log(oTable);
                      if(i!=0){
                      var title = $(this).text();
                      $(this).html( '<input type="text" class="form-control" placeholder="Buscar" />' );

                      $( 'input', this ).on( 'keyup change', function () {
                          if ( oTable.api().columns(i).search() !== this.value ) {
                              oTable.api().columns(i).search( this.value ).draw();
                          }
                      } );
                      }
                      else{
                          $(this).html('').removeClass('sorting_asc');
                      }
                  } );

            }
          });
});