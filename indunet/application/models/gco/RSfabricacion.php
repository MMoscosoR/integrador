<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class RSfabricacion extends RequerimientoServicio{
  public $iLoteTentativo;
  public $idunidadMedida;
  public $iPrecioTentativo;
  public $cMoneda;
  public $nCambioMoneda=0;
  public $vProVentaAnual;
  public $nPrecioComercial;
  public function __construct($rs=null)
  {
    $this->iLoteTentativo=$rs['iLoteTentativo'];
    $this->idunidadMedida=$rs['idunidadMedida'];
    $this->iPrecioTentativo=$rs['iPrecioTentativo'];
    $this->cMoneda=$rs['cMoneda'];
    //$this->nCambioMoneda=$rs['nCambioMoneda'];
    $this->vProVentaAnual=$rs['vProVentaAnual'];
    $this->nPrecioComercial=$rs['nPrecioComercial'];
    parent::__construct($rs);

  }

  public function guardar(){
    $this->db->insert('GCO_requerimientoServicio', $this);
    return $this->db->affected_rows();
  }

}
