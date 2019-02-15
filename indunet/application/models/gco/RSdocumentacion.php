<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class RSdocumentacion extends RequerimientoServicio{
  public $vDetalleServicio;
  public function __construct($rs=null)
  {
    $this->vDetalleServicio=($rs['vDetalleServicio']);
    parent::__construct($rs);
  }
  public function guardar(){
    $this->db->insert('GCO_requerimientoServicio', $this);
    return $this->db->affected_rows();
  }
}
