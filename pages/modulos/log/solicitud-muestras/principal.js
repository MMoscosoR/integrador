$(document).ready(function(e){
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
        currentRequest = $.ajax({
            type: "POST",
            dataType : 'json', // data type es la respuesta que recibira del servidor json o html
            url: servidor+"log/muestraspiloto/",
            async: true, // IMPORTANTE PARA ESPERAR Q RESUELVA EL SQL LA CONSULTA. FALSE // SINCRONIZA // TRUE // VA DIRECTO
            beforeSend : function() {
                
            },
            success: function(datos){
              
              oTable = $('#tbl_muestraspiloto').dataTable({
                                  "stateSave":true,
                                  "ordering":true,
                                  "columns" : datos.columns,
                                  "data" : datos.rows,
                                  'order':[[0,"desc"]]

              });
              
              $('#tbl_muestraspiloto thead tr').clone(true).appendTo( '#tbl_muestraspiloto thead' );
                  $('#tbl_muestraspiloto thead tr:eq(1) th').each( function (i) {
                      
                      if(i!=0){
                      var title = $(this).text();
                      $(this).html( '<input type="text" class="form-control" placeholder="Buscar" />' );

                      $( 'input', this ).on( 'keyup change', function () {
                          if ( oTable.column(i).search() !== this.value ) {
                              oTable
                                  .column(i)
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
});