<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Servicio extends CI_Model{

  public function __construct()
  {
    parent::__construct();
    //Codeigniter : Write Less Do More
  }
  public function dataSelect2(){
    $this->db->select('idservicio id,vDescripcion text')->from('GCO_servicios')
            ->where('iEstado', 1);
    $query=$this->db->get();
    return $query->result();
  }
}
