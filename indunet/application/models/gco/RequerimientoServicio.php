<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class RequerimientoServicio extends CI_Model implements JsonSerializable{
  private $idrequerimiento;
  public $vCorrelativo;
  public $idcliente;
  public $idempleado;
  public $idareaSolicitante;
  public $dSolicitud;
  public $vContacto;
  public $vTelefono;
  public $vEmail;
  public $idservicio;
  public $vNombreServicio;
  public $vNombreProducto;
  public $vNombreGranel;
  public $vPresentacion;
  public $vReferente;
  public $vCodGI;
  public $idformaFarmaceutica;
  public $vTipo;
  public $idmaterialEmpaque;
  public $vOtrosMateriales;
  public $iCajaDuplex=0;
  public $tComentarioGDV;
  public $tComentatioDRT;
  public $iStatus1=1;
  public $iStatus2=1;
  public $iEstado=1;
  public $iAprobacionByDRT;
  public $tComentarioApro;
  public $dAprobacion;
  public $Jadjuntos;
  public function __construct($requerimiento=null){

    foreach (get_object_vars($this) as $prop => $var) {

        if(isset($requerimiento[$prop])){
          $this->$prop=$requerimiento[$prop];
        }
    }
    parent::__construct();

  }
  public function jsonSerialize() {
    foreach (get_object_vars($this) as $prop => $var) {
          $json[$prop]=$var;
    }
    return $json;
  }
  public function findBy($filtro){
    $this->db->select('*')->from('GCO_requerimientoServicio')->where($filtro);
    $query=$this->db->get();
    return $query->row();
  }
  public function getRequerimientosServicios(){
    $query=$this->db->query("SELECT
                          a.idrequerimiento Código,
                          a.dSolicitud Fecha,
                          a.vCorrelativo Correlativo,
                          a.vNombreServicio Servicio,
                          a.vNombreProducto Producto,
                          c.CardName Cliente,
                          a.vNombreGranel \"Principio Activo\",
                          f.vDescripcion1 \"Forma farma\",
                          Costos='',
                          \"DRT.Conclusion\"='',
                          iStatus1 Estatus
                          FROM GCO_requerimientoServicio a
                          INNER JOIN SBO_LABORATORIOS_INDUQUIMICA_SA_2012.DBO.ocrd c ON a.idCliente  COLLATE DATABASE_DEFAULT =c.CardCode COLLATE DATABASE_DEFAULT
                          INNER JOIN SIS_formaFarmaceutica f on a.idformaFarmaceutica=f.idformaFarmaceutica
                          WHERE a.iEstado = 1 order by idrequerimiento desc ");

      $response['cabeceras']=$query->list_fields();
      $response['data']=$query->result();
      return $response;
  }
  public function getCorrelativo($filtros){
    $this->db->select('iCorrelativo')->from('SIS_correlativos')
              ->where($filtros);
    $query=$this->db->get();
    if($query->row()){
      return $query->row()->iCorrelativo + 1;
    }else{
      return 1;
    }
  }
  public function getFormaFarmaceutica(){
    $this->db->select('idformaFarmaceutica id,vDescripcion1 text')->from('SIS_formaFarmaceutica')->where('iEstado', 1);
    $query=$this->db->get();
    return $query->result();
  }
  public function getUnidadMedida(){
    $this->db->select('idunidadMedida id,vDescripcion2 text')->from('SIS_unidadMedida')->where('iEstado', 1);
    $query=$this->db->get();
    return $query->result();
  }
  public function getMaterialEmpaque(){
    $this->db->select('idMaterial id,vDescripcion text')->from('GCO_materialEmpaque')->where('iEstado', 1);
    $query=$this->db->get();
    return $query->result();
  }
  public function actualizarCorrelativo($filtros){
      $this->db->select('*')->from('SIS_correlativos')->where($filtros);
      $query=$this->db->get();
      if($query->row()){
        $this->db->set('iCorrelativo','iCorrelativo+1',FALSE);
        $this->db->set('dActualizacion',date('Y-m-d H:i:s'));
        $this->db->where($filtros);
        $this->db->update('SIS_correlativos');
      }else{
        $this->db->insert('SIS_correlativos', array('idformulario'=>$filtros['idformulario'],
                                                    'iCorrelativo'=>1,
                                                    'iAnio'=>date('y'),
                                                    'dActualizacion'=>date('Y-m-d H:i:s')
                                                    ));
      }
  }




}
