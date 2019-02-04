

function modal_factibilidad($obj){
    return '<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="'+$obj.idmodal+'">'+
                '<div class="modal-dialog modal-lg" role="document">'+
                    '<form  class="form-horizontal" id="form_factibilidad" method="post">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                                '<h4 class="modal-title" id="myModalLabel">'+$obj.titulo+'</h4>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<div class="form-group">'+
                                    '<label class="col-md-2 control-label">Mat.Inmediato</label>'+
                                    '<div class="col-md-4">'+
                                        '<input type="text" data="VMatEmpaque" class="form-control" name="VMatEmpaque">'+
                                        '<input type="hidden" name="idrequerimiento">'+
                                    '</div>'+
                                    '<label class="col-md-2 control-label">Tam. Lote:</label>'+
                                    '<div class="col-md-4">'+
                                            '<input type="text" data="iLoteTentativo" class="form-control" name="iLoteTentativo">'+
                                    '</div>'+                                 
                                '</div>'+
                                '<div class="form-group">'+
                                    '<label class="col-md-2 control-label">Producto</label>'+
                                    '<div class="col-md-4">'+
                                        '<input type="text" data="vNombreProducto" class="form-control" name="vNombreProducto">'+
                                    '</div>'+
                                    '<label class="col-md-2 control-label">Principio Activo:</label>'+
                                    '<div class="col-md-4">'+
                                            '<input type="text" data="vNombreGranel" class="form-control" name="vNombreGranel">'+
                                    '</div>'+                                 
                                '</div>'+
                                '<div id="tbl_formulas"></div>'+                      
                            '</div>'+                    
                        '</div>'+
                    '</form>'+
                '</div>'+
            '</div>';
}