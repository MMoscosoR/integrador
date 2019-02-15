<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class RelacionReqServicios extends CI_Controller{

  public function __construct(){
    parent::__construct();
    $this->load->model(array('gco/RequerimientoServicio','gco/Cliente','gco/Servicio','sis/Area','sis/Usuario'));
    $this->load->model(array('gco/RSdocumentacion','gco/RSfabricacion'));
    $this->load->library('Helper');
  }

  function index(){
    $datos=$this->RequerimientoServicio->getRequerimientosServicios();
    $helper= new Helper();
    $response=$helper->prepararDatosGrilla($datos['cabeceras'],$datos['data']);
    $response['clientes']=$this->Cliente->dataSelect2();
    $response['servicios']=$this->Servicio->dataSelect2();
    $response['formaFarmaceutica']=$this->RequerimientoServicio->getFormaFarmaceutica();
    $response['materialesEmpaque']=$this->RequerimientoServicio->getMaterialEmpaque();
    $response['undmedida']=$this->RequerimientoServicio->getUnidadMedida();
    $response['areas']=$this->Area->getAreaSelect2();
    $response['usuarios']=$this->Usuario->getUsuariosSelect2();
    echo json_encode($response,JSON_PRETTY_PRINT);
  }
  function onClickNuevo(){
    $correlativo=$this->RequerimientoServicio->getCorrelativo(array('idformulario' => $this->input->post('idmenu'),
                                                      'iAnio'=>date('y')
                                                    ));
    $response['correlativo']=str_pad($correlativo, 3, "0", STR_PAD_LEFT).'-'.date('y');
    echo json_encode($response);
  }

  function getCliente(){
    $response['cliente']=$this->Cliente->getdatos($this->input->post());
    echo json_encode($response);
  }
  function getPrincipioActivo(){
    $sap=$this->load->database('sap',TRUE);
    $sap->select('ItemCode id,ItemName text')->from('oitm')->where_in('ItmsGrpCod',array(110,104));
    $query=$sap->get();
    echo json_encode($query->result());
  }
  function guardar(){
    //archivos
    $archivos=array();
    $status=0;
    foreach ($_FILES["archivos"]["error"] as $key => $error) {
        if ($error == UPLOAD_ERR_OK) {
             $name = $_FILES["archivos"]["name"][$key];
             $ruta = "archivos/" . date('YmdHis').'-'.$_FILES['archivos']['name'][$key];
             $adjunto = array(  'nombreDocumento'=>$name,
                                'vRuta'=>$ruta,
                                'dCreacion'=>date('Y-m-d H:i:s')
                            );
            array_push($archivos,$adjunto);
            move_uploaded_file( $_FILES["archivos"]["tmp_name"][$key], $ruta);
          }
    }
    $_POST['Jadjuntos']=json_encode($archivos);
    $_POST['vDetalleServicio']=json_encode($_POST['vDetalleServicio']);
    //volver a generar correlativo
    $_POST['vCorrelativo']=$this->RequerimientoServicio->getCorrelativo(array('idformulario' => $this->input->post('idformulario'),
                                                      'iAnio'=>date('y')
                                                    ));
    $_POST['vCorrelativo']=str_pad($_POST['vCorrelativo'], 3, "0", STR_PAD_LEFT).'-'.date('y');



    if($this->input->post('idservicio')==4){//si es documentacion
      $rsDocumentacion= new RSdocumentacion($this->input->post());

      $status=$rsDocumentacion->guardar();
      if($status==1){
        $this->RequerimientoServicio->actualizarCorrelativo(array('idformulario' =>$this->input->post('idformulario') ,
                                                                  'iAnio'=>date('y')
                                                                ));
      }
    }else{//si es cualquier otro
      $_POST['vProVentaAnual']=json_encode($this->input->post('vProVentaAnual'));
      $rsfabricacion= new RSfabricacion($this->input->post());
      $status=$rsfabricacion->guardar();
      if($status==1){
        $this->RequerimientoServicio->actualizarCorrelativo(array('idformulario' =>$this->input->post('idformulario') ,
                                                                  'iAnio'=>date('y')
                                                                ));
      }
      echo json_encode($rsfabricacion);
    }

  }
  public function onClickVisualizar(){
    $idrs=$this->input->post('idregistro');
    $requerimiento=$this->RequerimientoServicio->findBy(array('idrequerimiento' =>$idrs ));
    echo json_encode($requerimiento);
  }

}
?>
